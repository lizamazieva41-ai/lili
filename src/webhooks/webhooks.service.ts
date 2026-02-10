import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Webhook, WebhookDelivery } from '@prisma/client';
import { JobsService } from '../jobs/jobs.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private jobsService: JobsService,
  ) {}

  /**
   * Get all webhooks for a user
   */
  async findAll(userId: string): Promise<Webhook[]> {
    try {
      return await this.prisma.webhook.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding webhooks for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get webhook by ID
   */
  async findOne(id: string, userId: string): Promise<Webhook> {
    try {
      const webhook = await this.prisma.webhook.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!webhook) {
        throw new NotFoundException(`Webhook not found: ${id}`);
      }

      return webhook;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding webhook ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Create new webhook
   */
  async create(createWebhookDto: CreateWebhookDto, userId: string): Promise<Webhook> {
    try {
      // Generate secret if not provided
      const secret = createWebhookDto.secret || this.generateSecret();

      const webhook = await this.prisma.webhook.create({
        data: {
          userId,
          name: createWebhookDto.name,
          url: createWebhookDto.url,
          events: createWebhookDto.events,
          secret,
          isActive: createWebhookDto.isActive ?? true,
          retryAttempts: createWebhookDto.retryAttempts || 3,
          retryDelay: createWebhookDto.retryDelay || 5000,
          timeout: createWebhookDto.timeout || 30000,
          headers: createWebhookDto.headers,
        },
      });

      this.logger.log(`Webhook created: ${webhook.id} (${webhook.name})`);
      return webhook;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error creating webhook: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Update webhook
   */
  async update(id: string, updateWebhookDto: UpdateWebhookDto, userId: string): Promise<Webhook> {
    try {
      await this.findOne(id, userId); // Verify ownership

      const webhook = await this.prisma.webhook.update({
        where: { id },
        data: {
          ...updateWebhookDto,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Webhook updated: ${id}`);
      return webhook;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error updating webhook ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Delete webhook
   */
  async remove(id: string, userId: string): Promise<void> {
    try {
      await this.findOne(id, userId); // Verify ownership

      await this.prisma.webhook.delete({
        where: { id },
      });

      this.logger.log(`Webhook deleted: ${id}`);
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error deleting webhook ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Test webhook
   */
  async test(id: string, userId: string): Promise<{
    success: boolean;
    statusCode?: number;
    response?: any;
    error?: string;
    testedAt: Date;
  }> {
    try {
      const webhook = await this.findOne(id, userId);

      if (!webhook.isActive) {
        throw new BadRequestException('Webhook is not active');
      }

      // Create test event payload
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook',
        },
      };

      // Create delivery record
      const delivery = await this.prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          eventId: `test_${Date.now()}`,
          eventType: 'webhook.test',
          payload: testPayload,
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 1,
        },
      });

      // Create job to deliver webhook
      await this.jobsService.create(
        {
          type: 'WEBHOOK_SEND',
          data: {
            webhookId: webhook.id,
            deliveryId: delivery.id,
            url: webhook.url,
            payload: testPayload,
            secret: webhook.secret,
            headers: webhook.headers,
            timeout: webhook.timeout,
          },
          queue: 'webhooks',
        },
        userId,
      );

      return {
        success: true,
        testedAt: new Date(),
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error testing webhook ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get webhook delivery history
   */
  async getDeliveries(
    id: string,
    userId: string,
    filters: {
      status?: string;
      eventType?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ deliveries: WebhookDelivery[]; pagination: any }> {
    try {
      await this.findOne(id, userId); // Verify ownership

      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = { webhookId: id };

      if (filters.status) {
        where.status = filters.status.toUpperCase();
      }

      if (filters.eventType) {
        where.eventType = filters.eventType;
      }

      const [deliveries, total] = await Promise.all([
        this.prisma.webhookDelivery.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.webhookDelivery.count({ where }),
      ]);

      return {
        deliveries,
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
        `Error getting deliveries for webhook ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Trigger webhook (internal method for event system)
   */
  async triggerWebhook(
    webhookId: string,
    eventType: string,
    eventData: any,
  ): Promise<void> {
    try {
      const webhook = await this.prisma.webhook.findUnique({
        where: { id: webhookId },
      });

      if (!webhook || !webhook.isActive) {
        return;
      }

      // Check if webhook listens to this event
      if (!webhook.events.includes(eventType) && !webhook.events.includes('*')) {
        return;
      }

      // Create delivery record
      const delivery = await this.prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          eventId: `${eventType}_${Date.now()}`,
          eventType,
          payload: eventData,
          status: 'PENDING',
          attempts: 0,
          maxAttempts: webhook.retryAttempts,
        },
      });

      // Create job to deliver webhook
      await this.jobsService.create(
        {
          type: 'WEBHOOK_SEND',
          data: {
            webhookId: webhook.id,
            deliveryId: delivery.id,
            url: webhook.url,
            payload: eventData,
            secret: webhook.secret,
            headers: webhook.headers,
            timeout: webhook.timeout,
            retryAttempts: webhook.retryAttempts,
            retryDelay: webhook.retryDelay,
          },
          queue: 'webhooks',
        },
      );

      // Update webhook stats
      await this.prisma.webhook.update({
        where: { id: webhookId },
        data: {
          lastTriggeredAt: new Date(),
          totalSent: { increment: 1 },
        },
      });
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error triggering webhook ${webhookId}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
    }
  }

  /**
   * Generate HMAC secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
