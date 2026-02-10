import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { QueuesController } from './queues.controller';
import { JobsService } from './jobs.service';
import { DatabaseModule } from '../config/database.module';
import { QueueModule } from '../config/queue.module';
import { CommonModule } from '../common/services/logger.module';
import { AuthModule } from '../auth/auth.module';
import { TdlibModule } from '../tdlib/tdlib.module';
import { TelegramProcessor } from './telegram.processor';
import { CampaignProcessor } from './campaign.processor';
import { MessageProcessor } from './message.processor';

@Module({
  imports: [DatabaseModule, QueueModule, CommonModule, AuthModule, TdlibModule],
  controllers: [JobsController, QueuesController],
  providers: [JobsService, TelegramProcessor, CampaignProcessor, MessageProcessor],
  exports: [JobsService],
})
export class JobsModule {}