import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { QueueService } from '../config/queue.service';
import { TdlibService } from '../tdlib/tdlib.service';
import { PrismaService } from '../config/prisma.service';
import { TdlibUpdateDispatcher } from '../tdlib/tdlib-update-dispatcher.service';
import { JobStatus, MessageStatus } from '@prisma/client';
import { Job as BullMQJob } from 'bullmq';

export const TELEGRAM_QUEUE_NAME = 'telegram';

export interface TelegramJobData {
  jobId: string;
  campaignId?: string;
  accountId?: string;
  clientId: string;
  recipient?: string;
  messageId?: string;
  payload: any;
  requestId?: string; // For tracking responses
}

@Injectable()
export class TelegramProcessor implements OnModuleInit {
  private readonly logger = new Logger(TelegramProcessor.name);
  private readonly pendingRequests = new Map<string, {
    jobId: string;
    messageId?: string;
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    deadline: number;
  }>();

  constructor(
    private readonly queueService: QueueService,
    private readonly tdlibService: TdlibService,
    private readonly prisma: PrismaService,
    private readonly updateDispatcher: TdlibUpdateDispatcher,
  ) {}

  async onModuleInit() {
    // Start polling for updates to match with pending requests
    this.startUpdatePolling();

    this.queueService.createWorker<TelegramJobData>(
      TELEGRAM_QUEUE_NAME,
      async (job: BullMQJob<TelegramJobData>) => {
        return await this.processTelegramJob(job);
      },
      {
        concurrency: 5,
        limiter: {
          max: 20,
          duration: 1000,
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  /**
   * Process a Telegram job
   */
  private async processTelegramJob(job: BullMQJob<TelegramJobData>): Promise<any> {
    const { jobId, clientId, payload, messageId, requestId } = job.data;
    const requestTrackingId = requestId || `req_${jobId}_${Date.now()}`;

    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, JobStatus.PROCESSING);

      // Update message status if messageId provided
      if (messageId) {
        await this.updateMessageStatus(messageId, MessageStatus.SENDING);
      }

      // Add request ID to payload for tracking
      const payloadWithId = {
        ...payload,
        '@extra': requestTrackingId,
      };

      // Send request to TDLib
      this.tdlibService.send(clientId, payloadWithId);

      // Wait for response with timeout
      const response = await this.waitForResponse(
        requestTrackingId,
        clientId,
        30000, // 30 second timeout
      );

      // Update job and message status based on response
      if (response) {
        if (response['@type'] === 'error') {
          await this.handleErrorResponse(jobId, messageId, response);
          throw new Error(`TDLib error: ${response.message} (code: ${response.code})`);
        } else {
          await this.handleSuccessResponse(jobId, messageId, response);
          return {
            status: 'success',
            response: response,
          };
        }
      } else {
        // Timeout - mark as sent but not confirmed
        await this.updateJobStatus(jobId, JobStatus.COMPLETED);
        if (messageId) {
          await this.updateMessageStatus(messageId, MessageStatus.SENT);
        }
        return { status: 'sent', note: 'Response timeout - message may have been sent' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Error processing Telegram job', {
        jobId,
        clientId,
        error: errorMessage,
      });

      await this.handleErrorResponse(jobId, messageId, {
        '@type': 'error',
        code: 500,
        message: errorMessage,
      });

      throw error;
    }
  }

  /**
   * Wait for response from TDLib
   */
  private async waitForResponse(
    requestId: string,
    clientId: string,
    timeoutMs: number,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const deadline = Date.now() + timeoutMs;

      this.pendingRequests.set(requestId, {
        jobId: '', // Will be set by update handler
        resolve,
        reject,
        deadline,
      });

      // Set timeout
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          resolve(null); // Timeout - return null
        }
      }, timeoutMs);
    });
  }

  /**
   * Start polling for updates and matching with pending requests
   * Note: This complements TdlibUpdatePollingService by handling
   * request/response matching for job processing
   */
  private startUpdatePolling(): void {
    // Poll for updates every 100ms to match responses with pending requests
    setInterval(async () => {
      const clientIds = this.tdlibService.getAllClientIds();
      
      for (const clientId of clientIds) {
        try {
          const update = this.tdlibService.receive(clientId, 0.1);
          if (update) {
            // Check if this update matches a pending request first
            const requestId = update['@extra'];
            if (requestId && this.pendingRequests.has(requestId)) {
              const pending = this.pendingRequests.get(requestId)!;
              this.pendingRequests.delete(requestId);
              pending.resolve(update);
              // Don't dispatch to update handler - this is a direct response
              continue;
            }

            // Otherwise, dispatch to update handler (for async updates)
            // Note: TdlibUpdatePollingService also handles this, but we do it here
            // to ensure we catch responses even if polling service is disabled
            await this.updateDispatcher.dispatch(clientId, update);
          }
        } catch (error) {
          // Ignore errors during polling
        }
      }
    }, 100);
  }

  /**
   * Handle success response
   */
  private async handleSuccessResponse(
    jobId: string,
    messageId: string | undefined,
    response: any,
  ): Promise<void> {
    await this.updateJobStatus(jobId, JobStatus.COMPLETED, response);
    
    if (messageId) {
      // Message status will be updated by TdlibMessageUpdateHandler
      // when updateMessageSendSucceeded is received
      this.logger.debug('Success response received', { jobId, messageId });
    }
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(
    jobId: string,
    messageId: string | undefined,
    error: any,
  ): Promise<void> {
    await this.updateJobStatus(jobId, JobStatus.FAILED, { error });
    
    if (messageId) {
      await this.updateMessageStatus(messageId, MessageStatus.FAILED, {
        error: error.message || 'Unknown error',
        errorCode: error.code,
      });
    }
  }

  /**
   * Update job status
   */
  private async updateJobStatus(
    jobId: string,
    status: JobStatus,
    result?: any,
  ): Promise<void> {
    try {
      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status,
          result: result ? JSON.stringify(result) : undefined,
          completedAt: status === JobStatus.COMPLETED || status === JobStatus.FAILED
            ? new Date()
            : undefined,
        },
      });
    } catch (error) {
      this.logger.error('Failed to update job status', {
        jobId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Update message status
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

      if (status === MessageStatus.SENT) {
        updateData.sentAt = new Date();
      }

      if (metadata) {
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
    } catch (error) {
      this.logger.error('Failed to update message status', {
        messageId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

