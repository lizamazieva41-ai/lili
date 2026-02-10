import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from '../../../src/jobs/jobs.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { QueueService } from '../../../src/config/queue.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomLoggerService } from '../../../src/common/services/logger.service';
import { MetricsService } from '../../../src/common/services/metrics.service';

describe('JobsService', () => {
  let service: JobsService;
  let mockPrismaService: any;
  let mockQueueService: any;
  let mockCustomLoggerService: any;
  let mockMetricsService: any;

  beforeEach(async () => {
    mockPrismaService = {
      job: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      jobLog: {
        findMany: jest.fn(),
      },
    };

    mockQueueService = {
      getQueue: jest.fn(),
      addJob: jest.fn(),
      getJob: jest.fn(),
      getQueueStats: jest.fn(),
      getQueueNames: jest.fn(),
    };

    mockCustomLoggerService = {
      logJob: jest.fn(),
    };

    mockMetricsService = {
      incrementJobsEnqueued: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: QueueService, useValue: mockQueueService },
        { provide: CustomLoggerService, useValue: mockCustomLoggerService },
        { provide: MetricsService, useValue: mockMetricsService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const createJobDto = {
        type: 'MESSAGE_SEND',
        queue: 'messages',
        data: {
          messageId: 'message-1',
          accountId: 'account-1',
        },
        priority: 1,
        maxAttempts: 3,
        delay: 1000,
        timeout: 30000,
        tags: ['urgent'],
        metadata: { source: 'api' },
      };

      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        priority: 1,
        data: createJobDto.data,
        status: 'PENDING',
        maxAttempts: 3,
        delay: 1000,
        timeout: 30000,
        scheduledAt: expect.any(Date),
        tags: ['urgent'],
        metadata: { source: 'api' },
        userId: 'user-1',
      };

      const mockQueue = {
        add: jest.fn(),
      };

      const mockBullMQJob = {
        id: 'job-1',
      };

      mockQueueService.getQueue.mockReturnValue(mockQueue);
      mockPrismaService.job.create.mockResolvedValue(mockJob);
      mockQueueService.addJob.mockResolvedValue(mockBullMQJob);

      const result = await service.create(createJobDto, 'user-1');

      expect(result).toEqual(mockJob);

      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: {
          type: 'MESSAGE_SEND',
          queue: 'messages',
          priority: 1,
          data: createJobDto.data,
          status: 'PENDING',
          maxAttempts: 3,
          delay: 1000,
          timeout: 30000,
          scheduledAt: expect.any(Date),
          tags: ['urgent'],
          metadata: { source: 'api' },
          userId: 'user-1',
        },
      });

      expect(mockQueueService.addJob).toHaveBeenCalledWith(
        'messages',
        'MESSAGE_SEND',
        {
          jobId: 'job-1',
          ...createJobDto.data,
        },
        {
          jobId: 'job-1',
          delay: 1000,
          priority: 1,
          attempts: 3,
        },
      );
    });

    it('should use default queue if not provided', async () => {
      const createJobDto = {
        type: 'MESSAGE_SEND',
        data: {
          messageId: 'message-1',
        },
      };

      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'default',
        data: createJobDto.data,
        status: 'PENDING',
        maxAttempts: 3,
        priority: 0,
        delay: null,
        timeout: null,
        scheduledAt: null,
        tags: [],
        userId: 'user-1',
      };

      const mockQueue = {
        add: jest.fn(),
      };

      const mockBullMQJob = {
        id: 'job-1',
      };

      mockQueueService.getQueue.mockReturnValue(mockQueue);
      mockPrismaService.job.create.mockResolvedValue(mockJob);
      mockQueueService.addJob.mockResolvedValue(mockBullMQJob);

      const result = await service.create(createJobDto, 'user-1');

      expect(result.queue).toBe('default');
      expect(result.priority).toBe(0);
      expect(result.maxAttempts).toBe(3);
    });

    it('should throw BadRequestException for invalid job type', async () => {
      const createJobDto = {
        type: 'INVALID_TYPE',
        data: {},
      };

      await expect(service.create(createJobDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create job without userId', async () => {
      const createJobDto = {
        type: 'MESSAGE_SEND',
        data: {
          messageId: 'message-1',
        },
      };

      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'default',
        data: createJobDto.data,
        status: 'PENDING',
        maxAttempts: 3,
        priority: 0,
        delay: null,
        timeout: null,
        scheduledAt: null,
        tags: [],
        userId: null,
      };

      const mockQueue = {
        add: jest.fn(),
      };

      const mockBullMQJob = {
        id: 'job-1',
      };

      mockQueueService.getQueue.mockReturnValue(mockQueue);
      mockPrismaService.job.create.mockResolvedValue(mockJob);
      mockQueueService.addJob.mockResolvedValue(mockBullMQJob);

      const result = await service.create(createJobDto);

      expect(result.userId).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated jobs', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          type: 'MESSAGE_SEND',
          queue: 'messages',
          status: 'PENDING',
          priority: 1,
          data: { messageId: 'message-1' },
        },
        {
          id: 'job-2',
          type: 'CAMPAIGN_EXECUTE',
          queue: 'campaigns',
          status: 'COMPLETED',
          priority: 0,
          data: { campaignId: 'campaign-1' },
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result).toEqual({
        jobs: mockJobs,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          type: 'MESSAGE_SEND',
          queue: 'messages',
          status: 'PENDING',
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll({ status: 'pending' });

      expect(result.jobs).toHaveLength(1);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PENDING' },
        }),
      );
    });

    it('should filter by type', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          type: 'MESSAGE_SEND',
          queue: 'messages',
          status: 'PENDING',
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll({ type: 'message_send' });

      expect(result.jobs).toHaveLength(1);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'MESSAGE_SEND' },
        }),
      );
    });

    it('should filter by queue', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          type: 'MESSAGE_SEND',
          queue: 'messages',
          status: 'PENDING',
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll({ queue: 'messages' });

      expect(result.jobs).toHaveLength(1);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { queue: 'messages' },
        }),
      );
    });

    it('should filter by userId', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          type: 'MESSAGE_SEND',
          queue: 'messages',
          status: 'PENDING',
          userId: 'user-1',
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll({ userId: 'user-1' });

      expect(result.jobs).toHaveLength(1);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockJobs = Array(100).fill({
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
      });

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
      mockPrismaService.job.count.mockResolvedValue(100);

      const result = await service.findAll({ limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });
  });

  describe('findOne', () => {
    it('should return job by ID', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
        data: { messageId: 'message-1' },
        executions: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findOne('job-1');

      expect(result).toEqual(mockJob);

      expect(mockPrismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        include: {
          executions: {
            orderBy: { startedAt: 'desc' },
            take: 5,
          },
        },
      });
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-job')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should cancel/delete a job', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
        data: { messageId: 'message-1' },
        executions: [],
      };

      const mockBullMQJob = {
        remove: jest.fn(),
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockQueueService.getJob.mockResolvedValue(mockBullMQJob);
      mockPrismaService.job.update.mockResolvedValue({
        ...mockJob,
        status: 'FAILED',
        error: 'Job cancelled by user',
      });

      await service.remove('job-1');

      expect(mockQueueService.getJob).toHaveBeenCalledWith('messages', 'job-1');
      expect(mockBullMQJob.remove).toHaveBeenCalled();

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: {
          status: 'FAILED',
          error: 'Job cancelled by user',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should handle job not found in queue', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
        data: { messageId: 'message-1' },
        executions: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockQueueService.getJob.mockResolvedValue(null);
      mockPrismaService.job.update.mockResolvedValue({
        ...mockJob,
        status: 'FAILED',
        error: 'Job cancelled by user',
      });

      await service.remove('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-job')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle queue error gracefully', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
        data: { messageId: 'message-1' },
        executions: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockQueueService.getJob.mockImplementation(() => {
        throw new Error('Queue error');
      });
      mockPrismaService.job.update.mockResolvedValue({
        ...mockJob,
        status: 'FAILED',
        error: 'Job cancelled by user',
      });

      await service.remove('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalled();
    });
  });

  describe('retry', () => {
    it('should retry a failed job', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'FAILED',
        data: { messageId: 'message-1' },
        priority: 1,
        maxAttempts: 3,
        executions: [],
      };

      const mockBullMQJob = {
        id: 'job-1',
      };

      const mockUpdatedJob = {
        ...mockJob,
        status: 'PENDING',
        attempts: 0,
        error: null,
        errorMessage: null,
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockQueueService.addJob.mockResolvedValue(mockBullMQJob);
      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.retry('job-1');

      expect(result).toEqual(mockUpdatedJob);

      expect(mockQueueService.addJob).toHaveBeenCalledWith(
        'messages',
        'MESSAGE_SEND',
        mockJob.data,
        {
          jobId: 'job-1',
          priority: 1,
          attempts: 3,
        },
      );

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: {
          status: 'PENDING',
          attempts: 0,
          error: null,
          errorMessage: null,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.retry('invalid-job')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if job is not failed', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'PENDING',
        data: { messageId: 'message-1' },
        executions: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      await expect(service.retry('job-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLogs', () => {
    it('should return job execution logs', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'COMPLETED',
        data: { messageId: 'message-1' },
        executions: [],
      };

      const mockLogs = [
        {
          id: 'log-1',
          jobId: 'job-1',
          message: 'Job started',
          level: 'INFO',
          createdAt: new Date(),
        },
        {
          id: 'log-2',
          jobId: 'job-1',
          message: 'Job completed',
          level: 'INFO',
          createdAt: new Date(),
        },
      ];

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.jobLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getLogs('job-1');

      expect(result).toEqual(mockLogs);

      expect(mockPrismaService.jobLog.findMany).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.getLogs('invalid-job')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return empty array if no logs found', async () => {
      const mockJob = {
        id: 'job-1',
        type: 'MESSAGE_SEND',
        queue: 'messages',
        status: 'COMPLETED',
        data: { messageId: 'message-1' },
        executions: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.jobLog.findMany.mockResolvedValue([]);

      const result = await service.getLogs('job-1');

      expect(result).toHaveLength(0);
    });
  });

  describe('getQueueStatus', () => {
    it('should return status for specific queue', async () => {
      const mockQueueStats = {
        waiting: 5,
        active: 2,
        completed: 10,
        failed: 1,
      };

      mockQueueService.getQueueStats.mockResolvedValue(mockQueueStats);

      const result = await service.getQueueStatus('messages');

      expect(result).toEqual({
        name: 'messages',
        ...mockQueueStats,
      });

      expect(mockQueueService.getQueueStats).toHaveBeenCalledWith('messages');
    });

    it('should return status for all queues', async () => {
      const mockQueueNames = ['messages', 'campaigns', 'default'];

      const mockQueueStats = [
        { waiting: 5, active: 2, completed: 10, failed: 1 },
        { waiting: 2, active: 1, completed: 5, failed: 0 },
        { waiting: 10, active: 3, completed: 20, failed: 2 },
      ];

      mockQueueService.getQueueNames.mockReturnValue(mockQueueNames);
      mockQueueService.getQueueStats
        .mockResolvedValueOnce(mockQueueStats[0])
        .mockResolvedValueOnce(mockQueueStats[1])
        .mockResolvedValueOnce(mockQueueStats[2]);

      const result = await service.getQueueStatus();

      expect(result).toEqual([
        { name: 'messages', ...mockQueueStats[0] },
        { name: 'campaigns', ...mockQueueStats[1] },
        { name: 'default', ...mockQueueStats[2] },
      ]);

      expect(mockQueueService.getQueueNames).toHaveBeenCalled();
      expect(mockQueueService.getQueueStats).toHaveBeenCalledTimes(3);
    });

    it('should handle empty queue list', async () => {
      mockQueueService.getQueueNames.mockReturnValue([]);

      const result = await service.getQueueStatus();

      expect(result).toEqual([]);
    });
  });
});