import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database.module';
import { RedisModule } from './redis.module';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    TerminusModule,
    DatabaseModule,
    RedisModule.forRoot(),
    QueueModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}