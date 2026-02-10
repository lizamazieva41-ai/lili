import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueService } from '../config/queue.service';
import { TdlibService } from '../tdlib/tdlib.service';
import { TdlibSessionStore } from '../tdlib/tdlib-session.store';
import { PrismaService } from '../config/prisma.service';
import { MessageStatus } from '@prisma/client';
import { CustomLoggerService } from '../common/services/logger.service';

export interface MessageSendJobData {
  jobId: string;
  messageId: string;
  accountId: string;
  recipient: string;
  content: string;
  metadata?: any;
}

@Injectable()
export class MessageProcessor implements OnModuleInit {
  private readonly logger = new Logger(MessageProcessor.name);
  private readonly maxRetries = 3;
  private readonly responseTimeoutMs = 10000; // 10 seconds

  constructor(
    private readonly queueService: QueueService,
    private readonly tdlibService: TdlibService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly prisma: PrismaService,
    private readonly customLogger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    this.queueService.createWorker<MessageSendJobData>(
      'messages',
      async (job) => {
        if (job.name !== 'MESSAGE_SEND') {
          this.logger.debug(`Ignoring job ${job.id} with type ${job.name} in messages queue`);
          return;
        }

        const { messageId, accountId, recipient, content, metadata } = job.data;

        try {
          // Get clientId from account session
          const sessions = await this.sessionStore.getSessionsByAccountId(accountId);
          if (sessions.length === 0) {
            throw new Error(`No active session found for account ${accountId}`);
          }

          // Use the first active session
          const session = sessions.find((s) => !s.revokedAt);
          if (!session) {
            throw new Error(`No active session found for account ${accountId}`);
          }

          const clientId = session.clientId;

          // Update message status to SENDING
          await this.updateMessageStatus(messageId, MessageStatus.SENDING);

          // Resolve recipient chat ID (could be phone number or chat ID)
          let chatId: number;
          if (/^\d+$/.test(recipient)) {
            // Numeric string, treat as chat ID
            chatId = parseInt(recipient, 10);
          } else {
            // Phone number, need to search for contact first
            // For now, assume recipient is already a chat ID
            // In production, you'd want to search contacts first
            chatId = parseInt(recipient.replace(/\D/g, ''), 10);
          }

          // Send message via TDLib
          await this.tdlibService.sendMessage(clientId, chatId, content, {
            disableNotification: metadata?.options?.disableNotification || false,
            replyToMessageId: metadata?.options?.replyToMessageId,
            scheduleDate: metadata?.options?.scheduleDate,
          });

          // Wait for response
          const response = await this.waitForMessageResponse(clientId, messageId);

          if (response && response['@type'] === 'message') {
            // Message sent successfully
            await this.updateMessageStatus(messageId, MessageStatus.SENT, {
              telegramMessageId: response.id,
              sentAt: new Date(response.date * 1000).toISOString(),
            });
            return { status: 'sent', messageId: response.id };
          } else if (response && response['@type'] === 'error') {
            // Handle error
            const errorMessage = response.message || 'Unknown error';
            const errorCode = response.code || 0;

            // Check if error is retryable
            if (this.isRetryableError(errorCode)) {
              throw new Error(`TDLib error ${errorCode}: ${errorMessage}`);
            }

            // Non-retryable error
            await this.updateMessageStatus(messageId, MessageStatus.FAILED, {
              error: errorMessage,
              errorCode,
            });
            return { status: 'failed', error: errorMessage, errorCode };
          }

          // Timeout or unknown response
          throw new Error('Timeout waiting for message response');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error processing message ${messageId}`, {
            messageId,
            accountId,
            error: errorMessage,
            attempt: job.attemptsMade + 1,
          });

          // Update message status based on retry count
          if (job.attemptsMade + 1 >= this.maxRetries) {
            await this.updateMessageStatus(messageId, MessageStatus.FAILED, {
              error: errorMessage,
              finalAttempt: true,
            });
            throw error; // Fail the job
          }

          // Retry with exponential backoff
          throw error;
        }
      },
      {
        concurrency: 10,
        limiter: {
          max: 30,
          duration: 1000, // 30 messages per second per account
        },
      },
    );
  }

  /**
   * Wait for message response from TDLib
   */
  private async waitForMessageResponse(
    clientId: string,
    messageId: string,
  ): Promise<any | null> {
    const deadline = Date.now() + this.responseTimeoutMs;
    const pollInterval = 100; // 100ms

    while (Date.now() < deadline) {
      try {
        const update = this.tdlibService.receive(clientId, 1.0);
        if (!update) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          continue;
        }

        // Check if this is a message update for our message
        if (update['@type'] === 'updateNewMessage') {
          const message = update.message;
          // In a real implementation, you'd match by some correlation ID
          // For now, we'll accept any new message as success
          return message;
        }

        // Check for errors
        if (update['@type'] === 'error') {
          return update;
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      } catch (error) {
        this.logger.warn('Error while waiting for message response', {
          clientId,
          messageId,
          error: error instanceof Error ? error.message : String(error),
        });
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    return null; // Timeout
  }

  /**
   * Update message status in database
   */
  private async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === MessageStatus.SENT && metadata?.sentAt) {
        updateData.sentAt = new Date(metadata.sentAt);
      }

      if (metadata) {
        // Merge with existing metadata
        const message = await this.prisma.message.findUnique({
          where: { id: messageId },
          select: { metadata: true },
        });

        updateData.metadata = {
          ...(message?.metadata as Record<string, any> || {}),
          ...metadata,
        };
      }

      await this.prisma.message.update({
        where: { id: messageId },
        data: updateData,
      });

      this.logger.debug('Message status updated', { messageId, status });
    } catch (error) {
      this.logger.error('Failed to update message status', {
        messageId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(errorCode: number): boolean {
    // Retryable errors: network issues, rate limits, temporary failures
    const retryableCodes = [
      429, // Too many requests
      500, // Internal server error
      502, // Bad gateway
      503, // Service unavailable
      504, // Gateway timeout
    ];

    return retryableCodes.includes(errorCode);
  }
}
