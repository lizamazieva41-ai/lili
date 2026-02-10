import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from '../../../src/licensing/api-key.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { RedisService } from '../../../src/config/redis.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  let mockPrismaService: any;
  let mockRedisService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockPrismaService = {
      license: {
        findUnique: jest.fn(),
      },
      apiKey: {
        count: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      usageLog: {
        findMany: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
      },
      apiKeyUsage: {
        findMany: jest.fn(),
      },
    };

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
        ApiKeyService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApiKey', () => {
    it('should create API key', async () => {
      const createData = {
        licenseId: 'license-1',
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

      const mockLicense = {
        id: 'license-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: expect.any(String),
        permissions: createData.permissions,
        rateLimit: createData.rateLimit,
        isActive: true,
        expiresAt: createData.expiresAt,
        usageCount: 0,
        usageLimit: 10000,
        usagePeriod: 'daily',
        license: mockLicense,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.apiKey.count.mockResolvedValue(0);
      mockPrismaService.apiKey.create.mockResolvedValue(mockApiKey);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.createApiKey(createData);

      expect(result).toEqual(mockApiKey);
      expect(mockPrismaService.apiKey.create).toHaveBeenCalledWith({
        data: {
          licenseId: 'license-1',
          name: 'Test API Key',
          key: expect.any(String),
          keyHash: expect.any(String),
          permissions: createData.permissions,
          rateLimit: createData.rateLimit,
          isActive: true,
          expiresAt: createData.expiresAt,
          usageCount: 0,
          usageLimit: 10000,
          usagePeriod: 'daily',
        },
        include: {
          license: {
            include: { user: true },
          },
        },
      });

      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if license not found', async () => {
      const createData = {
        licenseId: 'invalid-license',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      mockPrismaService.license.findUnique.mockResolvedValue(null);

      await expect(service.createApiKey(createData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if license is inactive', async () => {
      const createData = {
        licenseId: 'license-1',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      const mockLicense = {
        id: 'license-1',
        plan: 'PREMIUM',
        status: 'INACTIVE',
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);

      await expect(service.createApiKey(createData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if max API keys reached', async () => {
      const createData = {
        licenseId: 'license-1',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      const mockLicense = {
        id: 'license-1',
        plan: 'BASIC',
        status: 'ACTIVE',
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.apiKey.count.mockResolvedValue(1);

      await expect(service.createApiKey(createData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use default rateLimit if not provided', async () => {
      const createData = {
        licenseId: 'license-1',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      const mockLicense = {
        id: 'license-1',
        plan: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: expect.any(String),
        permissions: createData.permissions,
        rateLimit: {},
        isActive: true,
        usageCount: 0,
        usageLimit: 10000,
        usagePeriod: 'daily',
        license: mockLicense,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.apiKey.count.mockResolvedValue(0);
      mockPrismaService.apiKey.create.mockResolvedValue(mockApiKey);

      const result = await service.createApiKey(createData);

      expect(result.rateLimit).toEqual({});
    });

    it('should use default usageLimit for plan', async () => {
      const createData = {
        licenseId: 'license-1',
        name: 'Test API Key',
        permissions: {
          permissions: [],
          resources: [],
        },
      };

      const mockLicense = {
        id: 'license-1',
        plan: 'BASIC',
        status: 'ACTIVE',
      };

      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: expect.any(String),
        permissions: createData.permissions,
        rateLimit: {},
        isActive: true,
        usageCount: 0,
        usageLimit: 1000,
        usagePeriod: 'daily',
        license: mockLicense,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.apiKey.count.mockResolvedValue(0);
      mockPrismaService.apiKey.create.mockResolvedValue(mockApiKey);

      const result = await service.createApiKey(createData);

      expect(result.usageLimit).toBe(1000);
    });
  });

  describe('getApiKey', () => {
    it('should return API key from cache', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockApiKey));

      const result = await service.getApiKey('api-key-1');

      expect(result).toEqual(mockApiKey);
      expect(mockPrismaService.apiKey.findFirst).not.toHaveBeenCalled();
    });

    it('should return API key from database if not in cache', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getApiKey('api-key-1');

      expect(result).toEqual(mockApiKey);
      expect(mockPrismaService.apiKey.findFirst).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        include: {
          license: {
            include: { user: true },
          },
        },
      });

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'api_key:api-key-1',
        JSON.stringify(mockApiKey),
        1800,
      );
    });

    it('should return null if API key not found', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.apiKey.findFirst.mockResolvedValue(null);

      const result = await service.getApiKey('invalid-api-key');

      expect(result).toBeNull();
    });

    it('should not include license if requested', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);

      const result = await service.getApiKey('api-key-1', false);

      expect(result).toEqual(mockApiKey);
      expect(mockPrismaService.apiKey.findFirst).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
      });
    });
  });

  describe('getLicenseApiKeys', () => {
    it('should return API keys for license', async () => {
      const mockApiKeys = [
        {
          id: 'api-key-1',
          licenseId: 'license-1',
          name: 'Test API Key 1',
          key: 'tg_test-key-1',
          keyHash: 'hashed-key-1',
          permissions: {
            permissions: ['read'],
            resources: ['messages'],
          },
          isActive: true,
          license: {
            id: 'license-1',
            plan: 'PREMIUM',
            status: 'ACTIVE',
            user: {
              id: 'user-1',
              email: 'user@example.com',
            },
          },
        },
        {
          id: 'api-key-2',
          licenseId: 'license-1',
          name: 'Test API Key 2',
          key: 'tg_test-key-2',
          keyHash: 'hashed-key-2',
          permissions: {
            permissions: ['write'],
            resources: ['campaigns'],
          },
          isActive: true,
          license: {
            id: 'license-1',
            plan: 'PREMIUM',
            status: 'ACTIVE',
            user: {
              id: 'user-1',
              email: 'user@example.com',
            },
          },
        },
      ];

      mockPrismaService.apiKey.findMany.mockResolvedValue(mockApiKeys);

      const result = await service.getLicenseApiKeys('license-1');

      expect(result).toEqual(mockApiKeys);
      expect(mockPrismaService.apiKey.findMany).toHaveBeenCalledWith({
        where: {
          licenseId: 'license-1',
          isActive: true,
        },
        include: {
          license: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should include inactive keys if requested', async () => {
      const mockApiKeys = [
        {
          id: 'api-key-1',
          licenseId: 'license-1',
          name: 'Test API Key 1',
          isActive: true,
        },
        {
          id: 'api-key-2',
          licenseId: 'license-1',
          name: 'Test API Key 2',
          isActive: false,
        },
      ];

      mockPrismaService.apiKey.findMany.mockResolvedValue(mockApiKeys);

      const result = await service.getLicenseApiKeys('license-1', true);

      expect(result).toEqual(mockApiKeys);
      expect(mockPrismaService.apiKey.findMany).toHaveBeenCalledWith({
        where: {
          licenseId: 'license-1',
        },
        include: {
          license: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateApiKey', () => {
    it('should update API key', async () => {
      const updateData = {
        name: 'Updated API Key',
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 200,
        },
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        description: 'Updated description',
      };

      const mockExistingKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockUpdatedKey = {
        ...mockExistingKey,
        name: 'Updated API Key',
        permissions: updateData.permissions,
        rateLimit: updateData.rateLimit,
        expiresAt: updateData.expiresAt,
        description: updateData.description,
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockExistingKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockUpdatedKey);
      mockRedisService.del.mockResolvedValue(1);

      const result = await service.updateApiKey('api-key-1', updateData);

      expect(result).toEqual(mockUpdatedKey);
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
        include: {
          license: {
            include: { user: true },
          },
        },
      });

      expect(mockRedisService.del).toHaveBeenCalledWith('api_key:api-key-1');
    });

    it('should throw NotFoundException if API key not found', async () => {
      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(
        service.updateApiKey('invalid-api-key', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        name: 'Updated API Key',
      };

      const mockExistingKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockUpdatedKey = {
        ...mockExistingKey,
        name: 'Updated API Key',
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockExistingKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockUpdatedKey);
      mockRedisService.del.mockResolvedValue(1);

      const result = await service.updateApiKey('api-key-1', updateData);

      expect(result).toEqual(mockUpdatedKey);
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        data: {
          name: 'Updated API Key',
          updatedAt: expect.any(Date),
        },
        include: {
          license: {
            include: { user: true },
          },
        },
      });
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockRevokedKey = {
        ...mockApiKey,
        isActive: false,
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockRevokedKey);
      mockRedisService.del.mockResolvedValue(1);

      const result = await service.revokeApiKey('api-key-1', 'Security concern');

      expect(result).toEqual(mockRevokedKey);
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        data: {
          isActive: false,
          updatedAt: expect.any(Date),
        },
        include: { license: true },
      });

      expect(mockRedisService.del).toHaveBeenCalledWith('api_key:api-key-1');
    });

    it('should throw NotFoundException if API key not found', async () => {
      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(
        service.revokeApiKey('invalid-api-key', 'Security concern'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteApiKey', () => {
    it('should delete API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.apiKey.delete.mockResolvedValue(mockApiKey);
      mockRedisService.del.mockResolvedValue(1);

      await service.deleteApiKey('api-key-1');

      expect(mockPrismaService.apiKey.delete).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
      });

      expect(mockRedisService.del).toHaveBeenCalledWith('api_key:api-key-1');
    });

    it('should throw NotFoundException if API key not found', async () => {
      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(service.deleteApiKey('invalid-api-key')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('regenerateApiKey', () => {
    it('should regenerate API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_old-key-123',
        keyHash: 'old-hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockRegeneratedKey = {
        ...mockApiKey,
        key: 'tg_new-key-456',
        keyHash: 'new-hashed-key',
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockRegeneratedKey);
      mockRedisService.del.mockResolvedValue(1);

      const result = await service.regenerateApiKey('api-key-1');

      expect(result).toEqual(mockRegeneratedKey);
      expect(result.key).not.toBe(mockApiKey.key);
      expect(result.keyHash).not.toBe(mockApiKey.keyHash);

      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        data: {
          key: expect.any(String),
          keyHash: expect.any(String),
          updatedAt: expect.any(Date),
        },
        include: { license: true },
      });

      expect(mockRedisService.del).toHaveBeenCalledWith('api_key:api-key-1');
    });

    it('should throw NotFoundException if API key not found', async () => {
      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(service.regenerateApiKey('invalid-api-key')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate new key with correct prefix', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_old-key-123',
        keyHash: 'old-hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      const mockRegeneratedKey = {
        ...mockApiKey,
        key: 'tg_new-key-456',
        keyHash: 'new-hashed-key',
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockRegeneratedKey);
      mockRedisService.del.mockResolvedValue(1);

      const result = await service.regenerateApiKey('api-key-1');

      expect(result.key).toMatch(/^tg_/);
    });
  });

  describe('validateApiKey', () => {
    it('should validate valid API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read', 'write'],
          resources: ['messages', 'campaigns'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
      };

      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);
      mockPrismaService.usageLog.count.mockResolvedValue(0);
      mockPrismaService.apiKey.update.mockResolvedValue({ ...mockApiKey, usageCount: 1, lastUsedAt: new Date() });
      mockPrismaService.apiKey.findUnique.mockResolvedValue({ ...mockApiKey, license: { ...mockApiKey.license, userId: 'user-1' } });
      mockPrismaService.usageLog.create.mockResolvedValue({});

      const result = await service.validateApiKey('tg_test-key-123', {
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        resource: 'messages',
        action: 'send',
      });

      expect(result).toEqual({
        isValid: true,
        apiKey: mockApiKey,
        license: mockApiKey.license,
        permissions: mockApiKey.permissions,
        rateLimit: mockApiKey.rateLimit,
      });
    });

    it('should return invalid for non-existent API key', async () => {
      mockPrismaService.apiKey.findFirst.mockResolvedValue(null);

      const result = await service.validateApiKey('invalid-api-key');

      expect(result).toEqual({
        isValid: false,
        reason: 'API key không tồn tại',
      });
    });

    it('should return invalid for inactive API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: false,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);

      const result = await service.validateApiKey('tg_test-key-123');

      expect(result).toEqual({
        isValid: false,
        reason: 'API key đã bị vô hiệu hóa',
      });
    });

    it('should return invalid for inactive license', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'INACTIVE',
        },
      };

      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);

      const result = await service.validateApiKey('tg_test-key-123');

      expect(result).toEqual({
        isValid: false,
        reason: 'License không hoạt động',
      });
    });

    it('should return invalid for expired API key', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        expiresAt: new Date(Date.now() - 1000),
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);

      const result = await service.validateApiKey('tg_test-key-123');

      expect(result).toEqual({
        isValid: false,
        reason: 'API key đã hết hạn',
      });
    });

    it('should return invalid for rate limit violations', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        rateLimit: {
          requestsPerMinute: 100,
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockPrismaService.apiKey.findFirst.mockResolvedValue(mockApiKey);
      mockPrismaService.usageLog.count.mockResolvedValue(150); // Exceeds limit

      const result = await service.validateApiKey('tg_test-key-123');

      expect(result).toEqual({
        isValid: false,
        apiKey: mockApiKey,
        license: mockApiKey.license,
        permissions: mockApiKey.permissions,
        rateLimit: mockApiKey.rateLimit,
        violations: [
          {
            type: 'RATE_LIMIT_PER_MINUTE',
            message: 'Vượt quá rate limit/phút (100)',
            limit: 100,
            current: 150,
          },
        ],
        reason: 'Vượt quá giới hạn sử dụng',
      });
    });

    it('should handle errors', async () => {
      mockPrismaService.apiKey.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(service.validateApiKey('test-api-key')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getApiKeyMetrics', () => {
    it('should return API key metrics', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
      };

      const mockRecentUsage = [
        {
          id: 'log-1',
          apiKeyId: 'api-key-1',
          action: 'validate',
          context: {
            ipAddress: '127.0.0.1',
            userAgent: 'Test Agent',
          },
          createdAt: new Date(),
        },
      ];

      const mockUsageStats = [
        {
          id: 'stat-1',
          apiKeyId: 'api-key-1',
          date: new Date(),
          requests: 10,
        },
      ];

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.usageLog.findMany.mockResolvedValue(mockRecentUsage);
      mockPrismaService.apiKeyUsage.findMany.mockResolvedValue(mockUsageStats);

      const result = await service.getApiKeyMetrics('api-key-1', 30);

      expect(result).toEqual({
        apiKey: mockApiKey,
        recentUsage: mockRecentUsage,
        usageStats: mockUsageStats,
        summary: expect.any(Object),
        trends: expect.any(Object),
      });

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { id: 'api-key-1' },
        include: {
          license: {
            include: { user: true },
          },
        },
      });

      expect(mockPrismaService.usageLog.findMany).toHaveBeenCalledWith({
        where: {
          apiKeyId: 'api-key-1',
          createdAt: expect.any(Object),
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      expect(mockPrismaService.apiKeyUsage.findMany).toHaveBeenCalledWith({
        where: {
          apiKeyId: 'api-key-1',
          date: expect.any(Object),
        },
        orderBy: { date: 'desc' },
      });
    });

    it('should handle empty results', async () => {
      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);
      mockPrismaService.usageLog.findMany.mockResolvedValue([]);
      mockPrismaService.apiKeyUsage.findMany.mockResolvedValue([]);

      const result = await service.getApiKeyMetrics('api-key-1', 30);

      expect(result.apiKey).toBeNull();
      expect(result.recentUsage).toHaveLength(0);
      expect(result.usageStats).toHaveLength(0);
    });

    it('should use default days if not provided', async () => {
      const mockApiKey = {
        id: 'api-key-1',
        licenseId: 'license-1',
        name: 'Test API Key',
        key: 'tg_test-key-123',
        keyHash: 'hashed-key',
        permissions: {
          permissions: ['read'],
          resources: ['messages'],
        },
        isActive: true,
        license: {
          id: 'license-1',
          plan: 'PREMIUM',
          status: 'ACTIVE',
        },
      };

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.usageLog.findMany.mockResolvedValue([]);
      mockPrismaService.apiKeyUsage.findMany.mockResolvedValue([]);

      const result = await service.getApiKeyMetrics('api-key-1');

      expect(result).toEqual({
        apiKey: mockApiKey,
        recentUsage: [],
        usageStats: [],
        summary: expect.any(Object),
        trends: expect.any(Object),
      });
    });
  });

  describe('private methods', () => {
    describe('generateApiKey', () => {
      it('should generate API key with correct format', () => {
        const result = service['generateApiKey']();

        expect(result).toMatch(/^tg_/);
        expect(result.length).toBeGreaterThan(10);
      });

      it('should generate unique keys', () => {
        const key1 = service['generateApiKey']();
        const key2 = service['generateApiKey']();

        expect(key1).not.toBe(key2);
      });
    });

    describe('hashApiKey', () => {
      it('should hash API key', () => {
        const result = service['hashApiKey']('test-key');

        // sha256('test-key')
        expect(result).toBe('62af8704764faf8ea82fc61ce9c4c3908b6cb97d463a634e9e587d7c885db0ef');
      });

      it('should generate consistent hash for same input', () => {
        const hash1 = service['hashApiKey']('test-key');
        const hash2 = service['hashApiKey']('test-key');

        expect(hash1).toBe(hash2);
      });

      it('should generate different hash for different input', () => {
        const hash1 = service['hashApiKey']('test-key-1');
        const hash2 = service['hashApiKey']('test-key-2');

        expect(hash1).not.toBe(hash2);
      });
    });

    describe('getMaxApiKeysForPlan', () => {
      it('should return correct max keys for plan', () => {
        expect(service['getMaxApiKeysForPlan']('BASIC')).toBe(1);
        expect(service['getMaxApiKeysForPlan']('PREMIUM')).toBe(3);
        expect(service['getMaxApiKeysForPlan']('ENTERPRISE')).toBe(10);
        expect(service['getMaxApiKeysForPlan']('CUSTOM')).toBe(50);
        expect(service['getMaxApiKeysForPlan']('UNKNOWN')).toBe(1);
      });
    });

    describe('getDefaultUsageLimit', () => {
      it('should return correct default usage limit for plan', () => {
        expect(service['getDefaultUsageLimit']('BASIC')).toBe(1000);
        expect(service['getDefaultUsageLimit']('PREMIUM')).toBe(10000);
        expect(service['getDefaultUsageLimit']('ENTERPRISE')).toBe(100000);
        expect(service['getDefaultUsageLimit']('CUSTOM')).toBe(1000000);
        expect(service['getDefaultUsageLimit']('UNKNOWN')).toBe(1000);
      });
    });
  });
});