import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { LicenseAnalyticsService } from './license-analytics.service';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { QueueAnalyticsService } from './queue-analytics.service';
import { SecurityAnalyticsService } from './security-analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    LicenseAnalyticsService,
    CampaignAnalyticsService,
    QueueAnalyticsService,
    SecurityAnalyticsService,
  ],
  exports: [
    AnalyticsService,
    LicenseAnalyticsService,
    CampaignAnalyticsService,
    QueueAnalyticsService,
    SecurityAnalyticsService,
  ],
})
export class AnalyticsModule {}