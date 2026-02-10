import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { RedisService } from '../config/redis.service';
import { ConfigService } from '@nestjs/config';
import { ApiKey, License, UsageLog } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface CreateApiKeyDto {
  licenseId: string;
  name: string;
  permissions: {
    permissions: string[];
    resources: string[];
  };
  rateLimit?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
  expiresAt?: Date;
  description?: string;
}

export interface UpdateApiKeyDto {
  name?: string;
  permissions?: {
    permissions: string[];
    resources: string[];
  };
  rateLimit?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
  expiresAt?: Date;
  isActive?: boolean;
  description?: string;
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  apiKey?: ApiKey;
  license?: License;
  permissions?: any;
  rateLimit?: any;
  violations?: Array<{
    type: string;
    message: string;
    limit: number;
    current: number;
  }>;
  reason?: string;
}

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);
  private readonly API_KEY_CACHE_TTL = 1800; // 30 minutes
  private readonly RATE_LIMIT_CACHE_TTL = 300; // 5 minutes

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  /**
   * Tạo API key mới
   */
  async createApiKey(createData: CreateApiKeyDto): Promise<ApiKey> {
    try {
      // Kiểm tra license
      const license = await this.prisma.license.findUnique({
        where: { id: createData.licenseId },
        include: { user: true }
      });

      if (!license) {
        throw new NotFoundException(`License không tồn tại: ${createData.licenseId}`);
      }

      if (license.status !== 'ACTIVE') {
        throw new BadRequestException('License không hoạt động');
      }

      // Kiểm tra số lượng API key tối đa
      const existingKeys = await this.prisma.apiKey.count({
        where: { 
          licenseId: createData.licenseId,
          isActive: true 
        }
      });

      const maxKeys = this.getMaxApiKeysForPlan(license.plan);
      if (existingKeys >= maxKeys) {
        throw new BadRequestException(`License ${license.plan} chỉ được tạo tối đa ${maxKeys} API key`);
      }

      // Tạo API key
      const key = this.generateApiKey();
      const keyHash = this.hashApiKey(key);

      const apiKey = await this.prisma.apiKey.create({
        data: {
          licenseId: createData.licenseId,
          name: createData.name,
          key,
          keyHash,
          permissions: createData.permissions,
          rateLimit: createData.rateLimit || {},
          isActive: true,
          expiresAt: createData.expiresAt,
          usageCount: 0,
          usageLimit: this.getDefaultUsageLimit(license.plan),
          usagePeriod: 'daily',
        },
        include: {
          license: {
            include: { user: true }
          }
        }
      });

      // Cache API key
      await this.cacheApiKey(apiKey);

      // Log tạo API key
      await this.logApiKeyUsage(apiKey.id, 'API_KEY_CREATED', {
        licenseId: createData.licenseId,
        permissions: createData.permissions,
        rateLimit: createData.rateLimit,
      });

      this.logger.log(`API key created: ${apiKey.id} for license: ${createData.licenseId}`);
      return apiKey;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error creating API key: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy API key theo ID
   */
  async getApiKey(id: string, includeLicense: boolean = true): Promise<ApiKey | null> {
    try {
      // Thử dụng cache trước
      const cacheKey = `api_key:${id}`;
      const cachedKey = await this.redisService.get(cacheKey);
      
      if (cachedKey) {
        return JSON.parse(cachedKey);
      }

      const query: any = { where: { id } };
      if (includeLicense) {
        query.include = {
          license: {
            include: { user: true },
          },
        };
      }

      const apiKey = await this.prisma.apiKey.findFirst(query);

      // Cache kết quả
      if (apiKey) {
        await this.cacheApiKey(apiKey);
      }

      return apiKey;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting API key ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy tất cả API keys của license
   */
  async getLicenseApiKeys(licenseId: string, includeInactive: boolean = false): Promise<ApiKey[]> {
    const where: any = { licenseId };
    
    if (!includeInactive) {
      where.isActive = true;
    }

    return this.prisma.apiKey.findMany({
      where,
      include: {
        license: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Cập nhật API key
   */
  async updateApiKey(id: string, updateData: UpdateApiKeyDto): Promise<ApiKey> {
    try {
      const existingKey = await this.prisma.apiKey.findUnique({
        where: { id },
        include: { license: true }
      });

      if (!existingKey) {
        throw new NotFoundException(`API key không tồn tại: ${id}`);
      }

      // Cập nhật API key
      const updatedKey = await this.prisma.apiKey.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          license: {
            include: { user: true }
          }
        }
      });

      // Xóa cache
      await this.invalidateApiKeyCache(id);

      // Log cập nhật
      await this.logApiKeyUsage(id, 'API_KEY_UPDATED', {
        changes: Object.keys(updateData),
      });

      this.logger.log(`API key updated: ${id}`);
      return updatedKey;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error updating API key ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Vô hiệu hóa API key
   */
  async revokeApiKey(id: string, reason: string): Promise<ApiKey> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
      include: { license: true }
    });

    if (!apiKey) {
      throw new NotFoundException(`API key không tồn tại: ${id}`);
    }

    const revokedKey = await this.prisma.apiKey.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
      include: { license: true }
    });

    // Xóa cache
    await this.invalidateApiKeyCache(id);

    // Log vô hiệu hóa
    await this.logApiKeyUsage(id, 'API_KEY_REVOKED', { reason });

    this.logger.log(`API key revoked: ${id} with reason: ${reason}`);
    return revokedKey;
  }

  /**
   * Xóa API key
   */
  async deleteApiKey(id: string): Promise<void> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id }
    });

    if (!apiKey) {
      throw new NotFoundException(`API key không tồn tại: ${id}`);
    }

    await this.prisma.apiKey.delete({
      where: { id }
    });

    // Xóa cache
    await this.invalidateApiKeyCache(id);

    // Log xóa
    await this.logApiKeyUsage(id, 'API_KEY_DELETED', {
      licenseId: apiKey.licenseId,
    });

    this.logger.log(`API key deleted: ${id}`);
  }

  /**
   * Tạo lại API key
   */
  async regenerateApiKey(id: string): Promise<ApiKey> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
      include: { license: true }
    });

    if (!apiKey) {
      throw new NotFoundException(`API key không tồn tại: ${id}`);
    }

    // Tạo key mới
    const newKey = this.generateApiKey();
    const newKeyHash = this.hashApiKey(newKey);

    const regeneratedKey = await this.prisma.apiKey.update({
      where: { id },
      data: {
        key: newKey,
        keyHash: newKeyHash,
        updatedAt: new Date(),
      },
      include: { license: true }
    });

    // Xóa cache cũ
    await this.invalidateApiKeyCache(id);

    // Log tạo lại
    await this.logApiKeyUsage(id, 'API_KEY_REGENERATED', {
      oldKeyHash: apiKey.keyHash,
      newKeyHash: newKeyHash,
    });

    this.logger.log(`API key regenerated: ${id}`);
    return regeneratedKey;
  }

  /**
   * Kiểm tra và xác thực API key
   */
  async validateApiKey(key: string, context?: {
    ipAddress?: string;
    userAgent?: string;
    resource?: string;
    action?: string;
  }): Promise<ApiKeyValidationResult> {
    try {
      // Tìm API key theo key
      const apiKey = await this.prisma.apiKey.findFirst({
        where: { key },
        include: {
          license: {
            include: { user: true }
          }
        }
      });

      if (!apiKey) {
        return {
          isValid: false,
          reason: 'API key không tồn tại',
        };
      }

      // Kiểm tra API key có hoạt động không
      if (!apiKey.isActive) {
        return {
          isValid: false,
          reason: 'API key đã bị vô hiệu hóa',
        };
      }

      // Kiểm tra license
      if (apiKey.license.status !== 'ACTIVE') {
        return {
          isValid: false,
          reason: 'License không hoạt động',
        };
      }

      // Kiểm tra ngày hết hạn
      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return {
          isValid: false,
          reason: 'API key đã hết hạn',
        };
      }

      // Kiểm tra giới hạn sử dụng
      const violations = await this.checkUsageLimits(apiKey, context);

      if (violations.length > 0) {
        return {
          isValid: false,
          apiKey,
          license: apiKey.license,
          permissions: apiKey.permissions,
          rateLimit: apiKey.rateLimit,
          violations,
          reason: 'Vượt quá giới hạn sử dụng',
        };
      }

      // Cập nhật thông tin sử dụng
      await this.updateApiKeyUsage(apiKey.id, context);

      return {
        isValid: true,
        apiKey,
        license: apiKey.license,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
      };

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error validating API key: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy thống kê sử dụng API key
   */
  async getApiKeyMetrics(apiKeyId: string, days: number = 30): Promise<any> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      apiKey,
      recentUsage,
      usageStats
    ] = await Promise.all([
      this.prisma.apiKey.findUnique({
        where: { id: apiKeyId },
        include: {
          license: {
            include: { user: true }
          }
        }
      }),
      this.prisma.usageLog.findMany({
        where: {
          apiKeyId,
          createdAt: { gte: since }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      this.prisma.apiKeyUsage.findMany({
        where: {
          apiKeyId,
          date: { gte: since }
        },
        orderBy: { date: 'desc' }
      })
    ]);

    return {
      apiKey,
      recentUsage,
      usageStats,
      summary: this.calculateApiKeyUsageSummary(recentUsage),
      trends: this.calculateApiKeyUsageTrends(usageStats)
    };
  }

  // Private helper methods

  private generateApiKey(): string {
    const prefix = 'tg_';
    const randomPart = uuidv4().replace(/-/g, '');
    return `${prefix}${randomPart}`;
  }

  private hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  private getMaxApiKeysForPlan(plan: string): number {
    const limits = {
      BASIC: 1,
      PREMIUM: 3,
      ENTERPRISE: 10,
      CUSTOM: 50
    };

    return limits[plan as keyof typeof limits] ?? 1;
  }

  private getDefaultUsageLimit(plan: string): number {
    const limits = {
      BASIC: 1000,
      PREMIUM: 10000,
      ENTERPRISE: 100000,
      CUSTOM: 1000000
    };

    return limits[plan as keyof typeof limits] ?? 1000;
  }

  private async cacheApiKey(apiKey: ApiKey): Promise<void> {
    const cacheKey = `api_key:${apiKey.id}`;
    await this.redisService.set(cacheKey, JSON.stringify(apiKey), this.API_KEY_CACHE_TTL);
  }

  private async invalidateApiKeyCache(id: string): Promise<void> {
    const cacheKey = `api_key:${id}`;
    await this.redisService.del(cacheKey);
  }

  private async checkUsageLimits(apiKey: ApiKey, context?: any): Promise<Array<{
    type: string;
    message: string;
    limit: number;
    current: number;
  }>> {
    const violations = [];

    // Kiểm tra giới hạn sử dụng hàng ngày
    if (apiKey.usageLimit) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayUsage = await this.prisma.usageLog.count({
        where: {
          apiKeyId: apiKey.id,
          createdAt: { gte: today }
        }
      });

      if (todayUsage >= apiKey.usageLimit) {
        violations.push({
          type: 'DAILY_USAGE_LIMIT',
          message: `Vượt quá giới hạn sử dụng hàng ngày (${apiKey.usageLimit})`,
          limit: apiKey.usageLimit,
          current: todayUsage,
        });
      }
    }

    // Kiểm tra rate limit
    if (apiKey.rateLimit) {
      const rateLimit = apiKey.rateLimit as any;
      
      // Kiểm tra rate limit per minute
      if (rateLimit.requestsPerMinute) {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const minuteUsage = await this.prisma.usageLog.count({
          where: {
            apiKeyId: apiKey.id,
            createdAt: { gte: oneMinuteAgo }
          }
        });

        if (minuteUsage >= rateLimit.requestsPerMinute) {
          violations.push({
            type: 'RATE_LIMIT_PER_MINUTE',
            message: `Vượt quá rate limit/phút (${rateLimit.requestsPerMinute})`,
            limit: rateLimit.requestsPerMinute,
            current: minuteUsage,
          });
        }
      }

      // Kiểm tra rate limit per hour
      if (rateLimit.requestsPerHour) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const hourUsage = await this.prisma.usageLog.count({
          where: {
            apiKeyId: apiKey.id,
            createdAt: { gte: oneHourAgo }
          }
        });

        if (hourUsage >= rateLimit.requestsPerHour) {
          violations.push({
            type: 'RATE_LIMIT_PER_HOUR',
            message: `Vượt quá rate limit/giờ (${rateLimit.requestsPerHour})`,
            limit: rateLimit.requestsPerHour,
            current: hourUsage,
          });
        }
      }
    }

    return violations;
  }

  private async updateApiKeyUsage(apiKeyId: string, context?: any): Promise<void> {
    // Cập nhật usage count
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      }
    });

    // Log usage
    await this.logApiKeyUsage(apiKeyId, 'API_KEY_USED', context);
  }

  private async logApiKeyUsage(apiKeyId: string, action: string, metadata?: any): Promise<void> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
      include: { license: true }
    });

    if (!apiKey || !apiKey.license) return;

    await this.prisma.usageLog.create({
      data: {
        userId: apiKey.license.userId,
        licenseId: apiKey.licenseId,
        apiKeyId,
        action,
        metadata: metadata || {},
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });
  }

  private calculateApiKeyUsageSummary(usageLogs: UsageLog[]): any {
    const summary = {
      total_requests: usageLogs.length,
      actions: {} as Record<string, number>,
      avg_response_time: 0,
      success_rate: 0,
      hourly_distribution: {} as Record<string, number>,
      resource_distribution: {} as Record<string, number>,
    };

    let totalResponseTime = 0;
    let successCount = 0;

    usageLogs.forEach(log => {
      // Count by action
      summary.actions[log.action] = (summary.actions[log.action] || 0) + 1;
      
      // Response time
      if (log.responseTime) {
        totalResponseTime += log.responseTime;
      }
      
      // Success rate
      if (log.statusCode && log.statusCode < 400) {
        successCount++;
      }
      
      // Hourly distribution
      const hour = new Date(log.createdAt).getHours().toString();
      summary.hourly_distribution[hour] = (summary.hourly_distribution[hour] || 0) + 1;
      
      // Resource distribution
      if (log.resource) {
        summary.resource_distribution[log.resource] = (summary.resource_distribution[log.resource] || 0) + 1;
      }
    });

    summary.avg_response_time = summary.total_requests > 0 ? totalResponseTime / summary.total_requests : 0;
    summary.success_rate = summary.total_requests > 0 ? (successCount / summary.total_requests) * 100 : 0;

    return summary;
  }

  private calculateApiKeyUsageTrends(usageStats: any[]): any {
    if (usageStats.length === 0) {
      return {
        trend: 'stable',
        growth_rate: 0,
        peak_usage: null,
      };
    }

    const sortedStats = usageStats.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstStat = sortedStats[0];
    const lastStat = sortedStats[sortedStats.length - 1];

    const requestsGrowth = lastStat.requests - firstStat.requests;
    const growthRate = firstStat.requests > 0 
      ? (requestsGrowth / firstStat.requests) * 100 
      : 0;

    // Find peak usage day
    const peakDay = sortedStats.reduce((max, current) => 
      current.requests > max.requests ? current : max
    , firstStat);

    return {
      trend: growthRate > 10 ? 'increasing' : growthRate < -10 ? 'decreasing' : 'stable',
      growth_rate: growthRate,
      peak_usage: {
        date: peakDay.date,
        requests: peakDay.requests,
        bytes: peakDay.bytes,
      },
      period: {
        start: firstStat.date,
        end: lastStat.date,
        days: sortedStats.length,
      }
    };
  }
}