/**
 * TDLib Authentication Guard
 * 
 * Validates authentication for TDLib endpoints
 * Supports both JWT tokens and API keys
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../config/prisma.service';
import { RedisService } from '../../config/redis.service';

@Injectable()
export class TdlibAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check for authentication token/API key
    const authHeader = request.headers.authorization;
    const apiKey = request.headers['x-api-key'];

    if (!authHeader && !apiKey) {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Try JWT authentication first
    if (authHeader) {
      const token = this.extractToken(authHeader);
      if (token) {
        const jwtResult = await this.validateJWT(token, request);
        if (jwtResult.isValid) {
          request.user = jwtResult.user;
          request.session = jwtResult.session;
          return true;
        }
      }
    }

    // Try API key authentication
    if (apiKey) {
      const apiKeyResult = await this.validateApiKey(apiKey, request);
      if (apiKeyResult.isValid) {
        request.user = apiKeyResult.user;
        request.apiKey = apiKeyResult.apiKey;
        request.license = apiKeyResult.license;
        return true;
      }
    }

    throw new HttpException(
      'Invalid authentication credentials',
      HttpStatus.UNAUTHORIZED,
    );
  }

  /**
   * Extract token from Authorization header
   */
  private extractToken(authHeader: string): string | null {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }

  /**
   * Validate JWT token
   */
  private async validateJWT(
    token: string,
    request: any,
  ): Promise<{
    isValid: boolean;
    user?: any;
    session?: any;
  }> {
    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload || !payload.sub) {
        return { isValid: false };
      }

      // Validate session using AuthService
      const session = await this.authService.validateToken(token, {
        ipAddress: request.ip || request.headers['x-forwarded-for'],
        userAgent: request.headers['user-agent'],
      });

      if (!session) {
        return { isValid: false };
      }

      // Get user from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          telegramId: true,
          username: true,
          email: true,
          isActive: true,
          accountLevel: true,
        },
      });

      if (!user || !user.isActive) {
        return { isValid: false };
      }

      return {
        isValid: true,
        user,
        session,
      };
    } catch (error) {
      return { isValid: false };
    }
  }

  /**
   * Validate API key
   */
  private async validateApiKey(
    apiKey: string,
    request: any,
  ): Promise<{
    isValid: boolean;
    user?: any;
    apiKey?: any;
    license?: any;
  }> {
    try {
      // Check Redis cache first
      const cachedKey = await this.redisService.get(`api_key:${apiKey}`);
      if (cachedKey) {
        const keyData = JSON.parse(cachedKey);
        if (
          keyData.isActive &&
          (!keyData.expiresAt || new Date() < new Date(keyData.expiresAt))
        ) {
          // Get license and user
          const license = await this.prisma.license.findUnique({
            where: { id: keyData.licenseId },
            include: { user: true },
          });

          if (license && license.user.isActive) {
            // Update last used
            await this.updateApiKeyLastUsed(keyData.id);

            return {
              isValid: true,
              user: license.user,
              apiKey: keyData,
              license,
            };
          }
        }
      }

      // Check database
      const dbKey = await this.prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: {
          license: {
            include: {
              user: {
                select: {
                  id: true,
                  telegramId: true,
                  username: true,
                  email: true,
                  isActive: true,
                  accountLevel: true,
                },
              },
            },
          },
        },
      });

      if (!dbKey) {
        return { isValid: false };
      }

      // Check if active and not expired
      if (!dbKey.isActive) {
        return { isValid: false };
      }

      if (dbKey.expiresAt && new Date() > dbKey.expiresAt) {
        return { isValid: false };
      }

      // Check license and user
      if (!dbKey.license || !dbKey.license.user.isActive) {
        return { isValid: false };
      }

      // Cache the result
      await this.redisService.set(
        `api_key:${apiKey}`,
        JSON.stringify(dbKey),
        300, // 5 minutes cache
      );

      // Update last used
      await this.updateApiKeyLastUsed(dbKey.id);

      return {
        isValid: true,
        user: dbKey.license.user,
        apiKey: dbKey,
        license: dbKey.license,
      };
    } catch (error) {
      return { isValid: false };
    }
  }

  /**
   * Update API key last used timestamp
   */
  private async updateApiKeyLastUsed(apiKeyId: string): Promise<void> {
    try {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { lastUsedAt: new Date() },
      });
    } catch (error) {
      // Silently fail - not critical
    }
  }
}
