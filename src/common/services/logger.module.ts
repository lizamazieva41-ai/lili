import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './logger.service';
import { HttpLoggingMiddleware } from '../middleware/http-logging.middleware';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { DataRetentionService } from './data-retention.service';
import { BackupService } from './backup.service';
import { CacheService } from './cache.service';
import { CsrfService } from './csrf.service';
import { EncryptionService } from './encryption.service';
import { KeyRotationService } from './key-rotation.service';
import { RedisModule } from '../../config/redis.module';
import { DatabaseModule } from '../../config/database.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    RedisModule.forRoot(),
    DatabaseModule,
  ],
  providers: [
    CustomLoggerService,
    HttpLoggingMiddleware,
    MetricsService,
    DataRetentionService,
    BackupService,
    CacheService,
    CsrfService,
    EncryptionService,
    KeyRotationService,
  ],
  controllers: [MetricsController],
  exports: [
    CustomLoggerService,
    HttpLoggingMiddleware,
    MetricsService,
    DataRetentionService,
    BackupService,
    CacheService,
    CsrfService,
    EncryptionService,
    KeyRotationService,
  ],
})
export class CommonModule {}