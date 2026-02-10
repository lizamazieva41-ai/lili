import { Test, TestingModule } from '@nestjs/testing';
import { ProxiesService } from '../../../src/proxies/proxies.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProxyType } from '../../../src/proxies/dto/create-proxy.dto';
import { CacheService } from '../../../src/common/services/cache.service';

describe('ProxiesService', () => {
  let service: ProxiesService;
  let mockPrismaService: any;
  let mockCacheService: any;

  beforeEach(async () => {
    mockPrismaService = {
      proxy: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      telegramAccount: {
        findMany: jest.fn(),
      },
      accountProxyAssignment: {
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      proxyHealthLog: {
        create: jest.fn(),
      },
    };

    mockCacheService = {
      getProxy: jest.fn(async (_id: string, getter: () => Promise<any>) => getter()),
      set: jest.fn(),
      invalidateProxy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxiesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<ProxiesService>(ProxiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated proxies', async () => {
      const mockProxies = [
        {
          id: 'proxy-1',
          name: 'Proxy 1',
          type: 'HTTP',
          host: 'proxy1.example.com',
          port: 8080,
          country: 'US',
          status: 'ACTIVE',
        },
        {
          id: 'proxy-2',
          name: 'Proxy 2',
          type: 'SOCKS5',
          host: 'proxy2.example.com',
          port: 1080,
          country: 'UK',
          status: 'INACTIVE',
        },
      ];

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);
      mockPrismaService.proxy.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result).toEqual({
        proxies: mockProxies,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.proxy.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockProxies = [
        {
          id: 'proxy-1',
          name: 'Proxy 1',
          type: 'HTTP',
          host: 'proxy1.example.com',
          port: 8080,
          country: 'US',
          status: 'ACTIVE',
        },
      ];

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);
      mockPrismaService.proxy.count.mockResolvedValue(1);

      const result = await service.findAll({ status: 'active' });

      expect(result.proxies).toHaveLength(1);
      expect(mockPrismaService.proxy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'ACTIVE' },
        }),
      );
    });

    it('should filter by type', async () => {
      const mockProxies = [
        {
          id: 'proxy-1',
          name: 'Proxy 1',
          type: 'HTTP',
          host: 'proxy1.example.com',
          port: 8080,
          country: 'US',
          status: 'ACTIVE',
        },
      ];

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);
      mockPrismaService.proxy.count.mockResolvedValue(1);

      const result = await service.findAll({ type: 'http' });

      expect(result.proxies).toHaveLength(1);
      expect(mockPrismaService.proxy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'HTTP' },
        }),
      );
    });

    it('should filter by country', async () => {
      const mockProxies = [
        {
          id: 'proxy-1',
          name: 'Proxy 1',
          type: 'HTTP',
          host: 'proxy1.example.com',
          port: 8080,
          country: 'US',
          status: 'ACTIVE',
        },
      ];

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);
      mockPrismaService.proxy.count.mockResolvedValue(1);

      const result = await service.findAll({ country: 'US' });

      expect(result.proxies).toHaveLength(1);
      expect(mockPrismaService.proxy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { country: 'US' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockProxies = Array(100).fill({
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'ACTIVE',
      });

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);
      mockPrismaService.proxy.count.mockResolvedValue(100);

      const result = await service.findAll({ limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });
  });

  describe('findOne', () => {
    it('should return proxy by ID', async () => {
      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'ACTIVE',
      };

      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);

      const result = await service.findOne('proxy-1');

      expect(result).toEqual(mockProxy);

      expect(mockPrismaService.proxy.findUnique).toHaveBeenCalledWith({
        where: { id: 'proxy-1' },
      });
    });

    it('should throw NotFoundException if proxy not found', async () => {
      mockPrismaService.proxy.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-proxy')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new proxy', async () => {
      const createProxyDto = {
        name: 'New Proxy',
        type: ProxyType.HTTP,
        host: 'new-proxy.example.com',
        port: 8080,
        username: 'user',
        password: 'pass',
        country: 'US',
        region: 'California',
        tags: ['tag1', 'tag2'],
        notes: 'Test proxy',
      };

      const mockProxy = {
        id: 'proxy-1',
        name: 'New Proxy',
        type: 'HTTP',
        host: 'new-proxy.example.com',
        port: 8080,
        username: 'user',
        password: 'pass',
        country: 'US',
        region: 'California',
        status: 'INACTIVE',
        isActive: true,
        tags: ['tag1', 'tag2'],
        notes: 'Test proxy',
        healthScore: 0,
        createdBy: 'user-1',
      };

      mockPrismaService.proxy.findFirst.mockResolvedValue(null);
      mockPrismaService.proxy.create.mockResolvedValue(mockProxy);

      const result = await service.create(createProxyDto, 'user-1');

      expect(result).toEqual(mockProxy);

      expect(mockPrismaService.proxy.create).toHaveBeenCalledWith({
        data: {
          name: 'New Proxy',
          type: 'HTTP',
          host: 'new-proxy.example.com',
          port: 8080,
          username: 'user',
          password: 'pass',
          country: 'US',
          region: 'California',
          status: 'INACTIVE',
          isActive: true,
          tags: ['tag1', 'tag2'],
          notes: 'Test proxy',
          createdBy: 'user-1',
        },
      });
    });

    it('should throw BadRequestException for duplicate proxy', async () => {
      const createProxyDto = {
        name: 'Duplicate Proxy',
        type: ProxyType.HTTP,
        host: 'duplicate.example.com',
        port: 8080,
      };

      const mockExistingProxy = {
        id: 'existing-proxy',
        name: 'Existing Proxy',
        type: 'HTTP',
        host: 'duplicate.example.com',
        port: 8080,
      };

      mockPrismaService.proxy.findFirst.mockResolvedValue(mockExistingProxy);

      await expect(service.create(createProxyDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use default country if not provided', async () => {
      const createProxyDto = {
        name: 'Proxy with default country',
        type: ProxyType.HTTP,
        host: 'proxy.example.com',
        port: 8080,
      };

      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy with default country',
        type: 'HTTP',
        host: 'proxy.example.com',
        port: 8080,
        country: 'Unknown',
        region: 'Unknown',
        status: 'INACTIVE',
        isActive: true,
        tags: [],
      };

      mockPrismaService.proxy.findFirst.mockResolvedValue(null);
      mockPrismaService.proxy.create.mockResolvedValue(mockProxy);

      const result = await service.create(createProxyDto, 'user-1');

      expect(result.country).toBe('Unknown');
      expect(result.region).toBe('Unknown');
    });

    it('should use default tags if not provided', async () => {
      const createProxyDto = {
        name: 'Proxy with default tags',
        type: ProxyType.HTTP,
        host: 'proxy.example.com',
        port: 8080,
      };

      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy with default tags',
        type: 'HTTP',
        host: 'proxy.example.com',
        port: 8080,
        country: 'Unknown',
        region: 'Unknown',
        status: 'INACTIVE',
        isActive: true,
        tags: [],
      };

      mockPrismaService.proxy.findFirst.mockResolvedValue(null);
      mockPrismaService.proxy.create.mockResolvedValue(mockProxy);

      const result = await service.create(createProxyDto, 'user-1');

      expect(result.tags).toEqual([]);
    });

    it('should create proxy without userId', async () => {
      const createProxyDto = {
        name: 'Proxy without user',
        type: ProxyType.HTTP,
        host: 'proxy.example.com',
        port: 8080,
      };

      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy without user',
        type: 'HTTP',
        host: 'proxy.example.com',
        port: 8080,
        country: 'Unknown',
        region: 'Unknown',
        status: 'INACTIVE',
        isActive: true,
        tags: [],
        createdBy: null,
      };

      mockPrismaService.proxy.findFirst.mockResolvedValue(null);
      mockPrismaService.proxy.create.mockResolvedValue(mockProxy);

      const result = await service.create(createProxyDto);

      expect(result.createdBy).toBeNull();
    });
  });

  describe('update', () => {
    it('should update proxy', async () => {
      const updateProxyDto = {
        name: 'Updated Proxy',
        status: 'ACTIVE',
        healthScore: 90,
      };

      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'ACTIVE',
        healthScore: 90,
      };

      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.proxy.update.mockResolvedValue(mockProxy);

      const result = await service.update('proxy-1', updateProxyDto);

      expect(result).toEqual(mockProxy);

      expect(mockPrismaService.proxy.update).toHaveBeenCalledWith({
        where: { id: 'proxy-1' },
        data: {
          ...updateProxyDto,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if proxy not found', async () => {
      mockPrismaService.proxy.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid-proxy', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete proxy', async () => {
      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'ACTIVE',
      };

      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.proxy.delete.mockResolvedValue(mockProxy);

      await service.remove('proxy-1');

      expect(mockPrismaService.proxy.delete).toHaveBeenCalledWith({
        where: { id: 'proxy-1' },
      });
    });

    it('should throw NotFoundException if proxy not found', async () => {
      mockPrismaService.proxy.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-proxy')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('testProxy', () => {
    it('should test proxy and return healthy result', async () => {
      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'INACTIVE',
        healthScore: 50,
        responseTime: 0,
      };

      const mockUpdatedProxy = {
        ...mockProxy,
        status: 'ACTIVE',
        healthScore: 80,
        responseTime: 100,
        lastChecked: expect.any(Date),
      };

      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.proxy.update.mockResolvedValue(mockUpdatedProxy);
      mockPrismaService.proxyHealthLog.create.mockResolvedValue({});

      const result = await service.testProxy('proxy-1');

      expect(result).toEqual({
        status: 'healthy',
        responseTime: expect.any(Number),
        isWorking: true,
        testedAt: expect.any(Date),
        error: undefined,
      });

      expect(mockPrismaService.proxy.update).toHaveBeenCalledWith({
        where: { id: 'proxy-1' },
        data: {
          status: 'ACTIVE',
          healthScore: 80,
          responseTime: expect.any(Number),
          lastChecked: expect.any(Date),
        },
      });

      expect(mockPrismaService.proxyHealthLog.create).toHaveBeenCalledWith({
        data: {
          proxyId: 'proxy-1',
          testType: 'CONNECTIVITY',
          isHealthy: true,
          responseTime: expect.any(Number),
          error: undefined,
          createdAt: expect.any(Date),
        },
      });
    });

    it('should test proxy and return unhealthy result', async () => {
      const mockProxy = {
        id: 'proxy-1',
        name: 'Proxy 1',
        type: 'HTTP',
        host: 'proxy1.example.com',
        port: 8080,
        country: 'US',
        status: 'ACTIVE',
        healthScore: 80,
        responseTime: 100,
      };

      const mockUpdatedProxy = {
        ...mockProxy,
        status: 'ERROR',
        healthScore: 20,
        responseTime: 100,
        lastChecked: expect.any(Date),
      };

      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.proxy.update.mockResolvedValue(mockUpdatedProxy);
      mockPrismaService.proxyHealthLog.create.mockResolvedValue({});

      const nowSpy = jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(0) // startTime
        .mockReturnValueOnce(6001); // responseTime > 5000 => unhealthy

      const result = await service.testProxy('proxy-1');

      nowSpy.mockRestore();

      expect(result).toEqual({
        status: 'unhealthy',
        responseTime: expect.any(Number),
        isWorking: false,
        testedAt: expect.any(Date),
        error: expect.any(String),
      });

      expect(mockPrismaService.proxy.update).toHaveBeenCalledWith({
        where: { id: 'proxy-1' },
        data: {
          status: 'ERROR',
          healthScore: 20,
          responseTime: expect.any(Number),
          lastChecked: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if proxy not found', async () => {
      mockPrismaService.proxy.findUnique.mockResolvedValue(null);

      await expect(service.testProxy('invalid-proxy')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('should return proxy statistics', async () => {
      const mockProxies = [
        {
          country: 'US',
          type: 'HTTP',
          healthScore: 80,
          responseTime: 100,
        },
        {
          country: 'US',
          type: 'SOCKS5',
          healthScore: 90,
          responseTime: 150,
        },
        {
          country: 'UK',
          type: 'HTTP',
          healthScore: 70,
          responseTime: 200,
        },
      ];

      mockPrismaService.proxy.count
        .mockResolvedValueOnce(3) // total
        .mockResolvedValueOnce(2) // active
        .mockResolvedValueOnce(1) // inactive
        .mockResolvedValueOnce(0); // error

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 3,
        active: 2,
        inactive: 1,
        error: 0,
        byCountry: {
          US: 2,
          UK: 1,
        },
        byType: {
          HTTP: 2,
          SOCKS5: 1,
        },
        averageHealthScore: 80,
        averageResponseTime: 150,
      });

      expect(mockPrismaService.proxy.count).toHaveBeenCalledTimes(4);
      expect(mockPrismaService.proxy.findMany).toHaveBeenCalled();
    });

    it('should handle empty proxy list', async () => {
      mockPrismaService.proxy.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrismaService.proxy.findMany.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 0,
        active: 0,
        inactive: 0,
        error: 0,
        byCountry: {},
        byType: {},
        averageHealthScore: 0,
        averageResponseTime: 0,
      });
    });

    it('should handle proxies with null values', async () => {
      const mockProxies = [
        {
          country: null,
          type: 'HTTP',
          healthScore: 80,
          responseTime: null,
        },
        {
          country: 'US',
          type: null,
          healthScore: 90,
          responseTime: 150,
        },
      ];

      mockPrismaService.proxy.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      mockPrismaService.proxy.findMany.mockResolvedValue(mockProxies);

      const result = await service.getStats();

      expect(result.byCountry).toEqual({
        Unknown: 1,
        US: 1,
      });

      expect(result.byType).toEqual({
        HTTP: 1,
        Unknown: 1,
      });

      expect(result.averageResponseTime).toBe(150);
    });
  });

  describe('rotateProxies', () => {
    it('should rotate proxies for all accounts', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          proxyAssignments: [
            {
              proxy: {
                id: 'proxy-1',
                host: 'proxy1.example.com',
                status: 'ACTIVE',
                healthScore: 80,
              },
            },
          ],
        },
        {
          id: 'account-2',
          proxyAssignments: [],
        },
      ];

      const mockAvailableProxies = [
        {
          id: 'proxy-2',
          host: 'proxy2.example.com',
          status: 'ACTIVE',
          healthScore: 90,
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.proxy.findMany
        .mockResolvedValueOnce(mockAvailableProxies) // account-1 gets proxy-2
        .mockResolvedValueOnce([]); // account-2 no available proxy => failure
      mockPrismaService.accountProxyAssignment.updateMany.mockResolvedValue({});
      mockPrismaService.accountProxyAssignment.create.mockResolvedValue({});

      const result = await service.rotateProxies();

      expect(result).toEqual({
        rotated: 1,
        failed: 1,
        details: [
          {
            accountId: 'account-1',
            oldProxyId: 'proxy-1',
            newProxyId: 'proxy-2',
            error: undefined,
          },
          {
            accountId: 'account-2',
            oldProxyId: undefined,
            newProxyId: undefined,
            error: 'No available healthy proxy found',
          },
        ],
      });

      expect(mockPrismaService.accountProxyAssignment.updateMany).toHaveBeenCalled();
      expect(mockPrismaService.accountProxyAssignment.create).toHaveBeenCalled();
    });

    it('should rotate proxies for specific accounts', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          proxyAssignments: [
            {
              proxy: {
                id: 'proxy-1',
                host: 'proxy1.example.com',
                status: 'ACTIVE',
                healthScore: 80,
              },
            },
          ],
        },
      ];

      const mockAvailableProxies = [
        {
          id: 'proxy-2',
          host: 'proxy2.example.com',
          status: 'ACTIVE',
          healthScore: 90,
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.proxy.findMany.mockResolvedValue(mockAvailableProxies);
      mockPrismaService.accountProxyAssignment.updateMany.mockResolvedValue({});
      mockPrismaService.accountProxyAssignment.create.mockResolvedValue({});

      const result = await service.rotateProxies(['account-1']);

      expect(result).toEqual({
        rotated: 1,
        failed: 0,
        details: [
          {
            accountId: 'account-1',
            oldProxyId: 'proxy-1',
            newProxyId: 'proxy-2',
          },
        ],
      });

      expect(mockPrismaService.telegramAccount.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['account-1'] } },
        include: {
          proxyAssignments: {
            where: { isActive: true },
            include: { proxy: true },
          },
        },
      });
    });

    it('should handle no available proxies', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          proxyAssignments: [
            {
              proxy: {
                id: 'proxy-1',
                host: 'proxy1.example.com',
                status: 'ACTIVE',
                healthScore: 80,
              },
            },
          ],
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.proxy.findMany.mockResolvedValue([]);

      const result = await service.rotateProxies(['account-1']);

      expect(result).toEqual({
        rotated: 0,
        failed: 1,
        details: [
          {
            accountId: 'account-1',
            oldProxyId: 'proxy-1',
            newProxyId: undefined,
            error: 'No available healthy proxy found',
          },
        ],
      });

      expect(mockPrismaService.accountProxyAssignment.updateMany).not.toHaveBeenCalled();
      expect(mockPrismaService.accountProxyAssignment.create).not.toHaveBeenCalled();
    });

    it('should handle errors during rotation', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          proxyAssignments: [
            {
              proxy: {
                id: 'proxy-1',
                host: 'proxy1.example.com',
                status: 'ACTIVE',
                healthScore: 80,
              },
            },
          ],
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.proxy.findMany.mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await service.rotateProxies(['account-1']);

      expect(result).toEqual({
        rotated: 0,
        failed: 1,
        details: [
          {
            accountId: 'account-1',
            oldProxyId: 'proxy-1',
            newProxyId: undefined,
            error: 'Database error',
          },
        ],
      });
    });

    it('should handle accounts with no current proxy', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          proxyAssignments: [],
        },
      ];

      const mockAvailableProxies = [
        {
          id: 'proxy-1',
          host: 'proxy1.example.com',
          status: 'ACTIVE',
          healthScore: 80,
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.proxy.findMany.mockResolvedValue(mockAvailableProxies);
      mockPrismaService.accountProxyAssignment.create.mockResolvedValue({});

      const result = await service.rotateProxies(['account-1']);

      expect(result).toEqual({
        rotated: 1,
        failed: 0,
        details: [
          {
            accountId: 'account-1',
            oldProxyId: undefined,
            newProxyId: 'proxy-1',
          },
        ],
      });

      expect(mockPrismaService.accountProxyAssignment.create).toHaveBeenCalledWith({
        data: {
          accountId: 'account-1',
          proxyId: 'proxy-1',
          isActive: true,
        },
      });
    });
  });
});