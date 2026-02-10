import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { BulkMessageDto } from './dto/bulk-message.dto';
import { Message, MessageStatus, MessageType } from '@prisma/client';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private prisma: PrismaService,
    private jobsService: JobsService,
  ) {}

  /**
   * Send individual message
   */
  async send(sendMessageDto: SendMessageDto, userId: string): Promise<Message> {
    try {
      // Verify account belongs to user
      const account = await this.prisma.telegramAccount.findFirst({
        where: {
          id: sendMessageDto.accountId,
          userId,
        },
      });

      if (!account) {
        throw new NotFoundException(`Account not found: ${sendMessageDto.accountId}`);
      }

      // Create or get direct message campaign for this account
      let directCampaign = await this.prisma.campaign.findFirst({
        where: {
          userId,
          accountId: sendMessageDto.accountId,
          name: 'Direct Messages',
        },
      });

      if (!directCampaign) {
        directCampaign = await this.prisma.campaign.create({
          data: {
            userId,
            accountId: sendMessageDto.accountId,
            name: 'Direct Messages',
            type: 'BULK',
            status: 'DRAFT',
            template: {},
            recipientList: { recipients: [] },
            settings: {},
            createdBy: userId,
          },
        });
      }

      // Create message record
      const message = await this.prisma.message.create({
        data: {
          campaignId: directCampaign.id,
          phoneNumber: sendMessageDto.recipient,
          content: sendMessageDto.message.text,
          type: sendMessageDto.type || MessageType.TEXT,
          status: MessageStatus.PENDING,
          scheduledAt: sendMessageDto.scheduledAt,
          metadata: {
            parseMode: sendMessageDto.message.parseMode,
            mediaUrl: sendMessageDto.message.mediaUrl,
            mediaType: sendMessageDto.message.mediaType,
            options: sendMessageDto.options,
          },
        },
      });

      // Create job to send message
      await this.jobsService.create(
        {
          type: 'MESSAGE_SEND',
          data: {
            messageId: message.id,
            accountId: sendMessageDto.accountId,
            recipient: sendMessageDto.recipient,
            content: sendMessageDto.message.text,
            metadata: message.metadata,
          },
          queue: 'messages',
        },
        userId,
      );

      this.logger.log(`Message queued: ${message.id}`);
      return message;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error sending message: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Send bulk messages
   */
  async sendBulk(bulkMessageDto: BulkMessageDto, userId: string): Promise<{
    jobId: string;
    totalRecipients: number;
    status: string;
  }> {
    try {
      // Verify account belongs to user
      const account = await this.prisma.telegramAccount.findFirst({
        where: {
          id: bulkMessageDto.accountId,
          userId,
        },
      });

      if (!account) {
        throw new NotFoundException(`Account not found: ${bulkMessageDto.accountId}`);
      }

      // Create or use existing campaign
      let campaignId = bulkMessageDto.campaignId;
      if (!campaignId) {
        // Create a temporary campaign for bulk messages
        const campaign = await this.prisma.campaign.create({
          data: {
            userId,
            accountId: bulkMessageDto.accountId,
            name: `Bulk Message - ${new Date().toISOString()}`,
            type: 'BULK',
            status: 'DRAFT',
            template: bulkMessageDto.message,
            recipientList: {
              recipients: bulkMessageDto.recipients.map((r) => ({
                type: 'phone',
                value: r,
              })),
            },
            settings: bulkMessageDto.settings || {},
            createdBy: userId,
          },
        });
        campaignId = campaign.id;
      }

      // Create job to send bulk messages
      const job = await this.jobsService.create(
        {
          type: 'MESSAGE_SEND',
          data: {
            campaignId,
            accountId: bulkMessageDto.accountId,
            recipients: bulkMessageDto.recipients,
            message: bulkMessageDto.message,
            settings: bulkMessageDto.settings,
          },
          queue: 'messages',
        },
        userId,
      );

      return {
        jobId: job.id,
        totalRecipients: bulkMessageDto.recipients.length,
        status: 'queued',
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error sending bulk messages: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get all messages with filtering and pagination
   */
  async findAll(
    filters: {
      campaignId?: string;
      accountId?: string;
      status?: string;
      userId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ messages: Message[]; pagination: any }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (filters.campaignId) {
        where.campaignId = filters.campaignId;
      }

      if (filters.status) {
        where.status = filters.status.toUpperCase();
      }

      // If userId provided, filter by campaigns belonging to user
      if (filters.userId) {
        const userCampaigns = await this.prisma.campaign.findMany({
          where: { userId: filters.userId },
          select: { id: true },
        });
        where.campaignId = {
          in: userCampaigns.map((c) => c.id),
        };
      }

      const [messages, total] = await Promise.all([
        this.prisma.message.findMany({
          where,
          skip,
          take: limit,
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                accountId: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.message.count({ where }),
      ]);

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding messages: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get message by ID
   */
  async findOne(id: string, userId: string): Promise<Message> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
        include: {
          campaign: {
            select: {
              id: true,
              userId: true,
              name: true,
            },
          },
        },
      });

      if (!message) {
        throw new NotFoundException(`Message not found: ${id}`);
      }

      // Verify ownership through campaign
      if (message.campaign.userId !== userId) {
        throw new NotFoundException(`Message not found: ${id}`);
      }

      return message;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding message ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get message delivery status
   */
  async getStatus(id: string, userId: string) {
    try {
      const message = await this.findOne(id, userId);

      return {
        id: message.id,
        status: message.status,
        sentAt: message.sentAt,
        deliveredAt: message.deliveredAt,
        readAt: message.readAt,
        failedAt: message.failedAt,
        errorMessage: message.errorMessage,
        errorCode: message.errorCode,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting status for message ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }
}
