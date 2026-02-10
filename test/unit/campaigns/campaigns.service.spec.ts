import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from '../../../src/campaigns/campaigns.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { JobsService } from '../../../src/jobs/jobs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CampaignType } from '@prisma/client';
import type { CreateCampaignDto } from '../../../src/campaigns/dto/create-campaign.dto';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockPrismaService: any;
  let mockJobsService: any;

  beforeEach(async () => {
    mockPrismaService = {
      campaign: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      telegramAccount: {
        findFirst: jest.fn(),
      },
      message: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
    };

    mockJobsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JobsService, useValue: mockJobsService },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign 1',
          status: 'DRAFT',
          type: 'BULK',
          account: {
            id: 'account-1',
            phone: '+1234567890',
            username: 'testuser',
          },
        },
        {
          id: 'campaign-2',
          userId: 'user-1',
          name: 'Test Campaign 2',
          status: 'RUNNING',
          type: 'SEQUENTIAL',
          account: {
            id: 'account-2',
            phone: '+1987654321',
            username: 'testuser2',
          },
        },
      ];

      mockPrismaService.campaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.campaign.count.mockResolvedValue(2);

      const result = await service.findAll('user-1', { page: 1, limit: 20 });

      expect(result).toEqual({
        campaigns: mockCampaigns,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.campaign.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        skip: 0,
        take: 20,
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
      });
    });

    it('should filter by status', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign 1',
          status: 'DRAFT',
          type: 'BULK',
          account: {
            id: 'account-1',
            phone: '+1234567890',
            username: 'testuser',
          },
        },
      ];

      mockPrismaService.campaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.campaign.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', { status: 'draft' });

      expect(result.campaigns).toHaveLength(1);
      expect(mockPrismaService.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', status: 'DRAFT' },
        }),
      );
    });

    it('should filter by type', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign 1',
          status: 'DRAFT',
          type: 'BULK',
          account: {
            id: 'account-1',
            phone: '+1234567890',
            username: 'testuser',
          },
        },
      ];

      mockPrismaService.campaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.campaign.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', { type: 'bulk' });

      expect(result.campaigns).toHaveLength(1);
      expect(mockPrismaService.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'BULK' },
        }),
      );
    });

    it('should filter by accountId', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          userId: 'user-1',
          name: 'Test Campaign 1',
          status: 'DRAFT',
          type: 'BULK',
          account: {
            id: 'account-1',
            phone: '+1234567890',
            username: 'testuser',
          },
        },
      ];

      mockPrismaService.campaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.campaign.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', { accountId: 'account-1' });

      expect(result.campaigns).toHaveLength(1);
      expect(mockPrismaService.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', accountId: 'account-1' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockCampaigns = Array(100).fill({
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
      });

      mockPrismaService.campaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.campaign.count.mockResolvedValue(100);

      const result = await service.findAll('user-1', { limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });
  });

  describe('findOne', () => {
    it('should return campaign by ID', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      const result = await service.findOne('campaign-1', 'user-1');

      expect(result).toEqual(mockCampaign);

      expect(mockPrismaService.campaign.findFirst).toHaveBeenCalledWith({
        where: { id: 'campaign-1', userId: 'user-1' },
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
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new campaign', async () => {
      const createCampaignDto: CreateCampaignDto = {
        accountId: 'account-1',
        name: 'Test Campaign',
        description: 'Test description',
        type: CampaignType.BULK,
        template: { text: 'Hello {name}!' },
        recipientList: {
          recipients: [
            { type: 'phone', value: 'user1' },
            { type: 'phone', value: 'user2' },
          ],
        },
        settings: { delayBetweenMessages: 1000 },
        schedule: { type: 'scheduled', scheduledAt: new Date() },
        budget: 100,
        tags: ['test', 'campaign'],
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Campaign',
        description: 'Test description',
        type: 'BULK',
        status: 'DRAFT',
        priority: 0,
        template: createCampaignDto.template,
        recipientList: createCampaignDto.recipientList,
        settings: createCampaignDto.settings,
        schedule: createCampaignDto.schedule,
        budget: 100,
        tags: ['test', 'campaign'],
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(createCampaignDto, 'user-1');

      expect(result).toEqual(mockCampaign);

      expect(mockPrismaService.campaign.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Test Campaign',
          description: 'Test description',
          type: 'BULK',
          status: 'DRAFT',
          priority: 0,
          template: { text: 'Hello {name}!' },
          recipientList: {
            recipients: [
              { type: 'phone', value: 'user1' },
              { type: 'phone', value: 'user2' },
            ],
          },
          settings: { delayBetweenMessages: 1000 },
          schedule: { type: 'scheduled', scheduledAt: expect.any(Date) },
          budget: 100,
          tags: ['test', 'campaign'],
          createdBy: 'user-1',
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      const createCampaignDto = {
        accountId: 'invalid-account',
        name: 'Test Campaign',
      } as any;

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.create(createCampaignDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should use default type if not provided', async () => {
      const createCampaignDto = {
        accountId: 'account-1',
        name: 'Test Campaign',
      } as any;

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Campaign',
        type: 'BULK',
        status: 'DRAFT',
        priority: 0,
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(createCampaignDto, 'user-1');

      expect(result.type).toBe('BULK');
    });

    it('should use default priority if not provided', async () => {
      const createCampaignDto = {
        accountId: 'account-1',
        name: 'Test Campaign',
      } as any;

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Campaign',
        type: 'BULK',
        status: 'DRAFT',
        priority: 0,
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(createCampaignDto, 'user-1');

      expect(result.priority).toBe(0);
    });

    it('should use default settings if not provided', async () => {
      const createCampaignDto = {
        accountId: 'account-1',
        name: 'Test Campaign',
      } as any;

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Campaign',
        type: 'BULK',
        status: 'DRAFT',
        priority: 0,
        settings: {},
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(createCampaignDto, 'user-1');

      expect(result.settings).toEqual({});
    });

    it('should use default tags if not provided', async () => {
      const createCampaignDto = {
        accountId: 'account-1',
        name: 'Test Campaign',
      } as any;

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Campaign',
        type: 'BULK',
        status: 'DRAFT',
        priority: 0,
        tags: [],
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(createCampaignDto, 'user-1');

      expect(result.tags).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update campaign', async () => {
      const updateCampaignDto = {
        name: 'Updated Campaign',
        description: 'Updated description',
        status: 'PAUSED',
      };

      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockUpdatedCampaign = {
        ...mockCampaign,
        name: 'Updated Campaign',
        description: 'Updated description',
        status: 'PAUSED',
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.campaign.update.mockResolvedValue(mockUpdatedCampaign);

      const result = await service.update('campaign-1', updateCampaignDto, 'user-1');

      expect(result).toEqual(mockUpdatedCampaign);

      expect(mockPrismaService.campaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: {
          ...updateCampaignDto,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-campaign', {}, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if campaign is running', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(
        service.update('campaign-1', { name: 'Updated' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete campaign', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.campaign.delete.mockResolvedValue(mockCampaign);

      await service.remove('campaign-1', 'user-1');

      expect(mockPrismaService.campaign.delete).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
      });
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.remove('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if campaign is running', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(service.remove('campaign-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('start', () => {
    it('should start campaign', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        accountId: 'account-1',
        template: 'Hello {name}!',
        recipientList: { recipients: ['user1', 'user2'] },
        settings: { delay: 1000 },
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockStartedCampaign = {
        ...mockCampaign,
        status: 'RUNNING',
        startedAt: expect.any(Date),
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockJobsService.create.mockResolvedValue({});
      mockPrismaService.campaign.update.mockResolvedValue(mockStartedCampaign);

      const result = await service.start('campaign-1', 'user-1');

      expect(result).toEqual(mockStartedCampaign);

      expect(mockJobsService.create).toHaveBeenCalledWith(
        {
          type: 'CAMPAIGN_EXECUTE',
          data: {
            campaignId: 'campaign-1',
            accountId: 'account-1',
            template: 'Hello {name}!',
            recipientList: { recipients: ['user1', 'user2'] },
            settings: { delay: 1000 },
          },
          queue: 'campaigns',
        },
        'user-1',
      );

      expect(mockPrismaService.campaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: {
          status: 'RUNNING',
          startedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.start('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if campaign cannot be started', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(service.start('campaign-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('pause', () => {
    it('should pause campaign', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockPausedCampaign = {
        ...mockCampaign,
        status: 'PAUSED',
        pausedAt: expect.any(Date),
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.campaign.update.mockResolvedValue(mockPausedCampaign);

      const result = await service.pause('campaign-1', 'user-1');

      expect(result).toEqual(mockPausedCampaign);

      expect(mockPrismaService.campaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: {
          status: 'PAUSED',
          pausedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.pause('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if campaign cannot be paused', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(service.pause('campaign-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resume', () => {
    it('should resume campaign', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'PAUSED',
        type: 'BULK',
        accountId: 'account-1',
        template: 'Hello {name}!',
        recipientList: { recipients: ['user1', 'user2'] },
        settings: { delay: 1000 },
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockResumedCampaign = {
        ...mockCampaign,
        status: 'RUNNING',
        pausedAt: null,
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockJobsService.create.mockResolvedValue({});
      mockPrismaService.campaign.update.mockResolvedValue(mockResumedCampaign);

      const result = await service.resume('campaign-1', 'user-1');

      expect(result).toEqual(mockResumedCampaign);

      expect(mockJobsService.create).toHaveBeenCalledWith(
        {
          type: 'CAMPAIGN_EXECUTE',
          data: {
            campaignId: 'campaign-1',
            accountId: 'account-1',
            template: 'Hello {name}!',
            recipientList: { recipients: ['user1', 'user2'] },
            settings: { delay: 1000 },
          },
          queue: 'campaigns',
        },
        'user-1',
      );

      expect(mockPrismaService.campaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: {
          status: 'RUNNING',
          pausedAt: null,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.resume('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if campaign cannot be resumed', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(service.resume('campaign-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStats', () => {
    it('should return campaign statistics', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        recipientList: { recipients: ['user1', 'user2', 'user3'] },
        progress: 50,
        cost: 100,
        estimatedTime: 3600,
        actualTime: 1800,
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.count
        .mockResolvedValueOnce(10) // totalMessages
        .mockResolvedValueOnce(8) // sentMessages
        .mockResolvedValueOnce(6) // deliveredMessages
        .mockResolvedValueOnce(2); // failedMessages

      const result = await service.getStats('campaign-1', 'user-1');

      expect(result).toEqual({
        totalRecipients: 3,
        totalMessages: 10,
        sentMessages: 8,
        deliveredMessages: 6,
        failedMessages: 2,
        successRate: 80,
        deliveryRate: 75,
        progress: 50,
        cost: 100,
        estimatedTime: 3600,
        actualTime: 1800,
      });

      expect(mockPrismaService.message.count).toHaveBeenCalledTimes(4);
    });

    it('should handle empty recipient list', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        recipientList: null,
        progress: 0,
        cost: 0,
        estimatedTime: 0,
        actualTime: 0,
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getStats('campaign-1', 'user-1');

      expect(result.totalRecipients).toBe(0);
      expect(result.successRate).toBe(0);
      expect(result.deliveryRate).toBe(0);
    });

    it('should handle division by zero', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        recipientList: { recipients: [] },
        progress: 0,
        cost: 0,
        estimatedTime: 0,
        actualTime: 0,
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getStats('campaign-1', 'user-1');

      expect(result.successRate).toBe(0);
      expect(result.deliveryRate).toBe(0);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(service.getStats('invalid-campaign', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMessages', () => {
    it('should return paginated messages', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          status: 'SENT',
          recipient: 'user1',
        },
        {
          id: 'message-2',
          campaignId: 'campaign-1',
          status: 'DELIVERED',
          recipient: 'user2',
        },
      ];

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(2);

      const result = await service.getMessages('campaign-1', 'user-1', { page: 1, limit: 20 });

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
        where: { campaignId: 'campaign-1' },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockMessages = [
        {
          id: 'message-1',
          campaignId: 'campaign-1',
          status: 'SENT',
          recipient: 'user1',
        },
      ];

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(1);

      const result = await service.getMessages('campaign-1', 'user-1', { status: 'sent' });

      expect(result.messages).toHaveLength(1);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { campaignId: 'campaign-1', status: 'SENT' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Test Campaign',
        status: 'RUNNING',
        type: 'BULK',
        account: {
          id: 'account-1',
          phone: '+1234567890',
          username: 'testuser',
        },
        messages: [],
      };

      const mockMessages = Array(100).fill({
        id: 'message-1',
        campaignId: 'campaign-1',
        status: 'SENT',
        recipient: 'user1',
      });

      mockPrismaService.campaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);
      mockPrismaService.message.count.mockResolvedValue(100);

      const result = await service.getMessages('campaign-1', 'user-1', { limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue(null);

      await expect(
        service.getMessages('invalid-campaign', 'user-1', { page: 1, limit: 20 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});