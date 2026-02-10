import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueService } from '../config/queue.service';
import { TdlibSessionStore } from '../tdlib/tdlib-session.store';
import { TdlibService } from '../tdlib/tdlib.service';
import { PrismaService } from '../config/prisma.service';
import { TELEGRAM_QUEUE_NAME } from './telegram.processor';
import { MessageStatus } from '@prisma/client';

export interface CampaignExecuteJobData {
  campaignId: string;
  accountId: string;
  clientId?: string;
  template: any;
  recipientList: any;
  settings: any;
}

@Injectable()
export class CampaignProcessor implements OnModuleInit {
  private readonly logger = new Logger(CampaignProcessor.name);
  private readonly defaultRateLimit = 20; // messages per second per account

  constructor(
    private readonly queueService: QueueService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly tdlibService: TdlibService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.queueService.createWorker<CampaignExecuteJobData>(
      'campaigns',
      async (job) => {
        if (job.name !== 'CAMPAIGN_EXECUTE') {
          this.logger.debug(`Ignoring job ${job.id} with type ${job.name} in campaigns queue`);
          return;
        }

        const { campaignId, accountId, clientId: providedClientId, template, recipientList, settings } = job.data;

        // Get clientId from account sessions if not provided
        let clientId = providedClientId;
        if (!clientId) {
          const sessions = await this.sessionStore.getSessionsByAccountId(accountId);
          const activeSession = sessions.find((s) => !s.revokedAt);
          if (!activeSession) {
            throw new Error(`No active TDLib session found for account ${accountId}`);
          }
          clientId = activeSession.clientId;
          this.logger.debug('Retrieved clientId from account sessions', { accountId, clientId });
        }

        const recipients =
          (recipientList && (recipientList.recipients as Array<any> | undefined)) || [];

        this.logger.log(
          `Processing campaign ${campaignId} for account ${accountId}, recipients=${recipients.length}`,
        );

        // Update campaign status to RUNNING
        await this.updateCampaignStatus(campaignId, 'RUNNING');

        // Rate limiting per account
        const rateLimit = settings?.rateLimit || this.defaultRateLimit;
        const delayBetweenMessages = Math.ceil(1000 / rateLimit); // ms between messages

        let enqueued = 0;
        let failed = 0;

        for (let i = 0; i < recipients.length; i++) {
          const recipient = recipients[i];
          
          try {
            // Resolve recipient chat ID
            let chatId: number;
            if (recipient.chatId) {
              chatId = typeof recipient.chatId === 'string' 
                ? parseInt(recipient.chatId, 10) 
                : recipient.chatId;
            } else if (recipient.chat_id) {
              chatId = typeof recipient.chat_id === 'string'
                ? parseInt(recipient.chat_id, 10)
                : recipient.chat_id;
            } else if (recipient.phone || recipient.value) {
              // Phone number - would need to search contacts first
              // For now, extract numeric part
              const phone = recipient.phone || recipient.value;
              chatId = parseInt(phone.replace(/\D/g, ''), 10);
            } else {
              this.logger.warn('Invalid recipient format', { recipient, campaignId });
              failed++;
              continue;
            }

            const payload = {
              '@type': 'sendMessage',
              chat_id: chatId,
              input_message_content: {
                '@type': 'inputMessageText',
                text: {
                  '@type': 'formattedText',
                  text: template?.text ?? '',
                  entities: template?.entities || [],
                },
              },
              disable_notification: settings?.disableNotification || false,
            };

            await this.queueService.addJob(
              TELEGRAM_QUEUE_NAME,
              'SEND_MESSAGE',
              {
                jobId: job.id,
                campaignId,
                accountId,
                clientId,
                recipient: recipient.phone || recipient.value || String(chatId),
                payload,
              },
              {
                priority: settings?.priority ?? 0,
                delay: i * delayBetweenMessages, // Stagger messages for rate limiting
              },
            );

            enqueued++;

            // Update progress periodically
            if (enqueued % 10 === 0) {
              await this.updateCampaignProgress(campaignId, enqueued, recipients.length);
            }
          } catch (error) {
            this.logger.error('Error enqueueing message for campaign', {
              campaignId,
              recipient,
              error: error instanceof Error ? error.message : String(error),
            });
            failed++;
          }
        }

        // Final progress update
        await this.updateCampaignProgress(campaignId, enqueued, recipients.length);

        this.logger.log('Campaign execution completed', {
          campaignId,
          enqueued,
          failed,
          total: recipients.length,
        });

        return {
          enqueued,
          failed,
          total: recipients.length,
        };
      },
      {
        concurrency: 2,
        limiter: {
          max: 5,
          duration: 1000,
        },
      },
    );
  }

  /**
   * Update campaign status
   */
  private async updateCampaignStatus(campaignId: string, status: string): Promise<void> {
    try {
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { status },
      });
    } catch (error) {
      this.logger.error('Failed to update campaign status', {
        campaignId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Update campaign progress
   */
  private async updateCampaignProgress(
    campaignId: string,
    processed: number,
    total: number,
  ): Promise<void> {
    try {
      // Update campaign metadata with progress
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { metadata: true },
      });

      const metadata = (campaign?.metadata as Record<string, any>) || {};
      metadata.progress = {
        processed,
        total,
        percentage: total > 0 ? Math.round((processed / total) * 100) : 0,
        updatedAt: new Date().toISOString(),
      };

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { metadata },
      });
    } catch (error) {
      this.logger.error('Failed to update campaign progress', {
        campaignId,
        processed,
        total,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

