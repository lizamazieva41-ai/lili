import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from '../../../src/webhooks/webhooks.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { JobsService } from '../../../src/jobs/jobs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let mockPrismaService: any;
  let mockJobsService: any;

  beforeEach(async () => {
    mockPrismaService = {
      webhook: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      webhookDelivery: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
    };

    mockJobsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JobsService, useValue: mockJobsService },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all webhooks for user', async () => {
      const mockWebhooks = [
        {
          id: 'webhook-1',
          userId: 'user-1',
          name: 'Test Webhook 1',
          url: 'https://example.com/webhook1',
          events: ['message.sent', 'campaign.started'],
          isActive: true,
        },
        {
          id: 'webhook-2',
          userId: 'user-1',
          name: 'Test Webhook 2',
          url: 'https://example.com/webhook2',
          events: ['*'],
          isActive: false,
        },
      ];

      mockPrismaService.webhook.findMany.mockResolvedValue(mockWebhooks);

      const result = await service.findAll('user-1');

      expect(result).toEqual(mockWebhooks);

      expect(mockPrismaService.webhook.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array if no webhooks', async () => {
      mockPrismaService.webhook.findMany.mockResolvedValue([]);

      const result = await service.findAll('user-1');

      expect(result).toHaveLength(0);
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll('user-1')).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return webhook by ID', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);

      const result = await service.findOne('webhook-1', 'user-1');

      expect(result).toEqual(mockWebhook);

      expect(mockPrismaService.webhook.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'webhook-1',
          userId: 'user-1',
        },
      });
    });

    it('should throw NotFoundException if webhook not found', async () => {
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-webhook', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne('webhook-1', 'user-1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('create', () => {
    it('should create new webhook', async () => {
      const createWebhookDto = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent', 'campaign.started'],
        secret: 'test-secret',
        isActive: true,
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
        headers: {
          'X-Custom-Header': 'value',
        },
      };

      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent', 'campaign.started'],
        secret: 'test-secret',
        isActive: true,
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
        headers: {
          'X-Custom-Header': 'value',
        },
      };

      mockPrismaService.webhook.create.mockResolvedValue(mockWebhook);

      const result = await service.create(createWebhookDto, 'user-1');

      expect(result).toEqual(mockWebhook);

      expect(mockPrismaService.webhook.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          name: 'Test Webhook',
          url: 'https://example.com/webhook',
          events: ['message.sent', 'campaign.started'],
          secret: 'test-secret',
          isActive: true,
          retryAttempts: 3,
          retryDelay: 5000,
          timeout: 30000,
          headers: {
            'X-Custom-Header': 'value',
          },
        },
      });
    });

    it('should generate secret if not provided', async () => {
      const createWebhookDto = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
      };

      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        secret: 'generated-secret-1234567890',
        isActive: true,
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
      };

      mockPrismaService.webhook.create.mockResolvedValue(mockWebhook);

      const result = await service.create(createWebhookDto, 'user-1');

      expect(result.secret).toBeDefined();
      expect(typeof result.secret).toBe('string');
      expect(result.secret!.length).toBeGreaterThan(10);
      expect(mockPrismaService.webhook.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            secret: expect.any(String),
          }),
        }),
      );
    });

    it('should use default values if not provided', async () => {
      const createWebhookDto = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
      };

      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        secret: expect.any(String),
        isActive: true,
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
      };

      mockPrismaService.webhook.create.mockResolvedValue(mockWebhook);

      const result = await service.create(createWebhookDto, 'user-1');

      expect(result.isActive).toBe(true);
      expect(result.retryAttempts).toBe(3);
      expect(result.retryDelay).toBe(5000);
      expect(result.timeout).toBe(30000);
    });

    it('should handle errors', async () => {
      const createWebhookDto = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
      };

      mockPrismaService.webhook.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createWebhookDto, 'user-1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update webhook', async () => {
      const updateWebhookDto = {
        name: 'Updated Webhook',
        url: 'https://example.com/updated-webhook',
        events: ['campaign.started'],
        isActive: false,
      };

      const mockExistingWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      const mockUpdatedWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Updated Webhook',
        url: 'https://example.com/updated-webhook',
        events: ['campaign.started'],
        isActive: false,
      };

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockExistingWebhook);
      mockPrismaService.webhook.update.mockResolvedValue(mockUpdatedWebhook);

      const result = await service.update('webhook-1', updateWebhookDto, 'user-1');

      expect(result).toEqual(mockUpdatedWebhook);

      expect(mockPrismaService.webhook.update).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
        data: {
          ...updateWebhookDto,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if webhook not found', async () => {
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-webhook', {}, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(
        service.update('webhook-1', {}, 'user-1'),
      ).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should delete webhook', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhook.delete.mockResolvedValue(mockWebhook);

      await service.remove('webhook-1', 'user-1');

      expect(mockPrismaService.webhook.delete).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
      });
    });

    it('should throw NotFoundException if webhook not found', async () => {
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);

      await expect(service.remove('invalid-webhook', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(service.remove('webhook-1', 'user-1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('test', () => {
    it('should test webhook', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
        secret: 'test-secret',
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
        headers: {
          'X-Custom-Header': 'value',
        },
      };

      const mockDelivery = {
        id: 'delivery-1',
        webhookId: 'webhook-1',
        eventId: 'test_1234567890',
        eventType: 'webhook.test',
        payload: {
          event: 'webhook.test',
          timestamp: expect.any(String),
          data: {
            message: 'This is a test webhook',
          },
        },
        status: 'PENDING',
        attempts: 0,
        maxAttempts: 1,
      };

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.create.mockResolvedValue(mockDelivery);
      mockJobsService.create.mockResolvedValue({});

      const result = await service.test('webhook-1', 'user-1');

      expect(result).toEqual({
        success: true,
        testedAt: expect.any(Date),
      });

      expect(mockPrismaService.webhookDelivery.create).toHaveBeenCalledWith({
        data: {
          webhookId: 'webhook-1',
          eventId: expect.any(String),
          eventType: 'webhook.test',
          payload: {
            event: 'webhook.test',
            timestamp: expect.any(String),
            data: {
              message: 'This is a test webhook',
            },
          },
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 1,
        },
      });

      expect(mockJobsService.create).toHaveBeenCalledWith(
        {
          type: 'WEBHOOK_SEND',
          data: {
            webhookId: 'webhook-1',
            deliveryId: 'delivery-1',
            url: 'https://example.com/webhook',
            payload: {
              event: 'webhook.test',
              timestamp: expect.any(String),
              data: {
                message: 'This is a test webhook',
              },
            },
            secret: 'test-secret',
            headers: {
              'X-Custom-Header': 'value',
            },
            timeout: 30000,
          },
          queue: 'webhooks',
        },
        'user-1',
      );
    });

    it('should throw NotFoundException if webhook not found', async () => {
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);

      await expect(service.test('invalid-webhook', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if webhook is inactive', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: false,
      };

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);

      await expect(service.test('webhook-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(service.test('webhook-1', 'user-1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getDeliveries', () => {
    it('should return paginated deliveries', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      const mockDeliveries = [
        {
          id: 'delivery-1',
          webhookId: 'webhook-1',
          eventId: 'event-1',
          eventType: 'message.sent',
          payload: {
            event: 'message.sent',
            data: {
              messageId: 'message-1',
            },
          },
          status: 'DELIVERED',
          attempts: 1,
          maxAttempts: 3,
        },
        {
          id: 'delivery-2',
          webhookId: 'webhook-1',
          eventId: 'event-2',
          eventType: 'message.sent',
          payload: {
            event: 'message.sent',
            data: {
              messageId: 'message-2',
            },
          },
          status: 'FAILED',
          attempts: 3,
          maxAttempts: 3,
        },
      ];

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.findMany.mockResolvedValue(mockDeliveries);
      mockPrismaService.webhookDelivery.count.mockResolvedValue(2);

      const result = await service.getDeliveries('webhook-1', 'user-1', {
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({
        deliveries: mockDeliveries,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.webhookDelivery.findMany).toHaveBeenCalledWith({
        where: { webhookId: 'webhook-1' },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      const mockDeliveries = [
        {
          id: 'delivery-1',
          webhookId: 'webhook-1',
          eventId: 'event-1',
          eventType: 'message.sent',
          status: 'DELIVERED',
        },
      ];

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.findMany.mockResolvedValue(mockDeliveries);
      mockPrismaService.webhookDelivery.count.mockResolvedValue(1);

      const result = await service.getDeliveries('webhook-1', 'user-1', {
        status: 'delivered',
      });

      expect(result.deliveries).toHaveLength(1);
      expect(mockPrismaService.webhookDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { webhookId: 'webhook-1', status: 'DELIVERED' },
        }),
      );
    });

    it('should filter by eventType', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      const mockDeliveries = [
        {
          id: 'delivery-1',
          webhookId: 'webhook-1',
          eventId: 'event-1',
          eventType: 'message.sent',
          status: 'DELIVERED',
        },
      ];

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.findMany.mockResolvedValue(mockDeliveries);
      mockPrismaService.webhookDelivery.count.mockResolvedValue(1);

      const result = await service.getDeliveries('webhook-1', 'user-1', {
        eventType: 'message.sent',
      });

      expect(result.deliveries).toHaveLength(1);
      expect(mockPrismaService.webhookDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { webhookId: 'webhook-1', eventType: 'message.sent' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      const mockDeliveries = Array(100).fill({
        id: 'delivery-1',
        webhookId: 'webhook-1',
        eventId: 'event-1',
        eventType: 'message.sent',
        status: 'DELIVERED',
      });

      mockPrismaService.webhook.findFirst.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.findMany.mockResolvedValue(mockDeliveries);
      mockPrismaService.webhookDelivery.count.mockResolvedValue(100);

      const result = await service.getDeliveries('webhook-1', 'user-1', {
        limit: 200,
      });

      expect(result.pagination.limit).toBe(100);
    });

    it('should throw NotFoundException if webhook not found', async () => {
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);

      await expect(
        service.getDeliveries('invalid-webhook', 'user-1', { page: 1, limit: 20 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockPrismaService.webhook.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(
        service.getDeliveries('webhook-1', 'user-1', { page: 1, limit: 20 }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('triggerWebhook', () => {
    it('should trigger webhook for matching event', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent', 'campaign.started'],
        isActive: true,
        secret: 'test-secret',
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
        headers: {
          'X-Custom-Header': 'value',
        },
      };

      const mockDelivery = {
        id: 'delivery-1',
        webhookId: 'webhook-1',
        eventId: 'message.sent_1234567890',
        eventType: 'message.sent',
        payload: {
          event: 'message.sent',
          data: {
            messageId: 'message-1',
          },
        },
        status: 'PENDING',
        attempts: 0,
        maxAttempts: 3,
      };

      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.create.mockResolvedValue(mockDelivery);
      mockJobsService.create.mockResolvedValue({});
      mockPrismaService.webhook.update.mockResolvedValue(mockWebhook);

      await service.triggerWebhook('webhook-1', 'message.sent', {
        messageId: 'message-1',
      });

      expect(mockPrismaService.webhookDelivery.create).toHaveBeenCalledWith({
        data: {
          webhookId: 'webhook-1',
          eventId: expect.any(String),
          eventType: 'message.sent',
          payload: {
            messageId: 'message-1',
          },
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 3,
        },
      });

      expect(mockJobsService.create).toHaveBeenCalledWith({
        type: 'WEBHOOK_SEND',
        data: {
          webhookId: 'webhook-1',
          deliveryId: 'delivery-1',
          url: 'https://example.com/webhook',
          payload: {
            messageId: 'message-1',
          },
          secret: 'test-secret',
          headers: {
            'X-Custom-Header': 'value',
          },
          timeout: 30000,
          retryAttempts: 3,
          retryDelay: 5000,
        },
        queue: 'webhooks',
      });

      expect(mockPrismaService.webhook.update).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
        data: {
          lastTriggeredAt: expect.any(Date),
          totalSent: { increment: 1 },
        },
      });
    });

    it('should not trigger webhook for non-matching event', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: true,
      };

      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);

      await service.triggerWebhook('webhook-1', 'campaign.started', {
        campaignId: 'campaign-1',
      });

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
      expect(mockJobsService.create).not.toHaveBeenCalled();
    });

    it('should trigger webhook for wildcard event', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['*'],
        isActive: true,
        secret: 'test-secret',
        retryAttempts: 3,
        retryDelay: 5000,
        timeout: 30000,
      };

      const mockDelivery = {
        id: 'delivery-1',
        webhookId: 'webhook-1',
        eventId: 'campaign.started_1234567890',
        eventType: 'campaign.started',
        payload: {
          event: 'campaign.started',
          data: {
            campaignId: 'campaign-1',
          },
        },
        status: 'PENDING',
        attempts: 0,
        maxAttempts: 3,
      };

      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.create.mockResolvedValue(mockDelivery);
      mockJobsService.create.mockResolvedValue({});
      mockPrismaService.webhook.update.mockResolvedValue(mockWebhook);

      await service.triggerWebhook('webhook-1', 'campaign.started', {
        campaignId: 'campaign-1',
      });

      expect(mockPrismaService.webhookDelivery.create).toHaveBeenCalled();
      expect(mockJobsService.create).toHaveBeenCalled();
    });

    it('should not trigger inactive webhook', async () => {
      const mockWebhook = {
        id: 'webhook-1',
        userId: 'user-1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['message.sent'],
        isActive: false,
      };

      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);

      await service.triggerWebhook('webhook-1', 'message.sent', {
        messageId: 'message-1',
      });

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
      expect(mockJobsService.create).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockPrismaService.webhook.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await service.triggerWebhook('webhook-1', 'message.sent', {
        messageId: 'message-1',
      });

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
      expect(mockJobsService.create).not.toHaveBeenCalled();
    });
  });

  describe('generateSecret', () => {
    it('should generate HMAC secret', () => {
      const result = service['generateSecret']();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(10);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate unique secrets', () => {
      const secret1 = service['generateSecret']();
      const secret2 = service['generateSecret']();

      expect(secret1).not.toBe(secret2);
    });
  });
});