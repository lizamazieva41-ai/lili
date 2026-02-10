import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../config/redis.service';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract API key from header or query parameter
    const apiKey = this.extractApiKey(request);
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Validate API key
    const keyValidation = await this.validateApiKey(apiKey);
    if (!keyValidation.isValid) {
      throw new UnauthorizedException(`Invalid API key: ${keyValidation.reason}`);
    }

    // Get API key details
    const apiKeyDetails = await this.getApiKeyDetails(apiKey);
    if (!apiKeyDetails) {
      throw new UnauthorizedException('API key not found');
    }

    // Check if API key is active
    if (!apiKeyDetails.isActive) {
      throw new UnauthorizedException('API key is inactive');
    }

    // Check expiration
    if (apiKeyDetails.expiresAt && new Date() > apiKeyDetails.expiresAt) {
      throw new UnauthorizedException('API key has expired');
    }

    // Update last used timestamp
    await this.updateLastUsed(apiKeyDetails.id);

    // Get license and user information
    const license = await this.prisma.license.findUnique({
      where: { id: apiKeyDetails.licenseId },
      include: { user: { select: { id: true, isActive: true } } },
    });

    if (!license || !license.user.isActive) {
      throw new UnauthorizedException('License or user is inactive');
    }

    // Attach context to request
    request.apiKey = apiKeyDetails;
    request.license = license;
    request.user = license.user;

    // Check required permissions
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (requiredPermissions) {
      const keyPermissions = (apiKeyDetails.permissions as any)?.permissions || [];
      const hasAllPermissions = requiredPermissions.every(perm => 
        keyPermissions.includes(perm) || keyPermissions.includes('*')
      );

      if (!hasAllPermissions) {
        throw new UnauthorizedException('Insufficient permissions');
      }
    }

    return true;
  }

  private extractApiKey(request: any): string | null {
    // Try Authorization header first
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, key] = authHeader.split(' ');
      if (type === 'ApiKey') {
        return key;
      }
    }

    // Try X-API-Key header
    const xApiKey = request.headers['x-api-key'];
    if (xApiKey) {
      return xApiKey;
    }

    // Try query parameter
    return request.query.api_key || null;
  }

  private async validateApiKey(apiKey: string): Promise<{ isValid: boolean; reason?: string }> {
    try {
      // Check Redis cache first
      const cachedKey = await this.redisService.get(`api_key:${apiKey}`);
      if (cachedKey) {
        const keyData = JSON.parse(cachedKey);
        return { 
          isValid: keyData.isActive && (!keyData.expiresAt || new Date() < keyData.expiresAt),
          reason: keyData.isActive ? 'Valid' : 'Key inactive'
        };
      }

      // Check database
      const dbKey = await this.prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { license: { include: { user: true } } },
      });

      if (!dbKey) {
        return { isValid: false, reason: 'API key not found' };
      }

      // Cache the result
      await this.redisService.set(
        `api_key:${apiKey}`,
        JSON.stringify(dbKey),
        300 // 5 minutes cache
      );

      return { 
        isValid: dbKey.isActive && (!dbKey.expiresAt || new Date() < dbKey.expiresAt),
        reason: dbKey.isActive ? 'Valid' : 'Key inactive'
      };
    } catch (error) {
      return { isValid: false, reason: 'Validation error' };
    }
  }

  private async getApiKeyDetails(apiKey: string) {
    // Try Redis cache first
    const cachedKey = await this.redisService.get(`api_key:${apiKey}`);
    if (cachedKey) {
      return JSON.parse(cachedKey);
    }

    // Fallback to database
    const dbKey = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (dbKey) {
      // Cache for 5 minutes
      await this.redisService.set(
        `api_key:${apiKey}`,
        JSON.stringify(dbKey),
        300
      );
    }

    return dbKey;
  }

  private async updateLastUsed(apiKeyId: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() },
    });

    // Invalidate cache
    const apiKey = await this.getApiKeyById(apiKeyId);
    if (apiKey) {
      await this.redisService.del(`api_key:${apiKey.key}`);
    }
  }

  private async getApiKeyById(apiKeyId: string) {
    return this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });
  }
}