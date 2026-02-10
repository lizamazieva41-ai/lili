import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { RedisService } from '../config/redis.service';
import { ConfigService } from '@nestjs/config';
import { 
  License, 
  ApiKey, 
  UsageLog, 
  LicenseMetrics,
  LicensePlan,
  LicenseStatus,
  BillingCycle,
  User
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface CreateLicenseDto {
  userId: string;
  plan: LicensePlan;
  billingCycle: BillingCycle;
  autoRenew?: boolean;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  expiresAt?: Date;
  trialEndsAt?: Date;
  paymentMethodId?: string;
}

export interface UpdateLicenseDto {
  plan?: LicensePlan;
  status?: LicenseStatus;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  expiresAt?: Date;
  autoRenew?: boolean;
  trialEndsAt?: Date;
  nextBillingAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface LicenseUsage {
  userId: string;
  licenseId: string;
  apiKeyId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  cost?: number;
  ipAddress?: string;
  userAgent?: string;
  responseTime?: number;
  statusCode?: number;
}

export interface LicenseCheckResult {
  isValid: boolean;
  license?: License;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  usage?: Record<string, any>;
  violations?: Array<{
    type: string;
    message: string;
    limit: number;
    current: number;
  }>;
  reason?: string;
}

@Injectable()
export class LicensingService {
  private readonly logger = new Logger(LicensingService.name);
  private readonly LICENSE_CACHE_TTL = 3600; // 1 hour
  private readonly USAGE_AGGREGATION_TTL = 300; // 5 minutes

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  /**
   * Tạo license mới cho người dùng
   */
  async createLicense(licenseData: CreateLicenseDto): Promise<License> {
    try {
      // Kiểm tra user có license đang hoạt động không
      const existingLicense = await this.getActiveLicense(licenseData.userId);
      
      if (existingLicense && licenseData.plan !== LicensePlan.CUSTOM) {
        throw new BadRequestException(`Người dùng đã có license ${existingLicense.plan} đang hoạt động`);
      }

      // Tính toán ngày hết hạn
      const now = new Date();
      const expiresAt = licenseData.expiresAt || this.calculateExpiryDate(
        licenseData.plan,
        licenseData.billingCycle,
        now
      );

      // Xác định features và limits theo gói
      const planConfig = this.getPlanConfiguration(licenseData.plan);
      const features = { ...planConfig.features, ...licenseData.features };
      const limits = { ...planConfig.limits, ...licenseData.limits };

      // Tạo license
      const license = await this.prisma.license.create({
        data: {
          userId: licenseData.userId,
          plan: licenseData.plan,
          status: licenseData.expiresAt && licenseData.expiresAt > now ? LicenseStatus.ACTIVE : LicenseStatus.EXPIRED,
          billingCycle: licenseData.billingCycle,
          expiresAt,
          trialEndsAt: licenseData.trialEndsAt,
          autoRenew: licenseData.autoRenew ?? true,
          features,
          limits,
          usage: this.initializeUsage(limits),
          paymentMethodId: licenseData.paymentMethodId,
        },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              accountLevel: true,
            }
          },
          apiKeys: true,
          usageLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      // Cache license
      await this.cacheLicense(license);

      // Log tạo license
      await this.logUsage({
        userId: license.userId,
        licenseId: license.id,
        action: 'LICENSE_CREATED',
        metadata: {
          plan: license.plan,
          billingCycle: license.billingCycle,
          features,
          limits,
        },
      });

      this.logger.log(`License created: ${license.id} for user: ${license.userId} with plan: ${license.plan}`);
      return license;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error creating license: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Cập nhật license
   */
  async updateLicense(id: string, updateData: UpdateLicenseDto): Promise<License> {
    try {
      const existingLicense = await this.prisma.license.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!existingLicense) {
        throw new NotFoundException(`License không tồn tại: ${id}`);
      }

      // Cập nhật license
      const updatedLicense = await this.prisma.license.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          user: true,
          apiKeys: true,
          usageLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      // Xóa cache
      await this.invalidateLicenseCache(updatedLicense.userId);

      // Log cập nhật
      await this.logUsage({
        userId: updatedLicense.userId,
        licenseId: updatedLicense.id,
        action: 'LICENSE_UPDATED',
        metadata: {
          oldStatus: existingLicense.status,
          newStatus: updatedLicense.status,
          changes: Object.keys(updateData),
        },
      });

      this.logger.log(`License updated: ${updatedLicense.id} for user: ${updatedLicense.userId}`);
      return updatedLicense;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error updating license: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy license đang hoạt động của user
   */
  async getActiveLicense(userId: string): Promise<License | null> {
    try {
      // Thử dụng cache trước
      const cacheKey = `license:active:${userId}`;
      const cachedLicense = await this.redisService.get(cacheKey);
      
      if (cachedLicense) {
        return JSON.parse(cachedLicense);
      }

      // Query database
      const license = await this.prisma.license.findFirst({
        where: {
          userId,
          status: LicenseStatus.ACTIVE,
          OR: [
            { expiresAt: { gt: new Date() } },
            { trialEndsAt: { gt: new Date() } }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              email: true,
              accountLevel: true,
            }
          },
          apiKeys: {
            where: { isActive: true }
          },
          usageLogs: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Cache kết quả
      if (license) {
        await this.cacheLicense(license);
      }

      return license;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting active license for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Kiểm tra license và permissions
   */
  async checkLicense(userId: string, requiredFeatures?: string[]): Promise<LicenseCheckResult> {
    try {
      const license = await this.getActiveLicense(userId);
      
      if (!license) {
        return {
          isValid: false,
          reason: 'Không có license đang hoạt động',
        };
      }

      // Kiểm tra license đã hết hạn chưa
      const now = new Date();
      const isExpired = license.expiresAt && license.expiresAt < now;
      
      if (isExpired) {
        // Cập nhật trạng thái license
        await this.updateLicense(license.id, { status: LicenseStatus.EXPIRED });
        await this.invalidateLicenseCache(userId);
        
        return {
          isValid: false,
          reason: 'License đã hết hạn',
        };
      }

      // Kiểm tra các features được yêu cầu
      const featuresObj =
        license.features && typeof license.features === 'object'
          ? (license.features as Record<string, any>)
          : {};
      const limitsObj =
        license.limits && typeof license.limits === 'object'
          ? (license.limits as Record<string, any>)
          : {};

      const violations: Array<{
        type: string;
        message: string;
        limit: number;
        current: number;
      }> = [];

      if (requiredFeatures) {
        for (const feature of requiredFeatures) {
          if (!this.hasFeature(featuresObj, feature)) {
            violations.push({
              type: 'FEATURE_NOT_AVAILABLE',
              message: `Feature ${feature} không có trong gói ${license.plan}`,
              limit: 0,
              current: 0,
            });
          }
        }
      }

      // Kiểm tra violations
      if (violations.length > 0) {
        return {
          isValid: false,
          license,
          features: featuresObj,
          limits: limitsObj,
          usage: license.usage as any,
          violations,
          reason: 'License không đủ quyền',
        };
      }

      return {
        isValid: true,
        license,
        features: featuresObj,
        limits: limitsObj,
        usage: license.usage as any,
      };

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error checking license for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy tất cả licenses của user
   */
  async getUserLicenses(userId: string, includeInactive: boolean = false): Promise<License[]> {
    const where: any = { userId };
    
    if (!includeInactive) {
      where.status = LicenseStatus.ACTIVE;
    }

    return this.prisma.license.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            username: true,
            email: true,
          }
        },
        apiKeys: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Hủy license
   */
  async cancelLicense(licenseId: string, reason: string, userId: string): Promise<License> {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      include: { user: true }
    });

    if (!license) {
      throw new NotFoundException(`License không tồn tại: ${licenseId}`);
    }

    if (license.userId !== userId) {
      throw new BadRequestException('Không thể hủy license của người khác');
    }

    const updatedLicense = await this.prisma.license.update({
      where: { id: licenseId },
      data: {
        status: LicenseStatus.CANCELLED,
        autoRenew: false,
        cancelledAt: new Date(),
        cancellationReason: reason,
        updatedAt: new Date(),
      },
      include: { user: true }
    });

    // Xóa cache
    await this.invalidateLicenseCache(userId);

    // Log hủy license
    await this.logUsage({
      userId,
      licenseId,
      action: 'LICENSE_CANCELLED',
      metadata: { reason }
    });

    this.logger.log(`License cancelled: ${licenseId} for user: ${userId}`);
    return updatedLicense;
  }

  /**
   * Gia hạn license
   */
  async renewLicense(licenseId: string, paymentMethodId?: string): Promise<License> {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      include: { user: true }
    });

    if (!license) {
      throw new NotFoundException(`License không tồn tại: ${licenseId}`);
    }

    if (license.status !== LicenseStatus.EXPIRED && license.status !== LicenseStatus.CANCELLED) {
      throw new BadRequestException('License vẫn còn hiệu lực');
    }

    // Tính toán ngày hết hạn mới
    const newExpiresAt = this.calculateExpiryDate(
      license.plan,
      license.billingCycle,
      new Date()
    );

    const renewedLicense = await this.prisma.license.update({
      where: { id: licenseId },
      data: {
        status: LicenseStatus.ACTIVE,
        expiresAt: newExpiresAt,
        lastBilledAt: new Date(),
        nextBillingAt: this.calculateNextBilling(newExpiresAt, license.billingCycle),
        cancelledAt: null,
        cancellationReason: null,
        updatedAt: new Date(),
        ...(paymentMethodId && { paymentMethodId }),
      },
      include: { user: true }
    });

    // Xóa cache
    await this.invalidateLicenseCache(license.userId);

    // Log gia hạn
    await this.logUsage({
      userId: license.userId,
      licenseId,
      action: 'LICENSE_RENEWED',
      metadata: {
        oldExpiresAt: license.expiresAt,
        newExpiresAt,
        billingCycle: license.billingCycle,
      }
    });

    this.logger.log(`License renewed: ${licenseId} for user: ${license.userId}`);
    return renewedLicense;
  }

  /**
   * Lấy thống kê sử dụng license
   */
  async getLicenseMetrics(licenseId: string, days: number = 30): Promise<any> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      license,
      recentMetrics,
      recentUsage
    ] = await Promise.all([
        this.prisma.license.findUnique({
          where: { id: licenseId },
          include: { user: true }
        }),
        this.prisma.licenseMetrics.findMany({
          where: {
            licenseId,
            date: { gte: since }
          },
          orderBy: { date: 'desc' }
        }),
        this.prisma.usageLog.findMany({
          where: {
            licenseId,
            createdAt: { gte: since }
          },
          orderBy: { createdAt: 'desc' },
          take: 100
        })
      ]);

    return {
      license,
      metrics: recentMetrics,
      recentUsage,
      summary: this.calculateUsageSummary(recentUsage),
      trends: this.calculateUsageTrends(recentMetrics)
    };
  }

  // Private helper methods

  private getPlanConfiguration(plan: LicensePlan) {
    const plans = {
      [LicensePlan.BASIC]: {
        features: {
          single_account: true,
          basic_messaging: true,
          simple_analytics: true,
          community_support: true,
        },
        limits: {
          accounts: 1,
          messages_per_day: 100,
          api_calls_per_hour: 100,
          storage_gb: 10,
          bandwidth_gb: 50,
          concurrent_jobs: 2,
        }
      },
      [LicensePlan.PREMIUM]: {
        features: {
          multiple_accounts: true,
          bulk_messaging: true,
          analytics: true,
          email_support: true,
          api_access: true,
          basic_webhooks: true,
          advanced_analytics: true,
        },
        limits: {
          accounts: 10,
          messages_per_day: 1000,
          api_calls_per_hour: 1000,
          storage_gb: 100,
          bandwidth_gb: 500,
          concurrent_jobs: 5,
          webhooks_per_hour: 10,
        }
      },
      [LicensePlan.ENTERPRISE]: {
        features: {
          unlimited_accounts: true,
          unlimited_messages: true,
          priority_support: true,
          custom_integrations: true,
          api_access: true,
          advanced_webhooks: true,
          dedicated_account_manager: true,
          sla_guarantee: true,
          custom_features: true,
        },
        limits: {
          accounts: 999999,
          messages_per_day: 999999,
          api_calls_per_hour: 10000,
          storage_gb: 1000,
          bandwidth_gb: 10000,
          concurrent_jobs: 50,
          webhooks_per_hour: 100,
          custom_integrations: 999,
        }
      },
      [LicensePlan.CUSTOM]: {
        features: {},
        limits: {}
      }
    };

    return plans[plan] || plans[LicensePlan.BASIC];
  }

  private calculateExpiryDate(plan: LicensePlan, billingCycle: BillingCycle, startDate: Date): Date {
    const durations = {
      [BillingCycle.MONTHLY]: 1,
      [BillingCycle.QUARTERLY]: 3,
      [BillingCycle.YEARLY]: 12,
      [BillingCycle.LIFETIME]: 120, // 10 years
    };

    const months = durations[billingCycle] || 1;
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    return expiryDate;
  }

  private calculateNextBilling(expiresAt: Date, billingCycle: BillingCycle): Date {
    const durations = {
      [BillingCycle.MONTHLY]: 1,
      [BillingCycle.QUARTERLY]: 3,
      [BillingCycle.YEARLY]: 12,
      [BillingCycle.LIFETIME]: 120, // 10 years
    };

    const months = durations[billingCycle] || 1;
    const nextBilling = new Date(expiresAt);
    nextBilling.setMonth(nextBilling.getMonth() + months);

    return nextBilling;
  }

  private initializeUsage(limits: Record<string, any>): Record<string, any> {
    const usage: Record<string, any> = {};
    
    Object.keys(limits).forEach(key => {
      if (key.includes('per_day')) {
        usage[key] = { today: 0, reset_at: this.getTomorrowMidnight() };
      } else if (key.includes('per_hour')) {
        usage[key] = { current_hour: 0, reset_at: this.getNextHour() };
      } else if (typeof limits[key] === 'number') {
        usage[key] = 0;
      }
    });

    return usage;
  }

  private getTomorrowMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  private getNextHour(): Date {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return nextHour;
  }

  private hasFeature(features: Record<string, any>, feature: string): boolean {
    return features[feature] === true || features[feature] === 'enabled';
  }

  private async cacheLicense(license: License): Promise<void> {
    const cacheKey = `license:active:${license.userId}`;
    await this.redisService.set(cacheKey, JSON.stringify(license), this.LICENSE_CACHE_TTL);
  }

  private async invalidateLicenseCache(userId: string): Promise<void> {
    const cacheKey = `license:active:${userId}`;
    await this.redisService.del(cacheKey);
  }

  private async logUsage(usageData: LicenseUsage): Promise<void> {
    await this.prisma.usageLog.create({
      data: {
        userId: usageData.userId,
        licenseId: usageData.licenseId,
        apiKeyId: usageData.apiKeyId,
        action: usageData.action,
        resource: usageData.resource,
        resourceId: usageData.resourceId,
        metadata: usageData.metadata || {},
        cost: usageData.cost,
        ipAddress: usageData.ipAddress,
        userAgent: usageData.userAgent,
        responseTime: usageData.responseTime,
        statusCode: usageData.statusCode,
      },
    });

    // Update license usage
    await this.updateLicenseUsage(usageData.licenseId, usageData.action);
  }

  private async updateLicenseUsage(licenseId: string, action: string): Promise<void> {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license) return;

    const usage = license.usage as any;
    
    // Update usage counters based on action
    switch (action) {
      case 'MESSAGE_SENT':
        usage.messages_today = (usage.messages_today || 0) + 1;
        break;
      case 'API_CALL':
        usage.api_calls_current_hour = (usage.api_calls_current_hour || 0) + 1;
        break;
      case 'ACCOUNT_CREATED':
        usage.accounts = (usage.accounts || 0) + 1;
        break;
      // Add more action handlers as needed
    }

    await this.prisma.license.update({
      where: { id: licenseId },
      data: { usage }
    });

    // Invalidate cache
    await this.invalidateLicenseCache(license.userId);
  }

  private calculateUsageSummary(usageLogs: UsageLog[]): any {
    const summary = {
      total_requests: usageLogs.length,
      actions: {} as Record<string, number>,
      avg_response_time: 0,
      success_rate: 0,
      cost_total: 0,
      hourly_distribution: {} as Record<string, number>,
    };

    let totalResponseTime = 0;
    let successCount = 0;
    let totalCost = 0;

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
      
      // Cost
      if (log.cost) {
        totalCost += (log.cost as any).toNumber ? (log.cost as any).toNumber() : Number(log.cost);
      }
      
      // Hourly distribution
      const hour = new Date(log.createdAt).getHours().toString();
      summary.hourly_distribution[hour] = (summary.hourly_distribution[hour] || 0) + 1;
    });

    summary.avg_response_time = summary.total_requests > 0 ? totalResponseTime / summary.total_requests : 0;
    summary.success_rate = summary.total_requests > 0 ? (successCount / summary.total_requests) * 100 : 0;
    summary.cost_total = totalCost;

    return summary;
  }

  private calculateUsageTrends(metrics: LicenseMetrics[]): any {
    if (metrics.length === 0) {
      return {
        trend: 'stable',
        growth_rate: 0,
        peak_usage: null,
      };
    }

    const sortedMetrics = metrics.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstMetric = sortedMetrics[0];
    const lastMetric = sortedMetrics[sortedMetrics.length - 1];

    const totalRequestsGrowth = lastMetric.totalRequests - firstMetric.totalRequests;
    const growthRate = firstMetric.totalRequests > 0 
      ? (totalRequestsGrowth / firstMetric.totalRequests) * 100 
      : 0;

    // Find peak usage day
    const peakDay = sortedMetrics.reduce((max, current) => 
      current.totalRequests > max.totalRequests ? current : max
    , firstMetric);

    return {
      trend: growthRate > 5 ? 'increasing' : growthRate < -5 ? 'decreasing' : 'stable',
      growth_rate: growthRate,
      peak_usage: {
        date: peakDay.date,
        requests: peakDay.totalRequests,
      },
      period: {
        start: firstMetric.date,
        end: lastMetric.date,
        days: sortedMetrics.length,
      }
    };
  }
}