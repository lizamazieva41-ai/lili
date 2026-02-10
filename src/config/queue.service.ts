import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, QueueOptions, Worker, WorkerOptions, Job } from 'bullmq';
import { RedisService } from './redis.service';

export interface QueueConfig {
  name: string;
  defaultJobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
  };
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private connection: any;

  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Configure Redis connection for BullMQ
    // BullMQ uses ioredis, so we need to provide connection options
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    if (redisUrl) {
      // Parse Redis URL if provided
      const url = new URL(redisUrl);
      this.connection = {
        host: url.hostname,
        port: parseInt(url.port) || 6379,
        password: url.password || undefined,
      };
    } else {
      // Fallback to individual config
      this.connection = {
        host: this.configService.get<string>('REDIS_HOST') || 'localhost',
        port: this.configService.get<number>('REDIS_PORT') || 6379,
        password: this.configService.get<string>('REDIS_PASSWORD'),
      };
    }

    this.logger.log('✅ Queue service initialized');
  }

  async onModuleDestroy() {
    // Close all queues (best-effort)
    for (const queue of this.queues.values()) {
      try {
        await queue.close();
      } catch (err) {
        this.logger.error('Error closing queue', err as any);
      }
    }

    // Close all workers (best-effort)
    for (const worker of this.workers.values()) {
      try {
        await worker.close();
      } catch (err) {
        this.logger.error('Error closing worker', err as any);
      }
    }

    this.logger.log('Queue service destroyed');
  }

  /**
   * Create or get a queue
   */
  getQueue(name: string, config?: QueueConfig): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queueOptions: QueueOptions = {
      connection: this.connection,
      defaultJobOptions: {
        attempts: config?.defaultJobOptions?.attempts || 3,
        backoff: config?.defaultJobOptions?.backoff || {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: config?.defaultJobOptions?.removeOnComplete ?? {
          age: 24 * 3600, // Keep completed jobs for 24 hours
          count: 1000, // Keep last 1000 completed jobs
        },
        removeOnFail: config?.defaultJobOptions?.removeOnFail ?? {
          age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
      },
    };

    const queue = new Queue(name, queueOptions);
    this.queues.set(name, queue);

    this.logger.log(`Queue created: ${name}`);
    return queue;
  }

  /**
   * Create a worker for a queue
   */
  createWorker<T = any>(
    queueName: string,
    processor: (job: Job<T>) => Promise<any>,
    options?: WorkerOptions,
  ): Worker {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName)!;
    }

    const workerOptions: WorkerOptions = {
      connection: this.connection,
      concurrency: options?.concurrency || 5,
      limiter: options?.limiter || {
        max: 100,
        duration: 1000,
      },
      ...options,
    };

    const worker = new Worker<T>(queueName, processor, workerOptions);

    // Event handlers
    worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed in queue ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed in queue ${queueName}: ${err.message}`, err.stack);
    });

    worker.on('error', (err) => {
      this.logger.error(`Worker error in queue ${queueName}: ${err.message}`, err.stack);
    });

    this.workers.set(queueName, worker);
    this.logger.log(`Worker created for queue: ${queueName}`);

    return worker;
  }

  /**
   * Add a job to a queue
   */
  async addJob<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: {
      delay?: number;
      priority?: number;
      jobId?: string;
      repeat?: {
        pattern?: string;
        every?: number;
      };
    },
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    return await queue.add(jobName, data, options);
  }

  /**
   * Get job by ID
   */
  async getJob(queueName: string, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    return (await queue.getJob(jobId)) ?? null;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
  }> {
    const queue = this.getQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      // BullMQ typings vary by version; paused count isn't guaranteed.
      paused: 0,
    };
  }

  /**
   * Get all queue names
   */
  getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }

  /**
   * Remove a queue
   */
  async removeQueue(name: string): Promise<void> {
    const queue = this.queues.get(name);
    if (queue) {
      try {
        await queue.close();
      } catch (err) {
        this.logger.error(`Error closing queue ${name}`, err as any);
      }
      this.queues.delete(name);
    }

    const worker = this.workers.get(name);
    if (worker) {
      try {
        await worker.close();
      } catch (err) {
        this.logger.error(`Error closing worker ${name}`, err as any);
      }
      this.workers.delete(name);
    }

    this.logger.log(`Queue removed: ${name}`);
  }

  /**
   * Check if queue service is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Check Redis connection
      const redis = this.redisService.getClient();
      await redis.ping();
      
      // Check if at least one queue is accessible
      if (this.queues.size === 0) {
        return false;
      }

      // Try to get queue info from first queue
      const firstQueue = Array.from(this.queues.values())[0];
      await firstQueue.getWaitingCount();
      
      return true;
    } catch (error) {
      this.logger.warn('Queue health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}
