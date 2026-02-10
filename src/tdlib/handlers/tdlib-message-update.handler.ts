import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { TdlibSessionStore } from '../tdlib-session.store';
import { CustomLoggerService } from '../../common/services/logger.service';
import { MessageStatus } from '@prisma/client';

/**
 * Handler for TDLib message-related updates
 */
@Injectable()
export class TdlibMessageUpdateHandler {
  private readonly logger = new Logger(TdlibMessageUpdateHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly customLogger: CustomLoggerService,
  ) {}

  /**
   * Handle message update
   */
  async handle(clientId: string, update: any): Promise<void> {
    const updateType = update['@type'] as string;

    switch (updateType) {
      case 'updateNewMessage':
        await this.handleNewMessage(clientId, update);
        break;
      case 'updateMessageSendSucceeded':
        await this.handleMessageSendSucceeded(clientId, update);
        break;
      case 'updateMessageSendFailed':
        await this.handleMessageSendFailed(clientId, update);
        break;
      case 'updateMessageContent':
        await this.handleMessageContent(clientId, update);
        break;
      case 'updateDeleteMessages':
        await this.handleDeleteMessages(clientId, update);
        break;
      default:
        this.logger.debug('Unhandled message update type', { clientId, updateType });
    }
  }

  /**
   * Handle new message received
   */
  private async handleNewMessage(clientId: string, update: any): Promise<void> {
    const message = update.message;
    if (!message) {
      return;
    }

    // Check if this is a message we sent (outgoing)
    const isOutgoing = message.is_outgoing;
    if (!isOutgoing) {
      // Incoming message - could be used for webhooks or notifications
      this.logger.debug('Incoming message received', {
        clientId,
        messageId: message.id,
        chatId: message.chat_id,
      });
      return;
    }

    // Outgoing message - update message status
    await this.updateMessageStatusByTelegramId(
      clientId,
      message.id,
      MessageStatus.SENT,
      {
        telegramMessageId: message.id,
        sentAt: new Date(message.date * 1000).toISOString(),
      },
    );
  }

  /**
   * Handle message send succeeded
   */
  private async handleMessageSendSucceeded(clientId: string, update: any): Promise<void> {
    const message = update.message;
    const oldMessageId = update.old_message_id;

    await this.updateMessageStatusByTelegramId(
      clientId,
      message.id,
      MessageStatus.SENT,
      {
        telegramMessageId: message.id,
        oldTelegramMessageId: oldMessageId,
        sentAt: new Date(message.date * 1000).toISOString(),
      },
    );
  }

  /**
   * Handle message send failed
   */
  private async handleMessageSendFailed(clientId: string, update: any): Promise<void> {
    const message = update.message;
    const error = update.error;

    await this.updateMessageStatusByTelegramId(
      clientId,
      message.id,
      MessageStatus.FAILED,
      {
        error: error?.message || 'Message send failed',
        errorCode: error?.code,
      },
    );
  }

  /**
   * Handle message content update
   */
  private async handleMessageContent(clientId: string, update: any): Promise<void> {
    // Message content was edited - could update message record if needed
    this.logger.debug('Message content updated', {
      clientId,
      chatId: update.chat_id,
      messageId: update.message_id,
    });
  }

  /**
   * Handle messages deleted
   */
  private async handleDeleteMessages(clientId: string, update: any): Promise<void> {
    const chatId = update.chat_id;
    const messageIds = update.message_ids || [];

    // Update message status to DELETED if we have records
    for (const messageId of messageIds) {
      await this.updateMessageStatusByTelegramId(
        clientId,
        messageId,
        MessageStatus.FAILED, // Or create a DELETED status
        {
          deleted: true,
          deletedAt: new Date().toISOString(),
        },
      );
    }
  }

  /**
   * Update message status by Telegram message ID
   */
  private async updateMessageStatusByTelegramId(
    clientId: string,
    telegramMessageId: number,
    status: MessageStatus,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      // Get account from session
      const session = await this.sessionStore.getSession(clientId);
      if (!session || !session.accountId) {
        return; // Can't update without account
      }

      // Find message by telegram message ID in metadata
      // Note: This assumes metadata.telegramMessageId is stored
      const messages = await this.prisma.message.findMany({
        where: {
          campaign: {
            accountId: session.accountId,
          },
          status: {
            in: [MessageStatus.PENDING, MessageStatus.SENDING],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit search to recent messages
      });

      // Try to match by telegramMessageId in metadata
      for (const message of messages) {
        const msgMetadata = message.metadata as Record<string, any> | null;
        if (msgMetadata?.telegramMessageId === telegramMessageId) {
          // Found matching message
          await this.updateMessageStatus(message.id, status, metadata);
          return;
        }
      }

      // If not found by metadata, try to match by creation time and account
      // This is a fallback for messages that don't have telegramMessageId stored yet
      this.logger.debug('Could not find message by telegramMessageId', {
        clientId,
        telegramMessageId,
        accountId: session.accountId,
      });
    } catch (error) {
      this.logger.error('Error updating message status', {
        clientId,
        telegramMessageId,
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

      if (status === MessageStatus.SENT && metadata?.sentAt) {
        updateData.sentAt = new Date(metadata.sentAt);
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

      this.logger.debug('Message status updated from TDLib update', {
        messageId,
        status,
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
