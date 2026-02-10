import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../../../src/config/queue.service';
import { RedisService } from '../../../src/config/redis.service';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';

jest.mock('bullmq', () => ({
  Queue: jest.fn(),
  Worker: jest.fn(),
}));

describe('QueueService', () => {
  let service: QueueService;
  let mockRedisService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockRedisService = {
      getClient: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize with Redis URL', async () => {
      mockConfigService.get.mockReturnValue('redis://localhost:6379');

      await service.onModuleInit();

      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
    });

    it('should initialize with individual Redis config', async () => {
      mockConfigService.get
        .mockReturnValueOnce(undefined) // REDIS_URL
        .mockReturnValueOnce('localhost') // REDIS_HOST
        .mockReturnValueOnce(6379) // REDIS_PORT
        .mockReturnValueOnce('password'); // REDIS_PASSWORD

      await service.onModuleInit();

      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_HOST');
      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_PORT');
      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_PASSWORD');
    });

    it('should handle missing Redis config', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await service.onModuleInit();

      expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
    });
  });

  describe('onModuleDestroy', () => {
    it('should close all queues and workers', async () => {
      const mockQueue1 = {
        close: jest.fn().mockResolvedValue(undefined),
      };
      const mockQueue2 = {
        close: jest.fn().mockResolvedValue(undefined),
      };
      const mockWorker1 = {
        close: jest.fn().mockResolvedValue(undefined),
      };
      const mockWorker2 = {
        close: jest.fn().mockResolvedValue(undefined),
      };

      // @ts-ignore
      service['queues'] = new Map([
        ['queue1', mockQueue1],
        ['queue2', mockQueue2],
      ]);
      // @ts-ignore
      service['workers'] = new Map([
        ['worker1', mockWorker1],
        ['worker2', mockWorker2],
      ]);

      await service.onModuleDestroy();

      expect(mockQueue1.close).toHaveBeenCalled();
      expect(mockQueue2.close).toHaveBeenCalled();
      expect(mockWorker1.close).toHaveBeenCalled();
      expect(mockWorker2.close).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const mockQueue = {
        close: jest.fn().mockRejectedValue(new Error('Close failed')),
      };

      // @ts-ignore
      service['queues'] = new Map([['queue1', mockQueue]]);
      // @ts-ignore
      service['workers'] = new Map();

      await service.onModuleDestroy();

      expect(mockQueue.close).toHaveBeenCalled();
    });
  });

  describe('getQueue', () => {
    it('should create new queue', () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      (Queue as unknown as jest.Mock).mockImplementation(() => mockQueue);

      const result = service.getQueue('test-queue');

      expect(result).toBe(mockQueue);
      expect(result).toBeDefined();
    });

    it('should return existing queue', () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const result = service.getQueue('test-queue');

      expect(result).toBe(mockQueue);
    });

    it('should create queue with custom config', () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      (Queue as unknown as jest.Mock).mockImplementation(() => mockQueue);

      const config = {
        name: 'test-queue',
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'fixed' as const,
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      };

      const result = service.getQueue('test-queue', config);

      expect(result).toBe(mockQueue);
    });
  });

  describe('createWorker', () => {
    it('should create new worker', () => {
      const mockWorker = {
        on: jest.fn(),
        close: jest.fn(),
      };

      (Worker as unknown as jest.Mock).mockImplementation(() => mockWorker);

      const processor = jest.fn();
      const result = service.createWorker('test-queue', processor);

      expect(result).toBe(mockWorker);
      expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function));
      expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function));
      expect(mockWorker.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should return existing worker', () => {
      const mockWorker = {
        on: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['workers'] = new Map([['test-queue', mockWorker]]);

      const processor = jest.fn();
      const result = service.createWorker('test-queue', processor);

      expect(result).toBe(mockWorker);
    });

    it('should create worker with custom options', () => {
      const mockWorker = {
        on: jest.fn(),
        close: jest.fn(),
      };

      (Worker as unknown as jest.Mock).mockImplementation(() => mockWorker);

      const processor = jest.fn();
      const options = {
        concurrency: 10,
        limiter: {
          max: 200,
          duration: 5000,
        },
      };

      const result = service.createWorker('test-queue', processor, options);

      expect(result).toBe(mockWorker);
    });
  });

  describe('addJob', () => {
    it('should add job to queue', async () => {
      const mockQueue = {
        add: jest.fn().mockResolvedValue({ id: 'job-1' }),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const result = await service.addJob('test-queue', 'test-job', { data: 'test' });

      expect(result).toEqual({ id: 'job-1' });
      expect(mockQueue.add).toHaveBeenCalledWith('test-job', { data: 'test' }, undefined);
    });

    it('should add job with options', async () => {
      const mockQueue = {
        add: jest.fn().mockResolvedValue({ id: 'job-1' }),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const options = {
        delay: 1000,
        priority: 1,
        jobId: 'custom-job-id',
      };

      const result = await service.addJob('test-queue', 'test-job', { data: 'test' }, options);

      expect(result).toEqual({ id: 'job-1' });
      expect(mockQueue.add).toHaveBeenCalledWith('test-job', { data: 'test' }, options);
    });

    it('should handle errors', async () => {
      const mockQueue = {
        add: jest.fn().mockRejectedValue(new Error('Add job failed')),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      await expect(
        service.addJob('test-queue', 'test-job', { data: 'test' }),
      ).rejects.toThrow('Add job failed');
    });
  });

  describe('getJob', () => {
    it('should get job from queue', async () => {
      const mockJob = {
        id: 'job-1',
        name: 'test-job',
        data: { data: 'test' },
      };

      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn().mockResolvedValue(mockJob),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const result = await service.getJob('test-queue', 'job-1');

      expect(result).toEqual(mockJob);
      expect(mockQueue.getJob).toHaveBeenCalledWith('job-1');
    });

    it('should return null for non-existent job', async () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn().mockResolvedValue(null),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const result = await service.getJob('test-queue', 'non-existent-job');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn().mockRejectedValue(new Error('Get job failed')),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      await expect(service.getJob('test-queue', 'job-1')).rejects.toThrow(
        'Get job failed',
      );
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn().mockResolvedValue(5),
        getActiveCount: jest.fn().mockResolvedValue(2),
        getCompletedCount: jest.fn().mockResolvedValue(10),
        getFailedCount: jest.fn().mockResolvedValue(1),
        getDelayedCount: jest.fn().mockResolvedValue(3),
        getPausedCount: jest.fn().mockResolvedValue(0),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      const result = await service.getQueueStats('test-queue');

      expect(result).toEqual({
        waiting: 5,
        active: 2,
        completed: 10,
        failed: 1,
        delayed: 3,
        paused: 0,
      });

      expect(mockQueue.getWaitingCount).toHaveBeenCalled();
      expect(mockQueue.getActiveCount).toHaveBeenCalled();
      expect(mockQueue.getCompletedCount).toHaveBeenCalled();
      expect(mockQueue.getFailedCount).toHaveBeenCalled();
      expect(mockQueue.getDelayedCount).toHaveBeenCalled();
      // paused count is not guaranteed by BullMQ typings and is returned as 0
    });

    it('should handle errors', async () => {
      const mockQueue = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn().mockRejectedValue(new Error('Get stats failed')),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);

      await expect(service.getQueueStats('test-queue')).rejects.toThrow(
        'Get stats failed',
      );
    });
  });

  describe('getQueueNames', () => {
    it('should return all queue names', () => {
      const mockQueue1 = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      const mockQueue2 = {
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
        close: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([
        ['queue1', mockQueue1],
        ['queue2', mockQueue2],
      ]);

      const result = service.getQueueNames();

      expect(result).toEqual(['queue1', 'queue2']);
    });

    it('should return empty array if no queues', () => {
      // @ts-ignore
      service['queues'] = new Map();

      const result = service.getQueueNames();

      expect(result).toHaveLength(0);
    });
  });

  describe('removeQueue', () => {
    it('should remove queue and worker', async () => {
      const mockQueue = {
        close: jest.fn().mockResolvedValue(undefined),
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
      };

      const mockWorker = {
        close: jest.fn().mockResolvedValue(undefined),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);
      // @ts-ignore
      service['workers'] = new Map([['test-queue', mockWorker]]);

      await service.removeQueue('test-queue');

      expect(mockQueue.close).toHaveBeenCalled();
      expect(mockWorker.close).toHaveBeenCalled();
      expect(service.getQueueNames()).not.toContain('test-queue');
    });

    it('should handle non-existent queue', async () => {
      // @ts-ignore
      service['queues'] = new Map();
      // @ts-ignore
      service['workers'] = new Map();

      await service.removeQueue('non-existent-queue');

      expect(service.getQueueNames()).toHaveLength(0);
    });

    it('should handle errors', async () => {
      const mockQueue = {
        close: jest.fn().mockRejectedValue(new Error('Close failed')),
        add: jest.fn(),
        getJob: jest.fn(),
        getWaitingCount: jest.fn(),
        getActiveCount: jest.fn(),
        getCompletedCount: jest.fn(),
        getFailedCount: jest.fn(),
        getDelayedCount: jest.fn(),
        getPausedCount: jest.fn(),
      };

      // @ts-ignore
      service['queues'] = new Map([['test-queue', mockQueue]]);
      // @ts-ignore
      service['workers'] = new Map();

      await service.removeQueue('test-queue');

      expect(mockQueue.close).toHaveBeenCalled();
    });
  });
});