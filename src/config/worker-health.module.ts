import { Module } from '@nestjs/common';
import { WorkerHealthController } from './worker-health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database.module';
import { RedisModule } from './redis.module';
import { QueueModule } from './queue.module';
import { BullMQHealthIndicator } from '../common/health/bullmq-health.indicator';

@Module({
  imports: [
    TerminusModule,
    DatabaseModule,
    RedisModule.forRoot(),
    QueueModule,
  ],
  controllers: [WorkerHealthController],
  providers: [BullMQHealthIndicator],
})
export class WorkerHealthModule {}
