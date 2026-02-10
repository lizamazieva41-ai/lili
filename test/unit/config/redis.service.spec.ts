import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../../../src/config/redis.service';
import { ConfigService } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;
  let mockConfigService: any;
  let mockRedisClient: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockRedisClient = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      on: jest.fn(),
      set: jest.fn(),
      setEx: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      hSet: jest.fn(),
      hGet: jest.fn(),
      hGetAll: jest.fn(),
      hDel: jest.fn(),
    };

    // Mock createClient to return our mock client
    // (jest.mock must be hoisted; use spyOn instead)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const redis = require('redis');
    jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    // Ensure client exists for tests that call methods directly without onModuleInit()
    (service as any).client = mockRedisClient;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to Redis', async () => {
      mockConfigService.get.mockReturnValue('redis://localhost:6379');
      mockRedisClient.connect.mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
      expect(mockRedisClient.connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      mockConfigService.get.mockReturnValue('redis://localhost:6379');
      mockRedisClient.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });

    it('should set up error handler', async () => {
      mockConfigService.get.mockReturnValue('redis://localhost:6379');
      mockRedisClient.connect.mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from Redis', async () => {
      mockRedisClient.disconnect.mockResolvedValue(undefined);

      await service.onModuleDestroy();

      expect(mockRedisClient.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnection errors', async () => {
      mockRedisClient.disconnect.mockRejectedValue(new Error('Disconnection failed'));

      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnection failed');
    });

    it('should handle missing client', async () => {
      // @ts-ignore
      service['client'] = null;

      await service.onModuleDestroy();

      expect(mockRedisClient.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('should return Redis client', () => {
      const client = service.getClient();

      expect(client).toBe(mockRedisClient);
    });
  });

  describe('set', () => {
    it('should set value without TTL', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('test-key', 'test-value');

      expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should set value with TTL', async () => {
      mockRedisClient.setEx.mockResolvedValue('OK');

      await service.set('test-key', 'test-value', 60);

      expect(mockRedisClient.setEx).toHaveBeenCalledWith('test-key', 60, 'test-value');
    });

    it('should handle errors', async () => {
      mockRedisClient.set.mockRejectedValue(new Error('Set failed'));

      await expect(service.set('test-key', 'test-value')).rejects.toThrow(
        'Set failed',
      );
    });
  });

  describe('get', () => {
    it('should get value', async () => {
      mockRedisClient.get.mockResolvedValue('test-value');

      const result = await service.get('test-key');

      expect(result).toBe('test-value');
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent key', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('non-existent-key');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Get failed'));

      await expect(service.get('test-key')).rejects.toThrow('Get failed');
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.del('test-key');

      expect(result).toBe(1);
      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should return 0 for non-existent key', async () => {
      mockRedisClient.del.mockResolvedValue(0);

      const result = await service.del('non-existent-key');

      expect(result).toBe(0);
    });

    it('should handle errors', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Del failed'));

      await expect(service.del('test-key')).rejects.toThrow('Del failed');
    });
  });

  describe('exists', () => {
    it('should return true for existing key', async () => {
      mockRedisClient.exists.mockResolvedValue(1);

      const result = await service.exists('test-key');

      expect(result).toBe(true);
      expect(mockRedisClient.exists).toHaveBeenCalledWith('test-key');
    });

    it('should return false for non-existent key', async () => {
      mockRedisClient.exists.mockResolvedValue(0);

      const result = await service.exists('non-existent-key');

      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      mockRedisClient.exists.mockRejectedValue(new Error('Exists failed'));

      await expect(service.exists('test-key')).rejects.toThrow('Exists failed');
    });
  });

  describe('hSet', () => {
    it('should set hash field', async () => {
      mockRedisClient.hSet.mockResolvedValue(1);

      const result = await service.hSet('test-hash', 'field1', 'value1');

      expect(result).toBe(1);
      expect(mockRedisClient.hSet).toHaveBeenCalledWith('test-hash', 'field1', 'value1');
    });

    it('should handle errors', async () => {
      mockRedisClient.hSet.mockRejectedValue(new Error('HSet failed'));

      await expect(
        service.hSet('test-hash', 'field1', 'value1'),
      ).rejects.toThrow('HSet failed');
    });
  });

  describe('hGet', () => {
    it('should get hash field', async () => {
      mockRedisClient.hGet.mockResolvedValue('value1');

      const result = await service.hGet('test-hash', 'field1');

      expect(result).toBe('value1');
      expect(mockRedisClient.hGet).toHaveBeenCalledWith('test-hash', 'field1');
    });

    it('should return undefined for non-existent field', async () => {
      mockRedisClient.hGet.mockResolvedValue(undefined);

      const result = await service.hGet('test-hash', 'non-existent-field');

      expect(result).toBeUndefined();
    });

    it('should handle errors', async () => {
      mockRedisClient.hGet.mockRejectedValue(new Error('HGet failed'));

      await expect(service.hGet('test-hash', 'field1')).rejects.toThrow(
        'HGet failed',
      );
    });
  });

  describe('hGetAll', () => {
    it('should get all hash fields', async () => {
      mockRedisClient.hGetAll.mockResolvedValue({
        field1: 'value1',
        field2: 'value2',
      });

      const result = await service.hGetAll('test-hash');

      expect(result).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
      expect(mockRedisClient.hGetAll).toHaveBeenCalledWith('test-hash');
    });

    it('should return empty object for non-existent hash', async () => {
      mockRedisClient.hGetAll.mockResolvedValue({});

      const result = await service.hGetAll('non-existent-hash');

      expect(result).toEqual({});
    });

    it('should handle errors', async () => {
      mockRedisClient.hGetAll.mockRejectedValue(new Error('HGetAll failed'));

      await expect(service.hGetAll('test-hash')).rejects.toThrow(
        'HGetAll failed',
      );
    });
  });

  describe('hDel', () => {
    it('should delete hash field', async () => {
      mockRedisClient.hDel.mockResolvedValue(1);

      const result = await service.hDel('test-hash', 'field1');

      expect(result).toBe(1);
      expect(mockRedisClient.hDel).toHaveBeenCalledWith('test-hash', 'field1');
    });

    it('should return 0 for non-existent field', async () => {
      mockRedisClient.hDel.mockResolvedValue(0);

      const result = await service.hDel('test-hash', 'non-existent-field');

      expect(result).toBe(0);
    });

    it('should handle errors', async () => {
      mockRedisClient.hDel.mockRejectedValue(new Error('HDel failed'));

      await expect(service.hDel('test-hash', 'field1')).rejects.toThrow(
        'HDel failed',
      );
    });
  });
});