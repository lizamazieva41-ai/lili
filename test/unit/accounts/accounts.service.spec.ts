import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from '../../../src/accounts/accounts.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockPrismaService = {
      telegramAccount: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      accountProxyAssignment: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      proxy: {
        findUnique: jest.fn(),
      },
      campaign: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated accounts', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          userId: 'user-1',
          phone: '+1234567890',
          status: 'ACTIVE',
          proxyAssignments: [],
        },
        {
          id: 'account-2',
          userId: 'user-1',
          phone: '+1987654321',
          status: 'INACTIVE',
          proxyAssignments: [],
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.telegramAccount.count.mockResolvedValue(2);

      const result = await service.findAll('user-1', { page: 1, limit: 20 });

      expect(result).toEqual({
        accounts: mockAccounts,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      });

      expect(mockPrismaService.telegramAccount.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        skip: 0,
        take: 20,
        include: {
          proxyAssignments: {
            where: { isActive: true },
            include: { proxy: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          userId: 'user-1',
          phone: '+1234567890',
          status: 'ACTIVE',
          proxyAssignments: [],
        },
      ];

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.telegramAccount.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', { status: 'active' });

      expect(result.accounts).toHaveLength(1);
      expect(mockPrismaService.telegramAccount.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', status: 'ACTIVE' },
        }),
      );
    });

    it('should limit maximum page size', async () => {
      const mockAccounts = Array(100).fill({
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
        proxyAssignments: [],
      });

      mockPrismaService.telegramAccount.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.telegramAccount.count.mockResolvedValue(100);

      const result = await service.findAll('user-1', { limit: 200 });

      expect(result.pagination.limit).toBe(100);
    });
  });

  describe('findOne', () => {
    it('should return account by ID', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
        proxyAssignments: [],
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);

      const result = await service.findOne('account-1', 'user-1');

      expect(result).toEqual(mockAccount);

      expect(mockPrismaService.telegramAccount.findFirst).toHaveBeenCalledWith({
        where: { id: 'account-1', userId: 'user-1' },
        include: {
          proxyAssignments: {
            where: { isActive: true },
            include: { proxy: true },
          },
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new account', async () => {
      const createAccountDto = {
        phone: '+1234567890',
        tags: ['tag1', 'tag2'],
        notes: 'Test account',
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'INACTIVE',
        tags: ['tag1', 'tag2'],
        notes: 'Test account',
        createdBy: 'user-1',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);
      mockPrismaService.telegramAccount.create.mockResolvedValue(mockAccount);

      const result = await service.create(createAccountDto, 'user-1');

      expect(result).toEqual(mockAccount);

      expect(mockPrismaService.telegramAccount.create).toHaveBeenCalledWith({
        data: {
          phone: '+1234567890',
          userId: 'user-1',
          status: 'INACTIVE',
          tags: ['tag1', 'tag2'],
          notes: 'Test account',
          createdBy: 'user-1',
        },
      });
    });

    it('should throw BadRequestException for duplicate phone', async () => {
      const createAccountDto = {
        phone: '+1234567890',
      };

      const mockExistingAccount = {
        id: 'existing-account',
        userId: 'user-1',
        phone: '+1234567890',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockExistingAccount);

      await expect(service.create(createAccountDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should assign proxy if provided', async () => {
      const createAccountDto = {
        phone: '+1234567890',
        proxyId: 'proxy-1',
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'INACTIVE',
      };

      const mockProxy = {
        id: 'proxy-1',
        host: 'proxy.example.com',
      };

      // first call: duplicate check -> null; second call: findOne() inside assignProxy -> account
      mockPrismaService.telegramAccount.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAccount);
      mockPrismaService.telegramAccount.create.mockResolvedValue(mockAccount);
      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.accountProxyAssignment.updateMany.mockResolvedValue({});
      mockPrismaService.accountProxyAssignment.create.mockResolvedValue({
        proxy: mockProxy,
      });

      const result = await service.create(createAccountDto, 'user-1');

      expect(result).toEqual(mockAccount);
      expect(mockPrismaService.accountProxyAssignment.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update account', async () => {
      const updateAccountDto = {
        status: 'ACTIVE',
        notes: 'Updated notes',
      };

      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
        notes: 'Updated notes',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.telegramAccount.update.mockResolvedValue(mockAccount);

      const result = await service.update('account-1', updateAccountDto, 'user-1');

      expect(result).toEqual(mockAccount);

      expect(mockPrismaService.telegramAccount.update).toHaveBeenCalledWith({
        where: { id: 'account-1' },
        data: {
          ...updateAccountDto,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-account', {}, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete account', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.telegramAccount.delete.mockResolvedValue(mockAccount);

      await service.remove('account-1', 'user-1');

      expect(mockPrismaService.telegramAccount.delete).toHaveBeenCalledWith({
        where: { id: 'account-1' },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.remove('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verify', () => {
    it('should verify account', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'INACTIVE',
      };

      const mockVerifiedAccount = {
        ...mockAccount,
        verification: 'FULL',
        status: 'ACTIVE',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.telegramAccount.update.mockResolvedValue(mockVerifiedAccount);

      const result = await service.verify('account-1', 'user-1');

      expect(result).toEqual(mockVerifiedAccount);

      expect(mockPrismaService.telegramAccount.update).toHaveBeenCalledWith({
        where: { id: 'account-1' },
        data: {
          verification: 'FULL',
          status: 'ACTIVE',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.verify('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProxy', () => {
    it('should return assigned proxy', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockProxy = {
        id: 'proxy-1',
        host: 'proxy.example.com',
      };

      const mockAssignment = {
        proxy: mockProxy,
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.accountProxyAssignment.findFirst.mockResolvedValue(mockAssignment);

      const result = await service.getProxy('account-1', 'user-1');

      expect(result).toEqual(mockProxy);

      expect(mockPrismaService.accountProxyAssignment.findFirst).toHaveBeenCalledWith({
        where: { accountId: 'account-1', isActive: true },
        include: { proxy: true },
        orderBy: { assignedAt: 'desc' },
      });
    });

    it('should return null if no proxy assigned', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.accountProxyAssignment.findFirst.mockResolvedValue(null);

      const result = await service.getProxy('account-1', 'user-1');

      expect(result).toBeNull();
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.getProxy('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignProxy', () => {
    it('should assign proxy to account', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      const mockProxy = {
        id: 'proxy-1',
        host: 'proxy.example.com',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.proxy.findUnique.mockResolvedValue(mockProxy);
      mockPrismaService.accountProxyAssignment.updateMany.mockResolvedValue({});
      mockPrismaService.accountProxyAssignment.create.mockResolvedValue({
        proxy: mockProxy,
      });

      const result = await service.assignProxy('account-1', 'proxy-1', 'user-1');

      expect(result).toEqual(mockProxy);

      expect(mockPrismaService.accountProxyAssignment.updateMany).toHaveBeenCalledWith({
        where: { accountId: 'account-1', isActive: true },
        data: { isActive: false },
      });

      expect(mockPrismaService.accountProxyAssignment.create).toHaveBeenCalledWith({
        data: {
          accountId: 'account-1',
          proxyId: 'proxy-1',
          isActive: true,
        },
        include: { proxy: true },
      });
    });

    it('should throw NotFoundException if proxy not found', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.proxy.findUnique.mockResolvedValue(null);

      await expect(
        service.assignProxy('account-1', 'invalid-proxy', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(
        service.assignProxy('invalid-account', 'proxy-1', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return account statistics', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
        statistics: { messagesSent: 100, campaigns: 5 },
        activityScore: 85,
        reputation: 'GOOD',
        lastActiveAt: new Date(),
        proxyAssignments: [],
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.count.mockResolvedValue(5);

      const result = await service.getStats('account-1', 'user-1');

      expect(result).toEqual({
        messagesSent: 100,
        campaigns: 5,
        campaignCount: 5,
        activityScore: 85,
        reputation: 'GOOD',
        lastActiveAt: expect.any(Date),
      });

      expect(mockPrismaService.campaign.count).toHaveBeenCalledWith({
        where: { accountId: 'account-1' },
      });
    });

    it('should handle empty statistics', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
        statistics: null,
        activityScore: 0,
        reputation: 'UNKNOWN',
        lastActiveAt: null,
        proxyAssignments: [],
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.campaign.count.mockResolvedValue(0);

      const result = await service.getStats('account-1', 'user-1');

      expect(result).toEqual({
        campaignCount: 0,
        activityScore: 0,
        reputation: 'UNKNOWN',
        lastActiveAt: null,
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.getStats('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activate', () => {
    it('should activate account', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'INACTIVE',
      };

      const mockActivatedAccount = {
        ...mockAccount,
        status: 'ACTIVE',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.telegramAccount.update.mockResolvedValue(mockActivatedAccount);

      const result = await service.activate('account-1', 'user-1');

      expect(result).toEqual(mockActivatedAccount);

      expect(mockPrismaService.telegramAccount.update).toHaveBeenCalledWith({
        where: { id: 'account-1' },
        data: {
          status: 'ACTIVE',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.activate('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate account', async () => {
      const mockAccount = {
        id: 'account-1',
        userId: 'user-1',
        phone: '+1234567890',
        status: 'ACTIVE',
      };

      const mockDeactivatedAccount = {
        ...mockAccount,
        status: 'INACTIVE',
      };

      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(mockAccount);
      mockPrismaService.telegramAccount.update.mockResolvedValue(mockDeactivatedAccount);

      const result = await service.deactivate('account-1', 'user-1');

      expect(result).toEqual(mockDeactivatedAccount);

      expect(mockPrismaService.telegramAccount.update).toHaveBeenCalledWith({
        where: { id: 'account-1' },
        data: {
          status: 'INACTIVE',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue(null);

      await expect(service.deactivate('invalid-account', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});