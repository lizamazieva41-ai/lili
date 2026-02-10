import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { QueueService } from './queue.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prismaService: PrismaService,
    private redisService: RedisService,
    private queueService: QueueService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check (DB + Redis)' })
  @ApiOkResponse({
    description: 'Health check result',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: { type: 'object' },
        error: { type: 'object' },
        details: { type: 'object' },
      },
    },
  })
  @HealthCheck()
  check() {
    const isTest = this.configService.get<string>('NODE_ENV') === 'test';

    return this.health.check([
      ...(isTest ? [] : [() => this.prismaHealth.pingCheck('database', this.prismaService)]),
      async () => {
        await this.redisService.getClient().ping();
        return { redis: { status: 'up' } };
      },
    ]);
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check (DB stats, queues, redis)' })
  @ApiOkResponse({
    description: 'Detailed health check result with DB/queue stats',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: { type: 'object' },
        error: { type: 'object' },
        details: { type: 'object' },
        database: { type: 'object' },
        queues: { type: 'object' },
      },
    },
  })
  @HealthCheck()
  async checkDetailed() {
    const isTest = this.configService.get<string>('NODE_ENV') === 'test';

    const basicHealth = await this.health.check([
      ...(isTest ? [] : [() => this.prismaHealth.pingCheck('database', this.prismaService)]),
      async () => {
        await this.redisService.getClient().ping();
        return { redis: { status: 'up' } };
      },
    ]);

    // Get database connection stats (skip in test env)
    const dbStats = isTest ? { connected: false, uptime: 0 } : await this.prismaService.getConnectionStats();
    const dbHealth = isTest ? { status: 'skipped', responseTime: 0 } : await this.prismaService.healthCheck();

    // Get queue statistics
    const queueStats: Record<string, any> = {};
    try {
      const queueNames = this.queueService.getQueueNames();
      for (const queueName of queueNames) {
        queueStats[queueName] = await this.queueService.getQueueStats(queueName);
      }
    } catch (error) {
      // Queue stats are optional, don't fail health check
      queueStats.error = 'Unable to fetch queue statistics';
    }

    return {
      ...basicHealth,
      database: {
        ...((basicHealth as any).database || {}),
        connection: dbStats,
        health: dbHealth,
      },
      queues: queueStats,
    };
  }

  @Get('worker')
  @ApiOperation({ summary: 'Worker process health check' })
  @ApiOkResponse({
    description: 'Worker health check result',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        worker: { type: 'object' },
        queues: { type: 'object' },
      },
    },
  })
  @HealthCheck()
  async checkWorker() {
    const isTest = this.configService.get<string>('NODE_ENV') === 'test';

    // Check queue service health (indicates worker connectivity)
    let queueHealthy = false;
    let queueError: string | undefined;
    try {
      queueHealthy = await this.queueService.isHealthy();
    } catch (error) {
      queueError = error instanceof Error ? error.message : String(error);
    }

    // Get queue statistics to infer worker activity
    const queueStats: Record<string, any> = {};
    let totalWaiting = 0;
    let totalActive = 0;
    let totalFailed = 0;

    try {
      const queueNames = this.queueService.getQueueNames();
      for (const queueName of queueNames) {
        const stats = await this.queueService.getQueueStats(queueName);
        queueStats[queueName] = stats;
        totalWaiting += stats.waiting || 0;
        totalActive += stats.active || 0;
        totalFailed += stats.failed || 0;
      }
    } catch (error) {
      queueStats.error = 'Unable to fetch queue statistics';
    }

    // Worker is considered healthy if:
    // 1. Queue service is accessible
    // 2. Queues exist and are accessible
    // 3. No excessive backlog (optional check)
    const workerHealthy = queueHealthy && Object.keys(queueStats).length > 0;

    // Check for excessive backlog (warning, not failure)
    const hasBacklog = totalWaiting > 1000; // Configurable threshold

    return {
      status: workerHealthy ? 'ok' : 'error',
      worker: {
        healthy: workerHealthy,
        queueServiceConnected: queueHealthy,
        error: queueError,
        queuesAccessible: Object.keys(queueStats).length,
      },
      queues: queueStats,
      metrics: {
        totalWaiting,
        totalActive,
        totalFailed,
        hasBacklog,
      },
      timestamp: new Date().toISOString(),
    };
  }
}