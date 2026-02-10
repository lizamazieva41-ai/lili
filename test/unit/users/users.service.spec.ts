import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { CacheService } from '../../../src/common/services/cache.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockPrismaService: any;
  let mockCacheService: any;

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      userSession: {
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    mockCacheService = {
      set: jest.fn(),
      delete: jest.fn(),
      invalidateUser: jest.fn(),
      getUser: jest.fn(async (_id: string, getter: () => Promise<any>) => getter()),
      getOrSet: jest.fn(async (_key: string, getter: () => Promise<any>) => getter()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
      };

      const mockUser = {
        id: 'user-1',
        ...userData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          telegramId: 123,
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          avatar: 'avatar.jpg',
          language: 'en',
        },
      });
    });

    it('should use default language if not provided', async () => {
      const userData = {
        telegramId: 123,
        username: 'testuser',
      };

      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(result.language).toBe('en');
    });
  });

  describe('findById', () => {
    it('should return user by ID', async () => {
      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sessions: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('invalid-user-id');

      expect(result).toBeNull();
    });
  });

  describe('findByTelegramId', () => {
    it('should return user by Telegram ID', async () => {
      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sessions: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByTelegramId(123);

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { telegramId: 123 },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByTelegramId(999);

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sessions: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByUsername('invalid-username');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const mockUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'updateduser',
        email: 'updated@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.update('user-1', userData);

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'updateduser',
        email: 'updated@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: userData,
      });
    });
  });

  describe('createOrUpdateSession', () => {
    it('should create new session', async () => {
      const mockActiveSessions = [
        { id: 'session-1', userId: 'user-1', isActive: true },
        { id: 'session-2', userId: 'user-1', isActive: true },
      ];

      const mockNewSession = {
        id: 'session-3',
        userId: 'user-1',
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: expect.any(Date),
      };

      mockPrismaService.userSession.findMany.mockResolvedValue(mockActiveSessions);
      mockPrismaService.userSession.create.mockResolvedValue(mockNewSession);

      const result = await service.createOrUpdateSession(
        'user-1',
        'new-token',
        'new-refresh-token',
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toEqual({
        userId: 'user-1',
        sessionId: 'session-3',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: expect.any(Date),
      });

      expect(mockPrismaService.userSession.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          token: 'new-token',
          refreshToken: 'new-refresh-token',
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
          isActive: true,
          expiresAt: expect.any(Date),
        },
      });
    });

    it('should deactivate oldest session when limit reached', async () => {
      const mockActiveSessions = [
        { id: 'session-1', userId: 'user-1', isActive: true, createdAt: new Date(Date.now() - 2 * 3600000) },
        { id: 'session-2', userId: 'user-1', isActive: true, createdAt: new Date(Date.now() - 1 * 3600000) },
        { id: 'session-3', userId: 'user-1', isActive: true, createdAt: new Date() },
      ];

      const mockNewSession = {
        id: 'session-4',
        userId: 'user-1',
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: expect.any(Date),
      };

      mockPrismaService.userSession.findMany.mockResolvedValue(mockActiveSessions);
      mockPrismaService.userSession.update.mockResolvedValue(undefined);
      mockPrismaService.userSession.create.mockResolvedValue(mockNewSession);

      const result = await service.createOrUpdateSession(
        'user-1',
        'new-token',
        'new-refresh-token',
        '127.0.0.1',
        'test-agent',
      );

      expect(mockPrismaService.userSession.update).toHaveBeenCalledWith({
        where: { id: 'session-3' },
        data: { isActive: false },
      });

      expect(result).toEqual({
        userId: 'user-1',
        sessionId: 'session-4',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: expect.any(Date),
      });
    });
  });

  describe('invalidateSession', () => {
    it('should invalidate session', async () => {
      mockPrismaService.userSession.update.mockResolvedValue(undefined);

      await service.invalidateSession('session-1');

      expect(mockPrismaService.userSession.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { isActive: false },
      });
    });
  });

  describe('invalidateUserSessions', () => {
    it('should invalidate all user sessions', async () => {
      mockPrismaService.userSession.updateMany.mockResolvedValue(undefined);

      await service.invalidateUserSessions('user-1');

      expect(mockPrismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isActive: true },
        data: { isActive: false },
      });
    });
  });

  describe('findActiveSessionByToken', () => {
    it('should return active session by token', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'user-1',
        token: 'valid-token',
        refreshToken: 'refresh-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };

      mockPrismaService.userSession.findFirst.mockResolvedValue(mockSession);

      const result = await service.findActiveSessionByToken('valid-token');

      expect(result).toEqual({
        userId: 'user-1',
        sessionId: 'session-1',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: expect.any(Date),
      });

      expect(mockPrismaService.userSession.findFirst).toHaveBeenCalledWith({
        where: { token: 'valid-token', isActive: true, expiresAt: { gt: expect.any(Date) } },
      });
    });

    it('should return null for expired session', async () => {
      // The service queries only active, non-expired sessions; simulate DB returning none.
      mockPrismaService.userSession.findFirst.mockResolvedValue(null);

      const result = await service.findActiveSessionByToken('expired-token');

      expect(result).toBeNull();
    });

    it('should return null for inactive session', async () => {
      mockPrismaService.userSession.findFirst.mockResolvedValue(null);

      const result = await service.findActiveSessionByToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('mapToUser', () => {
    it('should map database user to User interface', () => {
      const mockDbUser = {
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = service['mapToUser'](mockDbUser);

      expect(result).toEqual({
        id: 'user-1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
        language: 'en',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});