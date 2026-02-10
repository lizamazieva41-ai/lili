import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { QueueService } from '../../config/queue.service';

@Injectable()
export class BullMQHealthIndicator extends HealthIndicator {
  constructor(private readonly queueService: QueueService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.queueService.isHealthy();
      
      if (isHealthy) {
        return this.getStatus(key, true, {
          message: 'Queue service is healthy',
        });
      } else {
        throw new HealthCheckError('Queue service is unhealthy', this.getStatus(key, false));
      }
    } catch (error) {
      throw new HealthCheckError(
        'Queue health check failed',
        this.getStatus(key, false, {
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }
}
