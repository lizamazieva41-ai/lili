import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { QueueService } from './queue.service';
import { BullMQHealthIndicator } from '../common/health/bullmq-health.indicator';

/**
 * Health check controller for worker processes
 * 
 * This provides health endpoints specifically for worker processes
 * to monitor queue processing health.
 */
@Controller('worker/health')
export class WorkerHealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private queueService: QueueService,
    private bullmqHealth: BullMQHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Memory check
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024), // 500MB
      () => this.memory.checkRSS('memory_rss', 1000 * 1024 * 1024), // 1GB

      // Disk check
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),

      // Queue health
      () => this.bullmqHealth.isHealthy('queue'),
    ]);
  }

  @Get('liveness')
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('readiness')
  async readiness() {
    // Check if queues are accessible
    const isQueueReady = await this.queueService.isHealthy();
    return {
      status: isQueueReady ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      queue: isQueueReady ? 'connected' : 'disconnected',
    };
  }
}
