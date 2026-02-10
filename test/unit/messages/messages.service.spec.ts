import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../../../src/messages/messages.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { JobsService } from '../../../src/jobs/jobs.service';
import { NotFoundException } from '@nestjs/common';
import type { SendMessageDto } from '../../../src/messages/dto/send-message.dto';
import type { BulkMessageDto } from '../../../src/messages/dto/bulk-message.dto';

describe('MessagesService', () => {
  let service: MessagesService;
  let mockPrismaService: any;
  let mockJobsService: any;

  beforeEach(async () => {
    mockPrismaService = {
      telegramAccount: {
        findFirst: jest.fn(),
      },
      campaign: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    mockJobsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JobsService, useValue: mockJobsService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should send individual message', async () => {
      const sendMessageDto: SendMessageDto = {
        accountId: 'account-1',
        recipient: '+1234567890',
        message: {
          text: 'Hello World',
          parseMode: 'HTML',
          mediaUrl: undefined,
          mediaType: undefined,
        },
        type: 'TEXT',
        scheduledAt: undefined,
        options: {},
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1987654321',
      };

      const mockDirectCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Direct Messages',
      };

      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        type: 'TEXT',
        status: 'PENDING',
        metadata: {
          parseMode: 'HTML',
          mediaUrl: null,
          mediaType: null,
          options: {},
        },
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.findFirst.mockResolvedValue(mockDirectCampaign);
      mockPrismaService.message.create.mockResolvedValue(mockMessage);
      mockJobsService.create.mockResolvedValue({});

      const result = await service.send(sendMessageDto, 'user-1');

      expect(result).toEqual(mockMessage);

      expect(mockPrismaService.campaign.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Direct Messages',
        },
      });

      expect(mockPrismaService.message.create).toHaveBeenCalledWith({
        data: {
          campaignId: 'campaign-1',
          phoneNumber: '+1234567890',
          content: 'Hello World',
          type: 'TEXT',
          status: 'PENDING',
          scheduledAt: undefined,
          metadata: {
            parseMode: 'HTML',
            mediaUrl: undefined,
            mediaType: undefined,
            options: {},
          },
        },
      });

      expect(mockJobsService.create).toHaveBeenCalledWith(
        {
          type: 'MESSAGE_SEND',
          data: {
            messageId: 'message-1',
            accountId: 'account-1',
            recipient: '+1234567890',
            content: 'Hello World',
            metadata: mockMessage.metadata,
          },
          queue: 'messages',
        },
        'user-1',
      );
    });

    it('should create direct messages campaign if not exists', async () => {
      const sendMessageDto = {
        accountId: 'account-1',
        recipient: '+1234567890',
        message: {
          text: 'Hello World',
        },
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1987654321',
      };

      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        type: 'TEXT',
        status: 'PENDING',
        metadata: {},
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);
      mockPrismaService.campaign.create.mockResolvedValue({
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Direct Messages',
      });
      mockPrismaService.message.create.mockResolvedValue(mockMessage);
      mockJobsService.create.mockResolvedValue({});

      const result = await service.send(sendMessageDto, 'user-1');

      expect(result).toEqual(mockMessage);
      expect(mockPrismaService.campaign.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if account not found', async () => {
      const sendMessageDto = {
        accountId: 'invalid-account',
        recipient: '+1234567890',
        message: {
          text: 'Hello World',
        },
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.send(sendMessageDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should use default type if not provided', async () => {
      const sendMessageDto = {
        accountId: 'account-1',
        recipient: '+1234567890',
        message: {
          text: 'Hello World',
        },
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1987654321',
      };

      const mockDirectCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Direct Messages',
      };

      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        type: 'TEXT',
        status: 'PENDING',
        metadata: {},
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.findFirst.mockResolvedValue(mockDirectCampaign);
      mockPrismaService.message.create.mockResolvedValue(mockMessage);
      mockJobsService.create.mockResolvedValue({});

      const result = await service.send(sendMessageDto, 'user-1');

      expect(result.type).toBe('TEXT');
    });
  });

  describe('sendBulk', () => {
    it('should send bulk messages', async () => {
      const bulkMessageDto: BulkMessageDto = {
        accountId: 'account-1',
        recipients: ['+1234567890', '+1987654321'],
        message: {
          text: 'Hello {name}!',
          parseMode: 'HTML',
        },
        settings: {
          delayBetweenBatches: 1000,
        },
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1111111111',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: `Bulk Message - ${expect.any(String)}`,
      };

      const mockJob = {
        id: 'job-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);
      mockJobsService.create.mockResolvedValue(mockJob);

      const result = await service.sendBulk(bulkMessageDto, 'user-1');

      expect(result).toEqual({
        jobId: 'job-1',
        totalRecipients: 2,
        status: 'queued',
      });

      expect(mockPrismaService.campaign.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          accountId: 'account-1',
          name: expect.stringContaining('Bulk Message -'),
          type: 'BULK',
          status: 'DRAFT',
          template: bulkMessageDto.message,
          recipientList: {
            recipients: [
              { type: 'phone', value: '+1234567890' },
              { type: 'phone', value: '+1987654321' },
            ],
          },
          settings: bulkMessageDto.settings,
          createdBy: 'user-1',
        },
      });

      expect(mockJobsService.create).toHaveBeenCalledWith(
        {
          type: 'MESSAGE_SEND',
          data: {
            campaignId: 'campaign-1',
            accountId: 'account-1',
            recipients: ['+1234567890', '+1987654321'],
            message: bulkMessageDto.message,
            settings: bulkMessageDto.settings,
          },
          queue: 'messages',
        },
        'user-1',
      );
    });

    it('should use existing campaign if provided', async () => {
      const bulkMessageDto = {
        accountId: 'account-1',
        campaignId: 'existing-campaign',
        recipients: ['+1234567890'],
        message: {
          text: 'Hello {name}!',
        },
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1111111111',
      };

      const mockJob = {
        id: 'job-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockJobsService.create.mockResolvedValue(mockJob);

      const result = await service.sendBulk(bulkMessageDto, 'user-1');

      expect(result).toEqual({
        jobId: 'job-1',
        totalRecipients: 1,
        status: 'queued',
      });

      expect(mockPrismaService.campaign.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if account not found', async () => {
      const bulkMessageDto = {
        accountId: 'invalid-account',
        recipients: ['+1234567890'],
        message: {
          text: 'Hello {name}!',
        },
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.sendBulk(bulkMessageDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should use default settings if not provided', async () => {
      const bulkMessageDto = {
        accountId: 'account-1',
        recipients: ['+1234567890'],
        message: {
          text: 'Hello {name}!',
        },
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1111111111',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: `Bulk Message - ${expect.any(String)}`,
      };

      const mockJob = {
        id: 'job-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);
      mockJobsService.create.mockResolvedValue(mockJob);

      const result = await service.sendBulk(bulkMessageDto, 'user-1');

      expect(result).toEqual({
        jobId: 'job-1',
        totalRecipients: 1,
        status: 'queued',
      });

      expect(mockPrismaService.campaign.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            settings: {},
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated messages', async () => {
      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          phoneNumber: '+1234567890',
          content: 'Hello World',
          status: 'SENT',
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            accountId: 'account-1',
          },
        },
        {
          id: 'message-2',
          campaignId: 'campaign-1',
          phoneNumber: '+1987654321',
          content: 'Hello World 2',
          status: 'DELIVERED',
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            accountId: 'account-1',
          },
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result).toEqual({
        messages: mockMessages,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
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
      });
    });

    it('should filter by campaignId', async () => {
      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          phoneNumber: '+1234567890',
          content: 'Hello World',
          status: 'SENT',
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            accountId: 'account-1',
          },
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(1);

      const result = await service.findAll({ campaignId: 'campaign-1' });

      expect(result.messages).toHaveLength(1);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { campaignId: 'campaign-1' },
        }),
      );
    });

    it('should filter by status', async () => {
      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          phoneNumber: '+1234567890',
          content: 'Hello World',
          status: 'SENT',
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            accountId: 'account-1',
          },
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(1);

      const result = await service.findAll({ status: 'sent' });

      expect(result.messages).toHaveLength(1);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'SENT' },
        }),
      );
    });

    it('should filter by userId', async () => {
      const mockUserCampaigns = [
        { id: 'campaign-1' },
        { id: 'campaign-2' },
      ];

      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          phoneNumber: '+1234567890',
          content: 'Hello World',
          status: 'SENT',
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            accountId: 'account-1',
          },
        },
      ];

      mockPrismaService.campaign.findMany.mockResolvedValue(mockUserCampaigns);
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(1);

      const result = await service.findAll({ userId: 'user-1' });

      expect(result.messages).toHaveLength(1);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { campaignId: { in: ['campaign-1', 'campaign-2'] } },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockMessages = Array(100).fill({
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        status: 'SENT',
        campaign: {
          id: 'campaign-1',
          name: 'Test Campaign',
          accountId: 'account-1',
        },
      });

      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(100);

      const result = await service.findAll({ limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });
  });

  describe('findOne', () => {
    it('should return message by ID', async () => {
      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        status: 'SENT',
        campaign: {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign',
        },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      const result = await service.findOne('message-1', 'user-1');

      expect(result).toEqual(mockMessage);

      expect(mockPrismaService.message.findUnique).toHaveBeenCalledWith({
        where: { id: 'message-1' },
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
    });

    it('should throw NotFoundException if message not found', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-message', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user does not own message', async () => {
      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        status: 'SENT',
        campaign: {
          id: 'campaign-1',
          userId: 'different-user',
          name: 'Test Campaign',
        },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.findOne('message-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStatus', () => {
    it('should return message status', async () => {
      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        status: 'DELIVERED',
        sentAt: new Date(Date.now() - 2000),
        deliveredAt: new Date(Date.now() - 1000),
        readAt: new Date(),
        failedAt: null,
        errorMessage: null,
        errorCode: null,
        campaign: {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign',
        },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      const result = await service.getStatus('message-1', 'user-1');

      expect(result).toEqual({
        id: 'message-1',
        status: 'DELIVERED',
        sentAt: expect.any(Date),
        deliveredAt: expect.any(Date),
        readAt: expect.any(Date),
        failedAt: null,
        errorMessage: null,
        errorCode: null,
      });
    });

    it('should throw NotFoundException if message not found', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(service.getStatus('invalid-message', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user does not own message', async () => {
      const mockMessage = {
        id: 'message-1',
        campaignId: 'campaign-1',
        phoneNumber: '+1234567890',
        content: 'Hello World',
        status: 'SENT',
        campaign: {
          id: 'campaign-1',
          userId: 'different-user',
          name: 'Test Campaign',
        },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.getStatus('message-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});