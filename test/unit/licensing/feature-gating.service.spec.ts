import { Test, TestingModule } from '@nestjs/testing';
import { FeatureGatingService } from '../../../src/licensing/feature-gating.service';
import { RedisService } from '../../../src/config/redis.service';
import { ConfigService } from '@nestjs/config';

describe('FeatureGatingService', () => {
  let service: FeatureGatingService;
  let mockRedisService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureGatingService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FeatureGatingService>(FeatureGatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkFeature', () => {
    it('should allow feature for valid user and license', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockFeature = {
        name: 'Bulk Messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(JSON.stringify(mockFeature)); // feature

      const result = await service.checkFeature('user-1', 'bulk_messaging');

      expect(result).toEqual({
        allowed: true,
        feature: mockFeature,
        license: mockUserLicense.license,
        user: mockUserLicense.user,
      });
    });

    it('should deny feature for user without license', async () => {
      mockRedisService.get.mockResolvedValueOnce(null); // no user license

      const result = await service.checkFeature('user-1', 'bulk_messaging');

      expect(result).toEqual({
        allowed: false,
        reason: 'Người dùng không có license',
      });
    });

    it('should deny feature for non-existent feature', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(null); // no feature

      const result = await service.checkFeature('user-1', 'non_existent_feature');

      expect(result).toEqual({
        allowed: false,
        reason: 'Feature không tồn tại: non_existent_feature',
      });
    });

    it('should deny experimental feature without access', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockFeature = {
        name: 'AI Optimization',
        description: 'Tối ưu hóa bằng AI',
        requiredPlan: [],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(JSON.stringify(mockFeature)) // feature
        .mockResolvedValueOnce(null); // no experimental access

      const result = await service.checkFeature('user-1', 'ai_optimization');

      expect(result).toEqual({
        allowed: false,
        feature: mockFeature,
        reason: 'Feature đang trong giai đoạn thử nghiệm',
      });
    });

    it('should deny feature for insufficient plan', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'BASIC',
          status: 'ACTIVE',
          features: {},
        },
      };

      const mockFeature = {
        name: 'Bulk Messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(JSON.stringify(mockFeature)) // feature
        .mockResolvedValueOnce('true'); // experimental access (not needed here)

      const result = await service.checkFeature('user-1', 'bulk_messaging');

      expect(result).toEqual(
        expect.objectContaining({
          allowed: false,
          feature: mockFeature,
          license: mockUserLicense.license,
          user: mockUserLicense.user,
          violations: [
            {
              type: 'PLAN_REQUIREMENT',
              message: 'Feature yêu cầu plan: PREMIUM',
              requirement: 'Plan: PREMIUM',
              current: 'BASIC',
            },
          ],
        }),
      );
    });

    it('should deny feature for missing dependencies', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          features: {},
        },
      };

      const mockFeature = {
        name: 'Bulk Messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
        dependencies: ['messaging'],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(JSON.stringify(mockFeature)) // feature
        .mockResolvedValueOnce('true'); // experimental access

      const result = await service.checkFeature('user-1', 'bulk_messaging');

      expect(result).toEqual(
        expect.objectContaining({
          allowed: false,
          violations: [
            {
              type: 'DEPENDENCY_REQUIREMENT',
              message: 'Feature yêu cầu dependency: messaging',
              requirement: 'Dependency: messaging',
              current: 'Not available',
            },
          ],
        }),
      );
    });

    it('should deny feature for usage limit violations', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          features: { messaging: true },
          limits: { messages_per_day: 1000 },
          usage: { messages_today: 1500 },
        },
      };

      const mockFeature = {
        name: 'bulk_messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
        config: {
          limits: {
            maxMessagesPerDay: 1000,
          },
        },
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockUserLicense)) // user license
        .mockResolvedValueOnce(JSON.stringify(mockFeature)) // feature
        .mockResolvedValueOnce('true'); // experimental access

      const result = await service.checkFeature('user-1', 'bulk_messaging');

      expect(result).toEqual(
        expect.objectContaining({
          allowed: false,
          violations: [
            {
              type: 'USAGE_LIMIT',
              message: 'Vượt quá giới hạn tin nhắn/ngày (1000)',
              requirement: 'Max messages/day: 1000',
              current: 1500,
            },
          ],
        }),
      );
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.checkFeature('user-1', 'bulk_messaging')).resolves.toEqual(
        expect.objectContaining({ allowed: false }),
      );
    });
  });

  describe('getAllowedFeatures', () => {
    it('should return allowed features for user', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          features: { messaging: true, account_management: true, user_management: true },
        },
      };

      // Use default feature config (feature_config cache miss) + provide user license via cache
      mockRedisService.get.mockImplementation(async (key: string) => {
        if (key === `user:user-1:license`) return JSON.stringify(mockUserLicense);
        if (key === 'feature_config') return null;
        return null;
      });

      const result = await service.getAllowedFeatures('user-1');

      expect(result).toEqual(expect.arrayContaining(['bulk_messaging', 'analytics', 'api_access']));
    });

    it('should return empty array for user without license', async () => {
      mockRedisService.get.mockResolvedValueOnce(null); // no user license

      const result = await service.getAllowedFeatures('user-1');

      expect(result).toHaveLength(0);
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.getAllowedFeatures('user-1')).resolves.toEqual([]);
    });
  });

  describe('getFeature', () => {
    it('should return feature from cache', async () => {
      const mockFeature = {
        name: 'Bulk Messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeature));

      const result = await service.getFeature('bulk_messaging');

      expect(result).toEqual(mockFeature);
      expect(mockRedisService.get).toHaveBeenCalledWith('feature:bulk_messaging');
    });

    it('should return feature from config if not in cache', async () => {
      const mockFeature = {
        name: 'Bulk Messaging',
        description: 'Gửi tin nhắn hàng loạt',
        requiredPlan: ['PREMIUM'],
      };

      const mockFeatureConfig = {
        features: {
          bulk_messaging: mockFeature,
        },
        planFeatures: {},
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get
        .mockResolvedValueOnce(null) // no cache
        .mockResolvedValueOnce(JSON.stringify(mockFeatureConfig)); // feature config

      const result = await service.getFeature('bulk_messaging');

      expect(result).toEqual(mockFeature);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'feature:bulk_messaging',
        JSON.stringify(mockFeature),
        1800,
      );
    });

    it('should return null for non-existent feature', async () => {
      mockRedisService.get
        .mockResolvedValueOnce(null) // no cache
        .mockResolvedValueOnce(
          JSON.stringify({
            features: {},
            planFeatures: {},
            globalFeatures: [],
            experimentalFeatures: [],
          }),
        ); // empty feature config

      const result = await service.getFeature('non_existent_feature');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.getFeature('bulk_messaging');

      expect(result).toBeNull();
    });
  });

  describe('getAllFeatures', () => {
    it('should return all features', async () => {
      const mockFeatureConfig = {
        features: {
          feature1: {
            name: 'Feature 1',
            description: 'Description 1',
          },
          feature2: {
            name: 'Feature 2',
            description: 'Description 2',
          },
        },
        planFeatures: {},
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

      const result = await service.getAllFeatures();

      expect(result).toEqual(['feature1', 'feature2']);
    });

    it('should return empty array if no features', async () => {
      const mockFeatureConfig = {
        features: {},
        planFeatures: {},
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

      const result = await service.getAllFeatures();

      expect(result).toHaveLength(0);
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.getAllFeatures()).resolves.toEqual(expect.any(Array));
    });
  });

  describe('getFeaturesByPlan', () => {
    it('should return features for plan', async () => {
      const mockFeatureConfig = {
        features: {},
        planFeatures: {
          PREMIUM: ['feature1', 'feature2', 'feature3'],
        },
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

      const result = await service.getFeaturesByPlan('PREMIUM');

      expect(result).toEqual(['feature1', 'feature2', 'feature3']);
    });

    it('should return empty array for unknown plan', async () => {
      const mockFeatureConfig = {
        features: {},
        planFeatures: {},
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

      const result = await service.getFeaturesByPlan('UNKNOWN');

      expect(result).toHaveLength(0);
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.getFeaturesByPlan('PREMIUM')).resolves.toEqual(expect.any(Array));
    });
  });

  describe('checkExperimentalFeature', () => {
    it('should return true for user with experimental access', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
          accountLevel: 'ENTERPRISE',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockRedisService.get.mockImplementation(async (key: string) => {
        if (key === `user:user-1:license`) return JSON.stringify(mockUserLicense);
        if (key === 'feature_config') return null;
        return null;
      });

      const result = await service.checkExperimentalFeature('user-1', 'ai_optimization');

      expect(result).toBe(true);
    });

    it('should return false for user without experimental access', async () => {
      const mockUserLicense = {
        user: {
          id: 'user-1',
          email: 'user@example.com',
          accountLevel: 'BASIC',
        },
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockRedisService.get.mockImplementation(async (key: string) => {
        if (key === `user:user-1:license`) return JSON.stringify(mockUserLicense);
        if (key === 'feature_config') return null;
        return null;
      });

      const result = await service.checkExperimentalFeature('user-1', 'ai_optimization');

      expect(result).toBe(false);
    });

    it('should return false for user without license', async () => {
      mockRedisService.get.mockResolvedValueOnce(null); // no user license

      const result = await service.checkExperimentalFeature('user-1', 'ai_optimization');

      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(
        service.checkExperimentalFeature('user-1', 'ai_optimization'),
      ).resolves.toBe(false);
    });
  });

  describe('updateFeatureConfig', () => {
    it('should update feature configuration', async () => {
      const mockCurrentConfig = {
        features: {
          feature1: {
            name: 'Feature 1',
            description: 'Description 1',
          },
        },
        planFeatures: {
          BASIC: ['feature1'],
        },
        globalFeatures: [],
        experimentalFeatures: [],
      };

      const mockUpdatedConfig = {
        features: {
          feature1: {
            name: 'Feature 1',
            description: 'Description 1',
          },
          feature2: {
            name: 'Feature 2',
            description: 'Description 2',
          },
        },
        planFeatures: {
          BASIC: ['feature1'],
        },
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockCurrentConfig)) // current config
        .mockResolvedValueOnce(undefined); // clear cache

      await service.updateFeatureConfig({
        features: {
          feature2: {
            name: 'Feature 2',
            description: 'Description 2',
          },
        },
      });

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'feature_config',
        expect.any(String),
        86400,
      );

      expect(mockRedisService.del).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(
        service.updateFeatureConfig({
          features: {
            feature2: {
              name: 'Feature 2',
              description: 'Description 2',
            },
          },
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('addFeature', () => {
    it('should add new feature', async () => {
      const mockCurrentConfig = {
        features: {},
        planFeatures: {},
        globalFeatures: [],
        experimentalFeatures: [],
      };

      const mockNewFeature = {
        name: 'New Feature',
        description: 'New feature description',
        requiredPlan: ['PREMIUM'],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockCurrentConfig)) // current config
        .mockResolvedValueOnce(undefined); // clear cache

      await service.addFeature('new_feature', mockNewFeature);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'feature_config',
        JSON.stringify({
          features: {
            new_feature: mockNewFeature,
          },
          planFeatures: {},
          globalFeatures: [],
          experimentalFeatures: [],
        }),
        86400,
      );
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(
        service.addFeature('new_feature', {
          name: 'New Feature',
          description: 'New feature description',
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('removeFeature', () => {
    it('should remove feature', async () => {
      const mockCurrentConfig = {
        features: {
          feature1: {
            name: 'Feature 1',
            description: 'Description 1',
          },
          feature2: {
            name: 'Feature 2',
            description: 'Description 2',
          },
        },
        planFeatures: {
          BASIC: ['feature1', 'feature2'],
        },
        globalFeatures: [],
        experimentalFeatures: [],
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockCurrentConfig)) // current config
        .mockResolvedValueOnce(undefined); // clear cache

      await service.removeFeature('feature1');

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'feature_config',
        JSON.stringify({
          features: {
            feature2: {
              name: 'Feature 2',
              description: 'Description 2',
            },
          },
          planFeatures: {
            BASIC: ['feature1', 'feature2'],
          },
          globalFeatures: [],
          experimentalFeatures: [],
        }),
        86400,
      );
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.removeFeature('feature1')).resolves.toBeUndefined();
    });
  });

  describe('toggleExperimentalFeature', () => {
    it('should enable experimental feature for user', async () => {
      const mockCurrentFeatures = {
        ai_optimization: false,
        beta_features: false,
      };

      const mockUpdatedFeatures = {
        ai_optimization: true,
        beta_features: false,
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockCurrentFeatures)) // current features
        .mockResolvedValueOnce(undefined); // set updated features

      await service.toggleExperimentalFeature('user-1', 'ai_optimization', true);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'user:user-1:experimental_features',
        JSON.stringify(mockUpdatedFeatures),
        900,
      );
    });

    it('should disable experimental feature for user', async () => {
      const mockCurrentFeatures = {
        ai_optimization: true,
        beta_features: true,
      };

      const mockUpdatedFeatures = {
        ai_optimization: false,
        beta_features: true,
      };

      mockRedisService.get
        .mockResolvedValueOnce(JSON.stringify(mockCurrentFeatures)) // current features
        .mockResolvedValueOnce(undefined); // set updated features

      await service.toggleExperimentalFeature('user-1', 'ai_optimization', false);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'user:user-1:experimental_features',
        JSON.stringify(mockUpdatedFeatures),
        900,
      );
    });

    it('should handle errors', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      await expect(
        service.toggleExperimentalFeature('user-1', 'ai_optimization', true),
      ).rejects.toThrow('Redis error');
    });
  });

  describe('private methods', () => {
    describe('getUserLicense', () => {
      it('should return user license from cache', async () => {
        const mockUserLicense = {
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
          license: {
            id: 'license-1',
            plan: 'PREMIUM',
            status: 'ACTIVE',
          },
        };

        mockRedisService.get.mockResolvedValue(JSON.stringify(mockUserLicense));

        const result = await service['getUserLicense']('user-1');

        expect(result).toEqual(mockUserLicense);
        expect(mockRedisService.get).toHaveBeenCalledWith('user:user-1:license');
      });

      it('should return null if not in cache', async () => {
        mockRedisService.get.mockResolvedValue(null);

        const result = await service['getUserLicense']('user-1');

        expect(result).toBeNull();
      });

      it('should handle errors', async () => {
        mockRedisService.get.mockRejectedValue(new Error('Redis error'));

        const result = await service['getUserLicense']('user-1');

        expect(result).toBeNull();
      });
    });

    describe('getFeatureConfig', () => {
      it('should return feature config from cache', async () => {
        const mockFeatureConfig = {
          features: {
            feature1: {
              name: 'Feature 1',
              description: 'Description 1',
            },
          },
          planFeatures: {
            BASIC: ['feature1'],
          },
          globalFeatures: [],
          experimentalFeatures: [],
        };

        mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

        const result = await service['getFeatureConfig']();

        expect(result).toEqual(mockFeatureConfig);
        expect(mockRedisService.get).toHaveBeenCalledWith('feature_config');
      });

      it('should return default config if not in cache', async () => {
        mockRedisService.get
          .mockResolvedValueOnce(null) // no cache
          .mockResolvedValueOnce(undefined); // set cache

        const result = await service['getFeatureConfig']();

        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('planFeatures');
        expect(result).toHaveProperty('globalFeatures');
        expect(result).toHaveProperty('experimentalFeatures');

        expect(mockRedisService.set).toHaveBeenCalledWith(
          'feature_config',
          expect.any(String),
          86400,
        );
      });

      it('should handle errors', async () => {
        mockRedisService.get.mockRejectedValue(new Error('Redis error'));

        const result = await service['getFeatureConfig']();

        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('planFeatures');
        expect(result).toHaveProperty('globalFeatures');
        expect(result).toHaveProperty('experimentalFeatures');
      });
    });

    describe('isExperimentalFeature', () => {
      it('should return true for experimental feature', () => {
        const mockFeatureConfig = {
          features: {},
          planFeatures: {},
          globalFeatures: [],
          experimentalFeatures: ['ai_optimization', 'beta_features'],
        };

        const result = service['isExperimentalFeature']('ai_optimization');

        expect(result).toBe(true);
      });

      it('should return false for non-experimental feature', () => {
        const mockFeatureConfig = {
          features: {},
          planFeatures: {},
          globalFeatures: [],
          experimentalFeatures: ['ai_optimization', 'beta_features'],
        };

        const result = service['isExperimentalFeature']('bulk_messaging');

        expect(result).toBe(false);
      });
    });

    describe('checkExperimentalAccess', () => {
      it('should return true for user with experimental access', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'user@example.com',
          accountLevel: 'ENTERPRISE',
        };

        const result = await service['checkExperimentalAccess'](mockUser as any);

        expect(result).toBe(true);
      });

      it('should return false for user without experimental access', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'user@example.com',
          accountLevel: 'BASIC',
        };

        const result = await service['checkExperimentalAccess'](mockUser as any);

        expect(result).toBe(false);
      });
    });

    describe('checkPlanRequirements', () => {
      it('should return empty array for satisfied requirements', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
        };

        const result = await service['checkPlanRequirements'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toHaveLength(0);
      });

      it('should return violations for unsatisfied requirements', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'BASIC',
          status: 'ACTIVE',
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
        };

        const result = await service['checkPlanRequirements'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toEqual([
          {
            type: 'PLAN_REQUIREMENT',
            message: 'Feature yêu cầu plan: PREMIUM',
            requirement: 'Plan: PREMIUM',
            current: 'BASIC',
          },
        ]);
      });

      it('should ignore license status in plan requirement checks', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'INACTIVE',
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
        };

        const result = await service['checkPlanRequirements'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toHaveLength(0);
      });
    });

    describe('checkDependencies', () => {
      it('should return empty array for satisfied dependencies', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          features: { messaging: true },
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
          dependencies: ['messaging'],
        };

        const result = await service['checkDependencies'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toHaveLength(0);
      });

      it('should return violations for missing dependencies', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          features: {},
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
          dependencies: ['messaging'],
        };

        const result = await service['checkDependencies'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toEqual([
          {
            type: 'DEPENDENCY_REQUIREMENT',
            message: 'Feature yêu cầu dependency: messaging',
            requirement: 'Dependency: messaging',
            current: 'Not available',
          },
        ]);
      });
    });

    describe('checkUsageLimits', () => {
      it('should return empty array for satisfied usage limits', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
          config: {
            limits: {
              maxMessagesPerDay: 1000,
            },
          },
        };

        mockRedisService.get.mockResolvedValue('500'); // current usage

        const result = await service['checkUsageLimits'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toHaveLength(0);
      });

      it('should return violations for exceeded usage limits', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          limits: { messages_per_day: 1000 },
          usage: { messages_today: 1500 },
        };

        const mockFeature = {
          name: 'bulk_messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
          config: {
            limits: {
              maxMessagesPerDay: 1000,
            },
          },
        };

        const result = await service['checkUsageLimits'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toEqual([
          {
            type: 'USAGE_LIMIT',
            message: 'Vượt quá giới hạn tin nhắn/ngày (1000)',
            requirement: 'Max messages/day: 1000',
            current: 1500,
          },
        ]);
      });

      it('should return empty array if no limits configured', async () => {
        const mockLicense = {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        };

        const mockFeature = {
          name: 'Bulk Messaging',
          description: 'Gửi tin nhắn hàng loạt',
          requiredPlan: ['PREMIUM'],
        };

        const result = await service['checkUsageLimits'](
          mockLicense as any,
          mockFeature,
          {},
        );

        expect(result).toHaveLength(0);
      });
    });

    describe('clearFeatureCache', () => {
      it('should clear feature cache', async () => {
        const mockFeatureConfig = {
          features: {
            feature1: {
              name: 'Feature 1',
              description: 'Description 1',
            },
            feature2: {
              name: 'Feature 2',
              description: 'Description 2',
            },
          },
          planFeatures: {},
          globalFeatures: [],
          experimentalFeatures: [],
        };

        mockRedisService.get.mockResolvedValue(JSON.stringify(mockFeatureConfig));

        await service['clearFeatureCache']();

        expect(mockRedisService.del).toHaveBeenCalledWith('feature:feature1');
        expect(mockRedisService.del).toHaveBeenCalledWith('feature:feature2');
      });

      it('should handle errors', async () => {
        mockRedisService.get.mockRejectedValue(new Error('Redis error'));

        await service['clearFeatureCache']();

        // fallback to default config => still clears best-effort
        expect(mockRedisService.del).toHaveBeenCalled();
      });
    });
  });
});