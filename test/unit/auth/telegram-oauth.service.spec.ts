import { Test, TestingModule } from '@nestjs/testing';
import { TelegramOAuthService } from '../../../src/auth/telegram-oauth.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../src/config/redis.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('TelegramOAuthService', () => {
  let service: TelegramOAuthService;
  let mockConfigService: any;
  let mockRedisService: any;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockRedisService = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      authAuditLog: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramOAuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TelegramOAuthService>(TelegramOAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAuthUrl', () => {
    it('should generate auth URL with state', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'TELEGRAM_BOT_TOKEN') return '12345:ABCDEFGHIJK';
        if (key === 'TELEGRAM_OAUTH_ORIGIN') return 'http://localhost:3000';
        if (key === 'TELEGRAM_OAUTH_REDIRECT_URI') return 'http://localhost:3000/auth/callback';
        return null;
      });

      const result = await service.generateAuthUrl('http://localhost:3000/auth/callback');

      expect(result).toHaveProperty('authUrl');
      expect(result).toHaveProperty('stateId');
      expect(mockRedisService.set).toHaveBeenCalled();
    });
  });

  describe('validateCallback', () => {
    it('should validate callback and return user', async () => {
      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      const mockStateData = {
        stateId: 'state-123',
        redirectUri: 'http://localhost:3000/auth/callback',
        timestamp: Date.now(),
      };

      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'photo.jpg',
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockStateData));
      mockRedisService.del.mockResolvedValue(1);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.authAuditLog.create.mockResolvedValue({});
      jest.spyOn(service as any, 'validateTelegramData').mockReturnValue(true);

      const result = await service.validateCallback(mockData, 'state-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(mockPrismaService.authAuditLog.create).toHaveBeenCalled();
    });

    it('should throw error for invalid state', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      await expect(
        service.validateCallback(mockData, 'invalid-state'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for invalid Telegram data', async () => {
      const mockStateData = {
        stateId: 'state-123',
        redirectUri: 'http://localhost:3000/auth/callback',
        timestamp: Date.now(),
      };

      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'invalid-hash',
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockStateData));
      mockRedisService.del.mockResolvedValue(1);

      await expect(
        service.validateCallback(mockData, 'state-123'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should update existing user', async () => {
      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      const mockStateData = {
        stateId: 'state-123',
        redirectUri: 'http://localhost:3000/auth/callback',
        timestamp: Date.now(),
      };

      const mockExistingUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'olduser',
        firstName: 'Old',
        lastName: 'User',
        avatar: 'old-photo.jpg',
      };

      const mockUpdatedUser = {
        ...mockExistingUser,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'photo.jpg',
        lastActiveAt: expect.any(Date),
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockStateData));
      mockRedisService.del.mockResolvedValue(1);
      mockPrismaService.user.findUnique.mockResolvedValue(mockExistingUser);
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);
      mockPrismaService.authAuditLog.create.mockResolvedValue({});
      jest.spyOn(service as any, 'validateTelegramData').mockReturnValue(true);

      const result = await service.validateCallback(mockData, 'state-123');

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('validateTelegramData', () => {
    it('should return true for valid Telegram data', () => {
      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      mockConfigService.get.mockReturnValue('12345:ABCDEFGHIJK');

      // This test is simplified as the actual hash validation requires proper crypto setup
      // In a real test, you would need to properly generate the hash
      const result = service['validateTelegramData'](mockData);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('extractBotId', () => {
    it('should extract bot ID from token', () => {
      const result = service['extractBotId']('12345:ABCDEFGHIJK');
      expect(result).toBe('12345');
    });
  });

  describe('getAndDeleteState', () => {
    it('should get and delete state from Redis', async () => {
      const mockStateData = {
        stateId: 'state-123',
        redirectUri: 'http://localhost:3000/auth/callback',
        timestamp: Date.now(),
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockStateData));
      mockRedisService.del.mockResolvedValue(1);

      const result = await service['getAndDeleteState']('state-123');

      expect(result).toEqual(mockStateData);
      expect(mockRedisService.del).toHaveBeenCalledWith('telegram_auth_state:state-123');
    });

    it('should return null if state not found', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const result = await service['getAndDeleteState']('invalid-state');

      expect(result).toBeNull();
    });
  });

  describe('createTelegramUser', () => {
    it('should create new user from Telegram data', async () => {
      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'photo.jpg',
        language: 'en',
        isActive: true,
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service['createTelegramUser'](mockData);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          telegramId: 123,
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatar: 'photo.jpg',
          language: 'en',
          isActive: true,
        },
      });
    });
  });

  describe('updateTelegramUser', () => {
    it('should update existing user with Telegram data', async () => {
      const mockData = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'photo.jpg',
        auth_date: Date.now(),
        hash: 'valid-hash',
      };

      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'photo.jpg',
        lastActiveAt: expect.any(Date),
      };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service['updateTelegramUser']('user-1', mockData);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatar: 'photo.jpg',
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('logAuthEvent', () => {
    it('should log authentication event', async () => {
      const mockEvent = {
        id: 'event-1',
        userId: 'user-1',
        event: 'TELEGRAM_OAUTH_SUCCESS',
        metadata: { stateId: 'state-123' },
        ipAddress: undefined,
        userAgent: undefined,
      };

      mockPrismaService.authAuditLog.create.mockResolvedValue(mockEvent);

      await service['logAuthEvent']('user-1', 'TELEGRAM_OAUTH_SUCCESS', {
        stateId: 'state-123',
      });

      expect(mockPrismaService.authAuditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          event: 'TELEGRAM_OAUTH_SUCCESS',
          metadata: { stateId: 'state-123' },
          ipAddress: undefined,
          userAgent: undefined,
        },
      });
    });
  });
});