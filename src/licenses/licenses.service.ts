import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { LicensingService } from '../licensing/licensing.service';
import { FeatureGatingService } from '../licensing/feature-gating.service';
import { ApiKeyService } from '../licensing/api-key.service';
import { CacheService } from '../common/services/cache.service';
import { LicensePlan, BillingCycle, LicenseStatus } from '@prisma/client';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class LicensesService {
  private readonly logger = new Logger(LicensesService.name);

  constructor(
    private prisma: PrismaService,
    private licensingService: LicensingService,
    private featureGatingService: FeatureGatingService,
    private apiKeyService: ApiKeyService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get current user's active license
   */
  async getCurrentLicense(userId: string) {
    try {
      return this.cacheService.getLicense(`user:${userId}`, async () => {
        const license = await this.licensingService.getActiveLicense(userId);
        
        if (!license) {
          return null;
        }

        return license;
      });
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting current license for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get available features and plans
   */
  async getAvailableFeatures() {
    try {
      return this.cacheService.getOrSet(
        'features:available',
        async () => {
          const allFeatures = await this.featureGatingService.getAllFeatures();
          
          const features = [];
          for (const featureName of allFeatures) {
            const feature = await this.featureGatingService.getFeature(featureName);
            if (feature) {
              features.push({
                name: featureName,
                displayName: feature.name,
                description: feature.description || '',
                category: feature.config?.category || 'general',
                isPremium: feature.requiredPlan && feature.requiredPlan.length > 0 && !feature.requiredPlan.includes('BASIC'),
                defaultLimits: feature.config?.defaultLimits || {},
              });
            }
          }

          // Get plans with their features
          const plans = [
            {
              name: 'basic',
              displayName: 'Basic Plan',
              price: 29.99,
              features: await this.featureGatingService.getFeaturesByPlan('BASIC'),
            },
            {
              name: 'premium',
              displayName: 'Premium Plan',
              price: 99.99,
              features: await this.featureGatingService.getFeaturesByPlan('PREMIUM'),
            },
            {
              name: 'enterprise',
              displayName: 'Enterprise Plan',
              price: 299.99,
              features: await this.featureGatingService.getFeaturesByPlan('ENTERPRISE'),
            },
          ];

          return {
            features,
            plans,
          };
        },
        { ttl: 3600 }, // Cache for 1 hour
      );
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting available features: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Generate API key for current user's license
   */
  async generateApiKey(userId: string, data: {
    name: string;
    permissions?: { permissions: string[]; resources: string[] };
    rateLimit?: { requestsPerMinute?: number; requestsPerHour?: number; requestsPerDay?: number };
    expiresAt?: Date;
    description?: string;
  }) {
    try {
      const license = await this.licensingService.getActiveLicense(userId);
      
      if (!license) {
        throw new NotFoundException('No active license found');
      }

      const apiKey = await this.apiKeyService.createApiKey({
        licenseId: license.id,
        name: data.name,
        permissions: data.permissions || { permissions: [], resources: [] },
        rateLimit: data.rateLimit,
        expiresAt: data.expiresAt,
        description: data.description,
      });

      return apiKey;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error generating API key for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get all API keys for current user's license
   */
  async getApiKeys(userId: string, includeInactive: boolean = false) {
    try {
      const license = await this.licensingService.getActiveLicense(userId);
      
      if (!license) {
        throw new NotFoundException('No active license found');
      }

      const apiKeys = await this.apiKeyService.getLicenseApiKeys(license.id, includeInactive);
      return apiKeys;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting API keys for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(userId: string, apiKeyId: string, reason: string) {
    try {
      const license = await this.licensingService.getActiveLicense(userId);
      
      if (!license) {
        throw new NotFoundException('No active license found');
      }

      // Verify API key belongs to user's license
      const apiKey = await this.apiKeyService.getApiKey(apiKeyId);
      if (!apiKey || apiKey.licenseId !== license.id) {
        throw new NotFoundException('API key not found');
      }

      const revoked = await this.apiKeyService.revokeApiKey(apiKeyId, reason);
      return revoked;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error revoking API key ${apiKeyId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Subscribe to a license plan
   */
  async subscribe(userId: string, data: SubscribeDto) {
    try {
      // Check if user already has an active license
      const existingLicense = await this.licensingService.getActiveLicense(userId);
      
      if (existingLicense && existingLicense.plan !== LicensePlan.CUSTOM) {
        throw new BadRequestException('User already has an active license');
      }

      const license = await this.licensingService.createLicense({
        userId,
        plan: data.plan,
        billingCycle: data.billingCycle,
        autoRenew: data.autoRenew ?? true,
        paymentMethodId: data.paymentMethodId,
      });

      // Invalidate license cache for this user
      await this.cacheService.invalidateLicense(`user:${userId}`);

      return license;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error subscribing user ${userId} to plan ${data.plan}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Validate API key
   */
  async validateApiKey(apiKey: string, context?: {
    ipAddress?: string;
    userAgent?: string;
    resource?: string;
    action?: string;
  }) {
    try {
      const result = await this.apiKeyService.validateApiKey(apiKey, context);
      return result;
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
   * Get usage statistics for current user's license
   */
  async getUsage(userId: string, days: number = 30) {
    try {
      const license = await this.licensingService.getActiveLicense(userId);
      
      if (!license) {
        throw new NotFoundException('No active license found');
      }

      const metrics = await this.licensingService.getLicenseMetrics(license.id, days);
      return metrics;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting usage for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }
}
