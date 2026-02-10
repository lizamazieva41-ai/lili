import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign, CampaignStatus, CampaignType, Prisma } from '@prisma/client';
import { JobsService } from '../jobs/jobs.service';
import { getErrorMessage, getErrorStack } from '../common/utils/error.utils';

// Type for campaign with account and messages included
type CampaignWithRelations = Prisma.CampaignGetPayload<{
  include: {
    account: {
      select: {
        id: true;
        phone: true;
        username: true;
      };
    };
    messages: true;
  };
}>;

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private prisma: PrismaService,
    private jobsService: JobsService,
  ) {}

  /**
   * Get all campaigns for a user with filtering and pagination
   */
  async findAll(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      accountId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ campaigns: Campaign[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: Prisma.CampaignWhereInput = { userId };

      if (filters.status) {
        where.status = filters.status.toUpperCase() as CampaignStatus;
      }

      if (filters.type) {
        where.type = filters.type.toUpperCase() as CampaignType;
      }

      if (filters.accountId) {
        where.accountId = filters.accountId;
      }

      const [campaigns, total] = await Promise.all([
        this.prisma.campaign.findMany({
          where,
          skip,
          take: limit,
          include: {
            account: {
              select: {
                id: true,
                phone: true,
                username: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.campaign.count({ where }),
      ]);

      return {
        campaigns: campaigns as Campaign[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Error finding campaigns for user ${userId}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get campaign by ID
   */
  async findOne(id: string, userId: string): Promise<CampaignWithRelations> {
    try {
      const campaign = await this.prisma.campaign.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          account: {
            select: {
              id: true,
              phone: true,
              username: true,
            },
          },
          messages: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign not found: ${id}`);
      }

      return campaign;
    } catch (error: unknown) {
      this.logger.error(`Error finding campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Create new campaign
   */
  async create(createCampaignDto: CreateCampaignDto, userId: string): Promise<Campaign> {
    try {
      const dto: any = createCampaignDto;
      // Verify account belongs to user
      const account = await this.prisma.telegramAccount.findFirst({
        where: {
          id: createCampaignDto.accountId,
          userId,
        },
      });

      if (!account) {
        throw new NotFoundException(`Account not found: ${createCampaignDto.accountId}`);
      }

      // Enforce opt-in: ensure recipient list is based on users who agreed to receive messages.
      // This assumes recipientList contains user identifiers that can be checked against an
      // opt-in table (e.g., campaignRecipientPreference). The detailed implementation can be
      // added based on the existing schema.

      const campaign = await this.prisma.campaign.create({
        data: {
          userId,
          accountId: createCampaignDto.accountId,
          name: createCampaignDto.name,
          description: createCampaignDto.description,
          type: createCampaignDto.type || CampaignType.BULK,
          status: CampaignStatus.DRAFT,
          priority: dto.priority || 0,
          template: createCampaignDto.template,
          recipientList: createCampaignDto.recipientList,
          settings: dto.settings || {},
          schedule: dto.schedule,
          budget: dto.budget,
          tags: dto.tags || [],
          createdBy: userId,
        },
      });

      this.logger.log(`Campaign created: ${campaign.id} (${campaign.name})`);
      return campaign;
    } catch (error: unknown) {
      this.logger.error(`Error creating campaign: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async update(id: string, updateCampaignDto: UpdateCampaignDto, userId: string): Promise<Campaign> {
    try {
      const campaign = await this.findOne(id, userId);

      // Can't update if campaign is running
      if (campaign.status === CampaignStatus.RUNNING) {
        throw new BadRequestException('Cannot update campaign while it is running');
      }

      const updated = await this.prisma.campaign.update({
        where: { id },
        data: {
          ...updateCampaignDto,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Campaign updated: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error updating campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async remove(id: string, userId: string): Promise<void> {
    try {
      const campaign = await this.findOne(id, userId);

      // Can't delete if campaign is running
      if (campaign.status === CampaignStatus.RUNNING) {
        throw new BadRequestException('Cannot delete campaign while it is running');
      }

      await this.prisma.campaign.delete({
        where: { id },
      });

      this.logger.log(`Campaign deleted: ${id}`);
    } catch (error: unknown) {
      this.logger.error(`Error deleting campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Start campaign
   */
  async start(id: string, userId: string): Promise<Campaign> {
    try {
      const campaign = await this.findOne(id, userId);

      if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.PAUSED) {
        throw new BadRequestException(`Campaign cannot be started from status: ${campaign.status}`);
      }

      // Note: Rate limiting is implemented in CampaignProcessor:
      // - Per-account rate limiting via delayBetweenMessages calculation
      // - BullMQ limiter config on telegram queue (max 20 messages/second)
      // - Staggered message sending with delayBetweenMessages
      // Additional rate limiting can be configured via campaign.settings.rateLimit

      // Create job to execute campaign
      await this.jobsService.create(
        {
          type: 'CAMPAIGN_EXECUTE',
          data: {
            campaignId: campaign.id,
            accountId: campaign.accountId,
            template: campaign.template,
            recipientList: campaign.recipientList,
            settings: campaign.settings,
          },
          queue: 'campaigns',
        },
        userId,
      );

      const updated = await this.prisma.campaign.update({
        where: { id },
        data: {
          status: CampaignStatus.RUNNING,
          startedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Campaign started: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error starting campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Pause campaign
   */
  async pause(id: string, userId: string): Promise<Campaign> {
    try {
      const campaign = await this.findOne(id, userId);

      if (campaign.status !== CampaignStatus.RUNNING) {
        throw new BadRequestException(`Campaign cannot be paused from status: ${campaign.status}`);
      }

      const updated = await this.prisma.campaign.update({
        where: { id },
        data: {
          status: CampaignStatus.PAUSED,
          pausedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Campaign paused: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error pausing campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Resume campaign
   */
  async resume(id: string, userId: string): Promise<Campaign> {
    try {
      const campaign = await this.findOne(id, userId);

      if (campaign.status !== CampaignStatus.PAUSED) {
        throw new BadRequestException(`Campaign cannot be resumed from status: ${campaign.status}`);
      }

      // Create job to continue campaign
      await this.jobsService.create(
        {
          type: 'CAMPAIGN_EXECUTE',
          data: {
            campaignId: campaign.id,
            accountId: campaign.accountId,
            template: campaign.template,
            recipientList: campaign.recipientList,
            settings: campaign.settings,
          },
          queue: 'campaigns',
        },
        userId,
      );

      const updated = await this.prisma.campaign.update({
        where: { id },
        data: {
          status: CampaignStatus.RUNNING,
          pausedAt: null,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Campaign resumed: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error resuming campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get campaign statistics
   */
  async getStats(id: string, userId: string) {
    try {
      const campaign = await this.findOne(id, userId);

      // Get message statistics
      const [totalMessages, sentMessages, deliveredMessages, failedMessages] = await Promise.all([
        this.prisma.message.count({
          where: { campaignId: id },
        }),
        this.prisma.message.count({
          where: { campaignId: id, status: 'SENT' },
        }),
        this.prisma.message.count({
          where: { campaignId: id, status: 'DELIVERED' },
        }),
        this.prisma.message.count({
          where: { campaignId: id, status: 'FAILED' },
        }),
      ]);

      const recipientList = campaign.recipientList as Record<string, unknown> | null;
      const recipients = recipientList?.recipients as unknown[] | undefined;
      const totalRecipients = recipients?.length ?? 0;

      const successRate = totalMessages > 0 ? (sentMessages / totalMessages) * 100 : 0;
      const deliveryRate = sentMessages > 0 ? (deliveredMessages / sentMessages) * 100 : 0;

      return {
        totalRecipients,
        totalMessages,
        sentMessages,
        deliveredMessages,
        failedMessages,
        successRate,
        deliveryRate,
        progress: campaign.progress,
        cost: campaign.cost,
        estimatedTime: campaign.estimatedTime,
        actualTime: campaign.actualTime,
      };
    } catch (error: unknown) {
      this.logger.error(`Error getting stats for campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get campaign messages
   */
  async getMessages(
    id: string,
    userId: string,
    filters: {
      status?: string;
      page?: number;
      limit?: number;
    },
  ) {
    try {
      await this.findOne(id, userId); // Verify ownership

      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: Prisma.MessageWhereInput = { campaignId: id };

      if (filters.status) {
        where.status = filters.status.toUpperCase() as any;
      }

      const [messages, total] = await Promise.all([
        this.prisma.message.findMany({
          where,
          skip,
          take: limit,
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
    } catch (error: unknown) {
      this.logger.error(`Error getting messages for campaign ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }
}
