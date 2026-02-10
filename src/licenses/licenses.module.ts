import { Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { DatabaseModule } from '../config/database.module';
import { LicensingService } from '../licensing/licensing.service';
import { FeatureGatingService } from '../licensing/feature-gating.service';
import { ApiKeyService } from '../licensing/api-key.service';
import { RedisModule } from '../config/redis.module';
import { CommonModule } from '../common/services/logger.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, RedisModule, CommonModule, AuthModule],
  controllers: [LicensesController],
  providers: [
    LicensesService,
    LicensingService,
    FeatureGatingService,
    ApiKeyService,
  ],
  exports: [LicensesService],
})
export class LicensesModule {}
