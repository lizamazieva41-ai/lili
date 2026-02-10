import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { QueueService } from '../config/queue.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobStatus, JobType, Prisma } from '@prisma/client';
import { Job as BullMQJob } from 'bullmq';
import { CustomLoggerService } from '../common/services/logger.service';
import { MetricsService } from '../common/services/metrics.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
    @Inject(CustomLoggerService)
    private readonly customLogger: CustomLoggerService,
    @Inject(MetricsService)
    private readonly metrics: MetricsService,
  ) {}

  /**
   * Create a new job
   */
  async create(createJobDto: CreateJobDto, userId?: string): Promise<Job> {
    const startTime = Date.now();
    try {
      this.customLogger.logJob('job_create_start', createJobDto.type, 'STARTED');

      // Validate job type
      const validTypes = Object.values(JobType);
      if (!validTypes.includes(createJobDto.type as JobType)) {
        throw new BadRequestException(`Invalid job type: ${createJobDto.type}`);
      }

      const queueName = createJobDto.queue || 'default';
      const queue = this.queueService.getQueue(queueName);

      // Create job in database first
      const job = await this.prisma.job.create({
        data: {
          type: createJobDto.type as JobType,
          queue: queueName,
          priority: createJobDto.priority || 0,
          data: createJobDto.data,
          status: JobStatus.PENDING,
          maxAttempts: createJobDto.maxAttempts || 3,
          delay: createJobDto.delay,
          timeout: createJobDto.timeout,
          cronExpression: createJobDto.cronExpression,
          scheduledAt: createJobDto.delay ? new Date(Date.now() + createJobDto.delay) : null,
          tags: createJobDto.tags || [],
          metadata: createJobDto.metadata,
          userId,
        },
      });

      const duration = Date.now() - startTime;
      this.customLogger.logJob(job.id, createJobDto.type, 'CREATED', duration);

      // Record metrics
      this.metrics.incrementJobsEnqueued(queueName, createJobDto.type);

      // Add job to BullMQ queue
      const bullMQJob = await this.queueService.addJob(
        queueName,
        createJobDto.type,
        {
          jobId: job.id,
          ...createJobDto.data,
        },
        ({
          jobId: job.id,
          delay: createJobDto.delay,
          priority: createJobDto.priority || 0,
          attempts: createJobDto.maxAttempts || 3,
        } as any),
      );

      this.logger.log(`Job created: ${job.id} in queue ${queueName}`);
      return job;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error creating job: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get all jobs with filtering and pagination
   */
  async findAll(
    filters: {
      status?: string;
      type?: string;
      queue?: string;
      userId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ jobs: Job[]; pagination: any }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (filters.status) {
        where.status = filters.status.toUpperCase();
      }

      if (filters.type) {
        where.type = filters.type.toUpperCase();
      }

      if (filters.queue) {
        where.queue = filters.queue;
      }

      if (filters.userId) {
        where.userId = filters.userId;
      }

      const [jobs, total] = await Promise.all([
        this.prisma.job.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.job.count({ where }),
      ]);

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding jobs: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get job by ID
   */
  async findOne(id: string): Promise<Prisma.JobGetPayload<{ include: { executions: true } }>> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id },
        include: {
          executions: {
            orderBy: { startedAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!job) {
        throw new NotFoundException(`Job not found: ${id}`);
      }

      return job;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding job ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Cancel/delete a job
   */
  async remove(id: string): Promise<void> {
    try {
      const job = await this.findOne(id);

      // Remove from BullMQ queue if still pending/running
      if (job.status === JobStatus.PENDING || job.status === JobStatus.RUNNING) {
        try {
          const bullMQJob = await this.queueService.getJob(job.queue, id);
          if (bullMQJob) {
            await bullMQJob.remove();
          }
        } catch (error) {
          this.logger.warn(`Could not remove job from queue: ${(error as Error).message}`);
        }
      }

      // Update job status in database
      // Note: JobStatus doesn't have CANCELLED, so we'll mark as FAILED with a note
      await this.prisma.job.update({
        where: { id },
        data: {
          status: JobStatus.FAILED,
          error: 'Job cancelled by user',
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Job cancelled: ${id}`);
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error cancelling job ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Retry a failed job
   */
  async retry(id: string): Promise<Job> {
    try {
      const job = await this.findOne(id);

      if (job.status !== JobStatus.FAILED) {
        throw new BadRequestException(`Job ${id} is not in FAILED status`);
      }

      // Add job back to queue
      const bullMQJob = await this.queueService.addJob(
        job.queue,
        job.type,
        job.data as any,
        ({
          jobId: id,
          priority: job.priority,
          attempts: job.maxAttempts,
        } as any),
      );

      // Update job status
      const updated = await this.prisma.job.update({
        where: { id },
        data: {
          status: JobStatus.PENDING,
          attempts: 0,
          error: null,
          errorMessage: null,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Job retried: ${id}`);
      return updated;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error retrying job ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get job execution logs
   */
  async getLogs(id: string): Promise<any[]> {
    try {
      const job = await this.findOne(id);

      const logs = await this.prisma.jobLog.findMany({
        where: { jobId: id },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      return logs;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting logs for job ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get queue status
   */
  async getQueueStatus(queueName?: string): Promise<any> {
    try {
      if (queueName) {
        const stats = await this.queueService.getQueueStats(queueName);
        return {
          name: queueName,
          ...stats,
        };
      }

      // Get status for all queues
      const queueNames = this.queueService.getQueueNames();
      const allStats = await Promise.all(
        queueNames.map(async (name) => {
          const stats = await this.queueService.getQueueStats(name);
          return {
            name,
            ...stats,
          };
        }),
      );

      return allStats;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting queue status: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }
}
