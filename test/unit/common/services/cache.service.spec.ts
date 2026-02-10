import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../../../src/common/services/cache.service';
import { RedisService } from '../../../../src/config/redis.service';

describe('CacheService', () => {
  let service: CacheService;
  let redisService: RedisService;

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    keys: jest.fn(),
    dbSize: jest.fn(),
    info: jest.fn(),
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                CACHE_DEFAULT_TTL: 3600,
                CACHE_KEY_PREFIX: 'app:cache:',
              };
              return config[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const key = 'test-key';
      const cachedValue = { data: 'cached' };
      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedValue));

      const result = await service.getOrSet(key, async () => ({ data: 'new' }));

      expect(result).toEqual(cachedValue);
      expect(mockRedisService.get).toHaveBeenCalledWith('app:cache:test-key');
    });

    it('should fetch and cache value if not exists', async () => {
      const key = 'test-key';
      const newValue = { data: 'new' };
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getOrSet(key, async () => newValue);

      expect(result).toEqual(newValue);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'app:cache:test-key',
        JSON.stringify(newValue),
        3600,
      );
    });

    it('should return fetched value on cache error', async () => {
      const key = 'test-key';
      const newValue = { data: 'new' };
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.getOrSet(key, async () => newValue);

      expect(result).toEqual(newValue);
    });
  });

  describe('get', () => {
    it('should return cached value', async () => {
      const key = 'test-key';
      const cachedValue = { data: 'cached' };
      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedValue));

      const result = await service.get(key);

      expect(result).toEqual(cachedValue);
    });

    it('should return null if key not found', async () => {
      const key = 'test-key';
      mockRedisService.get.mockResolvedValue(null);

      const result = await service.get(key);

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      mockRedisService.set.mockResolvedValue(undefined);

      await service.set(key, value);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'app:cache:test-key',
        JSON.stringify(value),
        3600,
      );
    });
  });

  describe('delete', () => {
    it('should delete key from cache', async () => {
      const key = 'test-key';
      mockRedisService.del.mockResolvedValue(1);

      await service.delete(key);

      expect(mockRedisService.del).toHaveBeenCalledWith('app:cache:test-key');
    });
  });

  describe('getUser', () => {
    it('should cache user data', async () => {
      const userId = 'user-123';
      const userData = { id: userId, name: 'Test User' };
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getUser(userId, async () => userData);

      expect(result).toEqual(userData);
      expect(mockRedisService.set).toHaveBeenCalled();
    });
  });

  describe('getLicense', () => {
    it('should cache license data', async () => {
      const licenseId = 'license-123';
      const licenseData = { id: licenseId, plan: 'PREMIUM' };
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getLicense(licenseId, async () => licenseData);

      expect(result).toEqual(licenseData);
    });
  });

  describe('getProxy', () => {
    it('should cache proxy data', async () => {
      const proxyId = 'proxy-123';
      const proxyData = { id: proxyId, host: '127.0.0.1', port: 8080 };
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getProxy(proxyId, async () => proxyData);

      expect(result).toEqual(proxyData);
    });
  });
});
