import { Test, TestingModule } from '@nestjs/testing';
import { LicensesService } from '../../../src/licenses/licenses.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { LicensingService } from '../../../src/licensing/licensing.service';
import { FeatureGatingService } from '../../../src/licensing/feature-gating.service';
import { ApiKeyService } from '../../../src/licensing/api-key.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BillingCycle, LicensePlan } from '@prisma/client';
import { CacheService } from '../../../src/common/services/cache.service';

describe('LicensesService', () => {
  let service: LicensesService;
  let mockPrismaService: any;
  let mockLicensingService: any;
  let mockFeatureGatingService: any;
  let mockApiKeyService: any;
  let mockCacheService: any;

  beforeEach(async () => {
    mockPrismaService = {};

    mockLicensingService = {
      getActiveLicense: jest.fn(),
      getLicenseMetrics: jest.fn(),
      createLicense: jest.fn(),
    };

    mockFeatureGatingService = {
      getAllFeatures: jest.fn(),
      getFeature: jest.fn(),
      getFeaturesByPlan: jest.fn(),
    };

    mockApiKeyService = {
      createApiKey: jest.fn(),
      getLicenseApiKeys: jest.fn(),
      getApiKey: jest.fn(),
      revokeApiKey: jest.fn(),
      validateApiKey: jest.fn(),
    };

    mockCacheService = {
      getOrSet: jest.fn(async (_key: string, getter: () => Promise<any>) => getter()),
      getLicense: jest.fn(async (_key: string, getter: () => Promise<any>) => getter()),
      delete: jest.fn(),
      set: jest.fn(),
      invalidateLicense: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LicensesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LicensingService, useValue: mockLicensingService },
        { provide: FeatureGatingService, useValue: mockFeatureGatingService },
        { provide: ApiKeyService, useValue: mockApiKeyService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<LicensesService>(LicensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentLicense', () => {
    it('should return current active license', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);

      const result = await service.getCurrentLicense('user-1');

      expect(result).toEqual(mockLicense);
      expect(mockLicensingService.getActiveLicense).toHaveBeenCalledWith('user-1');
    });

    it('should return null if no active license', async () => {
      mockLicensingService.getActiveLicense.mockResolvedValue(null);

      const result = await service.getCurrentLicense('user-1');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('Database error'));

      await expect(service.getCurrentLicense('user-1')).rejects.toThrow('Database error');
    });
  });

  describe('getAvailableFeatures', () => {
    it('should return available features and plans', async () => {
      const mockFeatures = ['FEATURE_1', 'FEATURE_2', 'FEATURE_3'];

      const mockFeatureDetails = {
        FEATURE_1: {
          name: 'Feature 1',
          description: 'Description for feature 1',
          config: {
            category: 'messaging',
          },
          requiredPlan: ['BASIC', 'PREMIUM'],
        },
        FEATURE_2: {
          name: 'Feature 2',
          description: 'Description for feature 2',
          config: {
            category: 'analytics',
            defaultLimits: {
              maxRequests: 100,
            },
          },
          requiredPlan: ['PREMIUM', 'ENTERPRISE'],
        },
        FEATURE_3: {
          name: 'Feature 3',
          description: 'Description for feature 3',
          config: {
            category: 'general',
          },
          requiredPlan: ['ENTERPRISE'],
        },
      };

      mockFeatureGatingService.getAllFeatures.mockResolvedValue(mockFeatures);
      mockFeatureGatingService.getFeature
        .mockImplementation((featureName: keyof typeof mockFeatureDetails) => {
          return Promise.resolve(mockFeatureDetails[featureName]);
        });
      mockFeatureGatingService.getFeaturesByPlan
        .mockResolvedValueOnce(['FEATURE_1'])
        .mockResolvedValueOnce(['FEATURE_1', 'FEATURE_2'])
        .mockResolvedValueOnce(['FEATURE_1', 'FEATURE_2', 'FEATURE_3']);

      const result = await service.getAvailableFeatures();

      expect(result).toHaveProperty('features');
      expect(result).toHaveProperty('plans');
      expect(result.features).toHaveLength(3);
      expect(result.plans).toHaveLength(3);

      expect(result.features[0]).toEqual({
        name: 'FEATURE_1',
        displayName: 'Feature 1',
        description: 'Description for feature 1',
        category: 'messaging',
        isPremium: false,
        defaultLimits: {},
      });

      expect(result.features[1]).toEqual({
        name: 'FEATURE_2',
        displayName: 'Feature 2',
        description: 'Description for feature 2',
        category: 'analytics',
        isPremium: true,
        defaultLimits: {
          maxRequests: 100,
        },
      });

      expect(result.plans[0]).toEqual({
        name: 'basic',
        displayName: 'Basic Plan',
        price: 29.99,
        features: ['FEATURE_1'],
      });
    });

    it('should handle errors', async () => {
      mockFeatureGatingService.getAllFeatures.mockRejectedValue(new Error('Feature service error'));

      await expect(service.getAvailableFeatures()).rejects.toThrow('Feature service error');
    });
  });

  describe('generateApiKey', () => {
    it('should generate API key for user', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        key: 'test-api-key',
        name: 'Test API Key',
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Test API key',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.createApiKey.mockResolvedValue(mockApiKey);

      const result = await service.generateApiKey('user-1', {
        name: 'Test API Key',
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Test API key',
      });

      expect(result).toEqual(mockApiKey);
      expect(mockApiKeyService.createApiKey).toHaveBeenCalledWith({
        licenseId: 'license-1',
        name: 'Test API Key',
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
        expiresAt: expect.any(Date),
        description: 'Test API key',
      });
    });

    it('should throw NotFoundException if no active license', async () => {
      mockLicensingService.getActiveLicense.mockResolvedValue(null);

      await expect(
        service.generateApiKey('user-1', {
          name: 'Test API Key',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should use default permissions if not provided', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        key: 'test-api-key',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.createApiKey.mockResolvedValue(mockApiKey);

      const result = await service.generateApiKey('user-1', {
        name: 'Test API Key',
      });

      expect(result.permissions).toEqual({
        permissions: [],
        resources: [],
      });
    });

    it('should handle errors', async () => {
      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('License service error'));

      await expect(
        service.generateApiKey('user-1', {
          name: 'Test API Key',
        }),
      ).rejects.toThrow('License service error');
    });
  });

  describe('getApiKeys', () => {
    it('should return API keys for user', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKeys = [
        {
          id: 'api-key-1',
          licenseId: 'license-1',
          key: 'test-api-key-1',
          name: 'Test API Key 1',
          isActive: true,
        },
        {
          id: 'api-key-2',
          licenseId: 'license-1',
          key: 'test-api-key-2',
          name: 'Test API Key 2',
          isActive: true,
        },
      ];

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.getLicenseApiKeys.mockResolvedValue(mockApiKeys);

      const result = await service.getApiKeys('user-1');

      expect(result).toEqual(mockApiKeys);
      expect(mockApiKeyService.getLicenseApiKeys).toHaveBeenCalledWith('license-1', false);
    });

    it('should include inactive keys if requested', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKeys = [
        {
          id: 'api-key-1',
          licenseId: 'license-1',
          key: 'test-api-key-1',
          name: 'Test API Key 1',
          isActive: true,
        },
        {
          id: 'api-key-2',
          licenseId: 'license-1',
          key: 'test-api-key-2',
          name: 'Test API Key 2',
          isActive: false,
        },
      ];

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.getLicenseApiKeys.mockResolvedValue(mockApiKeys);

      const result = await service.getApiKeys('user-1', true);

      expect(result).toEqual(mockApiKeys);
      expect(mockApiKeyService.getLicenseApiKeys).toHaveBeenCalledWith('license-1', true);
    });

    it('should throw NotFoundException if no active license', async () => {
      mockLicensingService.getActiveLicense.mockResolvedValue(null);

      await expect(service.getApiKeys('user-1')).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('License service error'));

      await expect(service.getApiKeys('user-1')).rejects.toThrow('License service error');
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke API key', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        key: 'test-api-key',
        name: 'Test API Key',
        isActive: true,
      };

      const mockRevokedApiKey = {
        ...mockApiKey,
        isActive: false,
        revokedAt: new Date(),
        revocationReason: 'Security concern',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.getApiKey.mockResolvedValue(mockApiKey);
      mockApiKeyService.revokeApiKey.mockResolvedValue(mockRevokedApiKey);

      const result = await service.revokeApiKey('user-1', 'api-key-1', 'Security concern');

      expect(result).toEqual(mockRevokedApiKey);
      expect(mockApiKeyService.revokeApiKey).toHaveBeenCalledWith('api-key-1', 'Security concern');
    });

    it('should throw NotFoundException if no active license', async () => {
      mockLicensingService.getActiveLicense.mockResolvedValue(null);

      await expect(
        service.revokeApiKey('user-1', 'api-key-1', 'Security concern'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if API key not found', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.getApiKey.mockResolvedValue(null);

      await expect(
        service.revokeApiKey('user-1', 'api-key-1', 'Security concern'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if API key does not belong to user', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'different-license',
        key: 'test-api-key',
        name: 'Test API Key',
        isActive: true,
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockApiKeyService.getApiKey.mockResolvedValue(mockApiKey);

      await expect(
        service.revokeApiKey('user-1', 'api-key-1', 'Security concern'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('License service error'));

      await expect(
        service.revokeApiKey('user-1', 'api-key-1', 'Security concern'),
      ).rejects.toThrow('License service error');
    });
  });

  describe('subscribe', () => {
    it('should subscribe user to a plan', async () => {
      const mockSubscribeDto = {
        plan: LicensePlan.PREMIUM,
        billingCycle: BillingCycle.MONTHLY,
        autoRenew: true,
        paymentMethodId: 'pm-123',
      };

      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        billingCycle: 'MONTHLY',
        autoRenew: true,
        paymentMethodId: 'pm-123',
        status: 'ACTIVE',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(null);
      mockLicensingService.createLicense.mockResolvedValue(mockLicense);

      const result = await service.subscribe('user-1', mockSubscribeDto);

      expect(result).toEqual(mockLicense);
      expect(mockLicensingService.createLicense).toHaveBeenCalledWith({
        userId: 'user-1',
        plan: 'PREMIUM',
        billingCycle: 'MONTHLY',
        autoRenew: true,
        paymentMethodId: 'pm-123',
      });
    });

    it('should throw BadRequestException if user already has active license', async () => {
      const mockSubscribeDto = {
        plan: LicensePlan.PREMIUM,
        billingCycle: BillingCycle.MONTHLY,
        autoRenew: true,
        paymentMethodId: 'pm-123',
      };

      const mockExistingLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'BASIC',
        status: 'ACTIVE',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockExistingLicense);

      await expect(service.subscribe('user-1', mockSubscribeDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow subscription if user has custom license', async () => {
      const mockSubscribeDto = {
        plan: LicensePlan.PREMIUM,
        billingCycle: BillingCycle.MONTHLY,
        autoRenew: true,
        paymentMethodId: 'pm-123',
      };

      const mockCustomLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'CUSTOM',
        status: 'ACTIVE',
      };

      const mockNewLicense = {
        id: 'license-2',
        userId: 'user-1',
        plan: 'PREMIUM',
        billingCycle: 'MONTHLY',
        autoRenew: true,
        paymentMethodId: 'pm-123',
        status: 'ACTIVE',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockCustomLicense);
      mockLicensingService.createLicense.mockResolvedValue(mockNewLicense);

      const result = await service.subscribe('user-1', mockSubscribeDto);

      expect(result).toEqual(mockNewLicense);
    });

    it('should use default autoRenew if not provided', async () => {
      const mockSubscribeDto = {
        plan: LicensePlan.PREMIUM,
        billingCycle: BillingCycle.MONTHLY,
        paymentMethodId: 'pm-123',
      };

      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        billingCycle: 'MONTHLY',
        autoRenew: true,
        paymentMethodId: 'pm-123',
        status: 'ACTIVE',
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(null);
      mockLicensingService.createLicense.mockResolvedValue(mockLicense);

      const result = await service.subscribe('user-1', mockSubscribeDto);

      expect(result.autoRenew).toBe(true);
    });

    it('should handle errors', async () => {
      const mockSubscribeDto = {
        plan: LicensePlan.PREMIUM,
        billingCycle: BillingCycle.MONTHLY,
        autoRenew: true,
        paymentMethodId: 'pm-123',
      };

      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('License service error'));

      await expect(service.subscribe('user-1', mockSubscribeDto)).rejects.toThrow(
        'License service error',
      );
    });
  });

  describe('validateApiKey', () => {
    it('should validate API key', async () => {
      const mockValidationResult = {
        isValid: true,
        apiKey: {
          id: 'api-key-1',
          key: 'test-api-key',
          name: 'Test API Key',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
      };

      mockApiKeyService.validateApiKey.mockResolvedValue(mockValidationResult);

      const result = await service.validateApiKey('test-api-key', {
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        resource: 'messages',
        action: 'send',
      });

      expect(result).toEqual(mockValidationResult);
      expect(mockApiKeyService.validateApiKey).toHaveBeenCalledWith('test-api-key', {
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        resource: 'messages',
        action: 'send',
      });
    });

    it('should handle errors', async () => {
      mockApiKeyService.validateApiKey.mockRejectedValue(new Error('Invalid API key'));

      await expect(
        service.validateApiKey('invalid-api-key'),
      ).rejects.toThrow('Invalid API key');
    });
  });

  describe('getUsage', () => {
    it('should return usage statistics', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockMetrics = {
        totalRequests: 100,
        requestsByFeature: {
          messages: 50,
          campaigns: 30,
          accounts: 20,
        },
        rateLimitStatus: {
          current: 100,
          limit: 1000,
          remaining: 900,
        },
        dailyUsage: [
          { date: '2023-01-01', requests: 10 },
          { date: '2023-01-02', requests: 20 },
        ],
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockLicensingService.getLicenseMetrics.mockResolvedValue(mockMetrics);

      const result = await service.getUsage('user-1', 30);

      expect(result).toEqual(mockMetrics);
      expect(mockLicensingService.getLicenseMetrics).toHaveBeenCalledWith('license-1', 30);
    });

    it('should throw NotFoundException if no active license', async () => {
      mockLicensingService.getActiveLicense.mockResolvedValue(null);

      await expect(service.getUsage('user-1', 30)).rejects.toThrow(NotFoundException);
    });

    it('should use default days if not provided', async () => {
      const mockLicense = {
        id: 'license-1',
        userId: 'user-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockMetrics = {
        totalRequests: 100,
        requestsByFeature: {},
        rateLimitStatus: {},
        dailyUsage: [],
      };

      mockLicensingService.getActiveLicense.mockResolvedValue(mockLicense);
      mockLicensingService.getLicenseMetrics.mockResolvedValue(mockMetrics);

      const result = await service.getUsage('user-1');

      expect(result).toEqual(mockMetrics);
      expect(mockLicensingService.getLicenseMetrics).toHaveBeenCalledWith('license-1', 30);
    });

    it('should handle errors', async () => {
      mockLicensingService.getActiveLicense.mockRejectedValue(new Error('License service error'));

      await expect(service.getUsage('user-1', 30)).rejects.toThrow('License service error');
    });
  });
});