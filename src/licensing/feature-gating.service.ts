import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { RedisService } from '../config/redis.service';
import { ConfigService } from '@nestjs/config';
import { License, User } from '@prisma/client';

export interface Feature {
  name: string;
  description: string;
  requiredPlan?: string[];
  requiredFeatures?: string[];
  dependencies?: string[];
  config?: Record<string, any>;
  experimental?: boolean;
}

export interface FeatureCheckResult {
  allowed: boolean;
  feature?: Feature;
  reason?: string;
  license?: License;
  user?: User;
  violations?: Array<{
    type: string;
    message: string;
    requirement: string;
    current: any;
  }>;
}

export interface FeatureConfig {
  features: Record<string, Feature>;
  planFeatures: Record<string, string[]>;
  globalFeatures: string[];
  experimentalFeatures: string[];
}

@Injectable()
export class FeatureGatingService {
  private readonly logger = new Logger(FeatureGatingService.name);
  private readonly FEATURE_CACHE_TTL = 1800; // 30 minutes
  private readonly USER_FEATURE_CACHE_TTL = 900; // 15 minutes

  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {
    this.initializeFeatureConfig();
  }

  /**
   * Kiểm tra quyền truy cập feature
   */
  async checkFeature(
    userId: string,
    featureName: string,
    context?: {
      resource?: string;
      action?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<FeatureCheckResult> {
    try {
      // Lấy thông tin user và license
      const userLicense = await this.getUserLicense(userId);
      
      if (!userLicense) {
        return {
          allowed: false,
          reason: 'Người dùng không có license',
        };
      }

      // Lấy thông tin feature
      const feature = await this.getFeature(featureName);
      
      if (!feature) {
        return {
          allowed: false,
          reason: `Feature không tồn tại: ${featureName}`,
        };
      }

      // Kiểm tra experimental features
      if (this.isExperimentalFeature(featureName)) {
        const experimentalAccess = await this.checkExperimentalAccess(userLicense.user);
        if (!experimentalAccess) {
          return {
            allowed: false,
            feature,
            reason: 'Feature đang trong giai đoạn thử nghiệm',
          };
        }
      }

      // Kiểm tra plan requirements
      const violations = await this.checkPlanRequirements(
        userLicense.license,
        feature,
        context
      );

      if (violations.length > 0) {
        return {
          allowed: false,
          feature,
          license: userLicense.license,
          user: userLicense.user,
          violations,
          reason: 'Không đủ quyền truy cập feature',
        };
      }

      // Kiểm tra dependencies
      const dependencyViolations = await this.checkDependencies(
        userLicense.license,
        feature,
        context
      );

      if (dependencyViolations.length > 0) {
        return {
          allowed: false,
          feature,
          license: userLicense.license,
          user: userLicense.user,
          violations: dependencyViolations,
          reason: 'Thiếu các feature phụ thuộc',
        };
      }

      // Kiểm tra usage limits
      const usageViolations = await this.checkUsageLimits(
        userLicense.license,
        feature,
        context
      );

      if (usageViolations.length > 0) {
        return {
          allowed: false,
          feature,
          license: userLicense.license,
          user: userLicense.user,
          violations: usageViolations,
          reason: 'Vượt quá giới hạn sử dụng',
        };
      }

      return {
        allowed: true,
        feature,
        license: userLicense.license,
        user: userLicense.user,
      };

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error checking feature ${featureName} for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy danh sách features được phép cho user
   */
  async getAllowedFeatures(userId: string): Promise<string[]> {
    try {
      const userLicense = await this.getUserLicense(userId);
      
      if (!userLicense) {
        return [];
      }

      const allowedFeatures: string[] = [];
      const allFeatures = await this.getAllFeatures();

      for (const featureName of allFeatures) {
        const checkResult = await this.checkFeature(userId, featureName);
        if (checkResult.allowed) {
          allowedFeatures.push(featureName);
        }
      }

      return allowedFeatures;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting allowed features for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Lấy thông tin feature
   */
  async getFeature(featureName: string): Promise<Feature | null> {
    try {
      // Thử dụng cache trước
      const cacheKey = `feature:${featureName}`;
      const cachedFeature = await this.redisService.get(cacheKey);
      
      if (cachedFeature) {
        return JSON.parse(cachedFeature);
      }

      // Lấy từ configuration
      const featureConfig = await this.getFeatureConfig();
      const feature = featureConfig.features[featureName];

      if (feature) {
        // Cache kết quả
        await this.redisService.set(cacheKey, JSON.stringify(feature), this.FEATURE_CACHE_TTL);
      }

      return feature || null;

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting feature ${featureName}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      return null;
    }
  }

  /**
   * Lấy tất cả features
   */
  async getAllFeatures(): Promise<string[]> {
    const featureConfig = await this.getFeatureConfig();
    return Object.keys(featureConfig?.features ?? {});
  }

  /**
   * Lấy features theo plan
   */
  async getFeaturesByPlan(plan: string): Promise<string[]> {
    const featureConfig = await this.getFeatureConfig();
    return featureConfig.planFeatures[plan] || [];
  }

  /**
   * Kiểm tra experimental feature access
   */
  async checkExperimentalFeature(userId: string, featureName: string): Promise<boolean> {
    const userLicense = await this.getUserLicense(userId);
    
    if (!userLicense) {
      return false;
    }

    return this.checkExperimentalAccess(userLicense.user);
  }

  /**
   * Cập nhật feature configuration
   */
  async updateFeatureConfig(config: Partial<FeatureConfig>): Promise<void> {
    try {
      const currentConfig = await this.getFeatureConfig();
      const updatedConfig = { ...currentConfig, ...config };

      // Lưu vào Redis
      await this.redisService.set('feature_config', JSON.stringify(updatedConfig), 86400); // 24 hours

      // Xóa cache của tất cả features
      await this.clearFeatureCache();

      this.logger.log('Feature configuration updated');

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error updating feature config: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Thêm feature mới
   */
  async addFeature(featureName: string, feature: Feature): Promise<void> {
    try {
      const currentConfig = await this.getFeatureConfig();
      currentConfig.features[featureName] = feature;

      await this.updateFeatureConfig(currentConfig);
      this.logger.log(`Feature added: ${featureName}`);

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error adding feature ${featureName}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Xóa feature
   */
  async removeFeature(featureName: string): Promise<void> {
    try {
      const currentConfig = await this.getFeatureConfig();
      delete currentConfig.features[featureName];

      await this.updateFeatureConfig(currentConfig);
      this.logger.log(`Feature removed: ${featureName}`);

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error removing feature ${featureName}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Bật/tắt experimental feature cho user
   */
  async toggleExperimentalFeature(userId: string, featureName: string, enabled: boolean): Promise<void> {
    try {
      const cacheKey = `user:${userId}:experimental_features`;
      const cachedData = await this.redisService.get(cacheKey);
      
      let experimentalFeatures: Record<string, boolean> = {};
      
      if (cachedData) {
        experimentalFeatures = JSON.parse(cachedData);
      }

      experimentalFeatures[featureName] = enabled;

      await this.redisService.set(cacheKey, JSON.stringify(experimentalFeatures), this.USER_FEATURE_CACHE_TTL);
      
      this.logger.log(`Experimental feature ${featureName} ${enabled ? 'enabled' : 'disabled'} for user ${userId}`);

    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error toggling experimental feature ${featureName} for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  // Private helper methods

  private async getUserLicense(userId: string): Promise<{ user: User; license: License } | null> {
    try {
      // Thử dùng cache trước
      const cacheKey = `user:${userId}:license`;
      const cachedLicense = await this.redisService.get(cacheKey);

      if (cachedLicense) {
        return JSON.parse(cachedLicense);
      }

      // Query database (sử dụng service đã có)
      // Trong thực tế, sẽ gọi LicensingService
      // Tạm thời trả null để tránh circular dependency
      return null;
    } catch (error) {
      this.logger.warn(`Failed to load user license for ${userId}`, error as any);
      return null;
    }
  }

  private async getFeatureConfig(): Promise<FeatureConfig> {
    // Configuration mặc định
    const defaultConfig: FeatureConfig = {
      features: {
        // Core features
        'user_management': {
          name: 'User Management',
          description: 'Quản lý thông tin người dùng',
          requiredPlan: ['BASIC'],
        },
        'account_management': {
          name: 'Account Management',
          description: 'Quản lý tài khoản Telegram',
          requiredPlan: ['BASIC'],
        },
        'messaging': {
          name: 'Messaging',
          description: 'Gửi tin nhắn',
          requiredPlan: ['BASIC'],
          dependencies: ['account_management'],
        },
        
        // Premium features
        'bulk_messaging': {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
          dependencies: ['messaging'],
        },
        'analytics': {
          name: 'Analytics',
          description: 'Thống kê và báo cáo',
          requiredPlan: ['PREMIUM'],
        },
        'api_access': {
          name: 'API Access',
          description: 'Truy cập API',
          requiredPlan: ['PREMIUM'],
        },
        'advanced_analytics': {
          name: 'Advanced Analytics',
          description: 'Thống kê nâng cao',
          requiredPlan: ['PREMIUM'],
          dependencies: ['analytics'],
        },
        
        // Enterprise features
        'unlimited_accounts': {
          name: 'Unlimited Accounts',
          description: 'Không giới hạn tài khoản',
          requiredPlan: ['ENTERPRISE'],
        },
        'priority_support': {
          name: 'Priority Support',
          description: 'Hỗ trợ ưu tiên',
          requiredPlan: ['ENTERPRISE'],
        },
        'custom_integrations': {
          name: 'Custom Integrations',
          description: 'Tích hợp tùy chỉnh',
          requiredPlan: ['ENTERPRISE'],
        },
        'advanced_webhooks': {
          name: 'Advanced Webhooks',
          description: 'Webhooks nâng cao',
          requiredPlan: ['ENTERPRISE'],
          dependencies: ['api_access'],
        },
        'sla_guarantee': {
          name: 'SLA Guarantee',
          description: 'Cam kết SLA',
          requiredPlan: ['ENTERPRISE'],
        },
        
        // Experimental features
        'ai_optimization': {
          name: 'AI Optimization',
          description: 'Tối ưu hóa bằng AI',
          requiredPlan: [],
          experimental: true,
        },
        'beta_features': {
          name: 'Beta Features',
          description: 'Tính năng beta',
          requiredPlan: [],
          experimental: true,
        },
        'advanced_security': {
          name: 'Advanced Security',
          description: 'Bảo mật nâng cao',
          requiredPlan: [],
          experimental: true,
        },
      },
      
      planFeatures: {
        'BASIC': [
          'user_management',
          'account_management',
          'messaging',
          'simple_analytics',
          'community_support',
        ],
        'PREMIUM': [
          'user_management',
          'account_management',
          'messaging',
          'bulk_messaging',
          'analytics',
          'api_access',
          'advanced_analytics',
          'basic_webhooks',
          'email_support',
        ],
        'ENTERPRISE': [
          'user_management',
          'account_management',
          'messaging',
          'bulk_messaging',
          'analytics',
          'api_access',
          'advanced_analytics',
          'advanced_webhooks',
          'unlimited_accounts',
          'priority_support',
          'custom_integrations',
          'sla_guarantee',
          'dedicated_account_manager',
        ],
      },
      
      globalFeatures: [
        'user_management',
        'account_management',
        'messaging',
      ],
      
      experimentalFeatures: [
        'ai_optimization',
        'beta_features',
        'advanced_security',
      ],
    };

    try {
      // Thử dùng cache trước
      const cachedConfig = await this.redisService.get('feature_config');

      if (cachedConfig) {
        return JSON.parse(cachedConfig);
      }

      // Cache configuration (best-effort)
      await this.redisService.set('feature_config', JSON.stringify(defaultConfig), 86400); // 24 hours
    } catch (error) {
      this.logger.warn('Failed to load/cached feature_config from Redis, falling back to default', error as any);
    }

    return defaultConfig;
  }

  private async initializeFeatureConfig(): Promise<void> {
    try {
      await this.getFeatureConfig();
      this.logger.log('Feature configuration initialized');
    } catch (error) {
      this.logger.error('Error initializing feature configuration:', error);
    }
  }

  private isExperimentalFeature(featureName: string): boolean {
    // Tạm thời hardcode, sẽ lấy từ config
    const experimentalFeatures = ['ai_optimization', 'beta_features', 'advanced_security'];
    return experimentalFeatures.includes(featureName);
  }

  private async checkExperimentalAccess(user: User): Promise<boolean> {
    // Chỉ cho phép user có account level ENTERPRISE truy cập experimental features
    return user.accountLevel === 'ENTERPRISE';
  }

  private async checkPlanRequirements(
    license: License,
    feature: Feature,
    context?: any
  ): Promise<Array<{
    type: string;
    message: string;
    requirement: string;
    current: any;
  }>> {
  const violations = [];

  // Kiểm tra required plan
  if (feature.requiredPlan && feature.requiredPlan.length > 0) {
    if (!feature.requiredPlan.includes(license.plan)) {
      violations.push({
        type: 'PLAN_REQUIREMENT',
        message: `Feature yêu cầu plan: ${feature.requiredPlan.join(' hoặc ')}`,
        requirement: `Plan: ${feature.requiredPlan.join(' hoặc ')}`,
        current: license.plan,
      });
    }
  }

  // Kiểm tra required features
  if (feature.requiredFeatures && feature.requiredFeatures.length > 0) {
    const licenseFeatures = license.features as Record<string, any>;
    
    for (const requiredFeature of feature.requiredFeatures) {
      if (!licenseFeatures[requiredFeature]) {
        violations.push({
          type: 'FEATURE_REQUIREMENT',
          message: `Feature yêu cầu feature: ${requiredFeature}`,
          requirement: `Feature: ${requiredFeature}`,
          current: 'Not available',
        });
      }
    }
  }

  return violations;
  }

  private async checkDependencies(
    license: License,
    feature: Feature,
    context?: any
  ): Promise<Array<{
    type: string;
    message: string;
    requirement: string;
    current: any;
  }>> {
  const violations = [];

  if (feature.dependencies && feature.dependencies.length > 0) {
    const licenseFeatures = ((license as any).features as Record<string, any>) ?? {};
    
    for (const dependency of feature.dependencies) {
      if (!licenseFeatures[dependency]) {
        violations.push({
          type: 'DEPENDENCY_REQUIREMENT',
          message: `Feature yêu cầu dependency: ${dependency}`,
          requirement: `Dependency: ${dependency}`,
          current: 'Not available',
        });
      }
    }
  }

  return violations;
  }

  private async checkUsageLimits(
    license: License,
    feature: Feature,
    context?: any
  ): Promise<Array<{
    type: string;
    message: string;
    requirement: string;
    current: any;
  }>> {
  const violations = [];
  const limits = ((license as any).limits as Record<string, any>) ?? {};
  const usage = ((license as any).usage as Record<string, any>) ?? {};

  // Kiểm tra các giới hạn liên quan đến feature
  if (feature.name === 'account_management') {
    const currentAccounts = usage.accounts || 0;
    const maxAccounts = limits.accounts || 1;
    
    if (currentAccounts >= maxAccounts) {
      violations.push({
        type: 'USAGE_LIMIT',
        message: `Vượt quá giới hạn tài khoản (${maxAccounts})`,
        requirement: `Max accounts: ${maxAccounts}`,
        current: currentAccounts,
      });
    }
  }

  if (feature.name === 'messaging' || feature.name === 'bulk_messaging') {
    const currentMessages = usage.messages_today || 0;
    const maxMessages = limits.messages_per_day || 100;
    
    if (currentMessages >= maxMessages) {
      violations.push({
        type: 'USAGE_LIMIT',
        message: `Vượt quá giới hạn tin nhắn/ngày (${maxMessages})`,
        requirement: `Max messages/day: ${maxMessages}`,
        current: currentMessages,
      });
    }
  }

  if (feature.name === 'api_access') {
    const currentApiCalls = usage.api_calls_current_hour || 0;
    const maxApiCalls = limits.api_calls_per_hour || 100;
    
    if (currentApiCalls >= maxApiCalls) {
      violations.push({
        type: 'USAGE_LIMIT',
        message: `Vượt quá giới hạn API calls/giờ (${maxApiCalls})`,
        requirement: `Max API calls/hour: ${maxApiCalls}`,
        current: currentApiCalls,
      });
    }
  }

  return violations;
  }

  private async clearFeatureCache(): Promise<void> {
    try {
      // Xóa cache của tất cả features
      const allFeatures = await this.getAllFeatures();

      for (const featureName of allFeatures) {
        const cacheKey = `feature:${featureName}`;
        await this.redisService.del(cacheKey);
      }
    } catch (error) {
      this.logger.warn('Failed to clear feature cache', error as any);
    }
  }
}