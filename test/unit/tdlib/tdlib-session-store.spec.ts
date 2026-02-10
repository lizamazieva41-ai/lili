import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TdlibSessionStore, TdlibSession } from '../../../src/tdlib/tdlib-session.store';
import { RedisService } from '../../../src/config/redis.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { CustomLoggerService } from '../../../src/common/services/logger.service';

describe('TdlibSessionStore', () => {
  let service: TdlibSessionStore;
  let mockRedisService: any;
  let mockPrismaService: any;
  let mockConfigService: any;
  let mockLogger: any;

  beforeEach(async () => {
    mockRedisService = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    mockPrismaService = {
      accountSession: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          TDLIB_SESSION_TTL_SECONDS: 604800, // 7 days
          TDLIB_SESSION_DB_BACKUP: true,
        };
        return config[key] ?? defaultValue;
      }),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TdlibSessionStore,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<TdlibSessionStore>(TdlibSessionStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveSession', () => {
    it('should save session to Redis', async () => {
      const session: TdlibSession = {
        clientId: 'client-123',
        userId: 'user-456',
        accountId: 'account-789',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await service.saveSession(session);

      expect(mockRedisService.set).toHaveBeenCalled();
      const setCall = mockRedisService.set.mock.calls[0];
      expect(setCall[0]).toContain('tdlib:session:client-123');
      expect(JSON.parse(setCall[1])).toMatchObject({
        clientId: session.clientId,
        userId: session.userId,
        phoneNumber: session.phoneNumber,
      });
    });

    it('should backup session to DB when enabled', async () => {
      const session: TdlibSession = {
        clientId: 'client-123',
        userId: 'user-456',
        accountId: 'account-789',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await service.saveSession(session);

      expect(mockPrismaService.accountSession.upsert).toHaveBeenCalled();
    });

    it('should not backup to DB when disabled', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'TDLIB_SESSION_DB_BACKUP') return false;
        return true;
      });

      const session: TdlibSession = {
        clientId: 'client-123',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await service.saveSession(session);

      expect(mockPrismaService.accountSession.upsert).not.toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('should retrieve session from Redis', async () => {
      const session: TdlibSession = {
        clientId: 'client-123',
        userId: 'user-456',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(session));

      const result = await service.getSession('client-123');

      expect(result).toMatchObject({
        clientId: session.clientId,
        userId: session.userId,
        phoneNumber: session.phoneNumber,
      });
      expect(mockRedisService.set).toHaveBeenCalled(); // Updates lastActivityAt
    });

    it('should return null when session not found', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const result = await service.getSession('non-existent');

      expect(result).toBeNull();
    });

    it('should restore from DB when Redis miss and DB backup enabled', async () => {
      mockRedisService.get.mockResolvedValue(null);
      const dbSession = {
        id: 'session-1',
        accountId: 'account-789',
        sessionData: {
          clientId: 'client-123',
          phoneNumber: '+1234567890',
          userId: 'user-456',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          phone: '+1234567890',
        },
      };
      mockPrismaService.accountSession.findFirst.mockResolvedValue(dbSession);

      const result = await service.getSession('client-123');

      expect(result).not.toBeNull();
      expect(result?.clientId).toBe('client-123');
      expect(mockRedisService.set).toHaveBeenCalled(); // Restores to Redis
    });
  });

  describe('getSessionsByUserId', () => {
    it('should return sessions for user', async () => {
      const dbSessions = [
        {
          id: 'session-1',
          accountId: 'account-1',
          sessionData: { clientId: 'client-1', phoneNumber: '+1234567890' },
          account: { phone: '+1234567890' },
        },
      ];
      mockPrismaService.accountSession.findMany.mockResolvedValue(dbSessions);
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          clientId: 'client-1',
          phoneNumber: '+1234567890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      const result = await service.getSessionsByUserId('user-456');

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when DB backup disabled', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'TDLIB_SESSION_DB_BACKUP') return false;
        return true;
      });

      const result = await service.getSessionsByUserId('user-456');

      expect(result).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('getSessionsByAccountId', () => {
    it('should return sessions for account', async () => {
      const dbSessions = [
        {
          id: 'session-1',
          accountId: 'account-1',
          sessionData: { clientId: 'client-1' },
        },
      ];
      mockPrismaService.accountSession.findMany.mockResolvedValue(dbSessions);
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          clientId: 'client-1',
          phoneNumber: '+1234567890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      const result = await service.getSessionsByAccountId('account-1');

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('revokeSession', () => {
    it('should revoke session successfully', async () => {
      const session: TdlibSession = {
        clientId: 'client-123',
        accountId: 'account-789',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRedisService.get.mockResolvedValue(JSON.stringify(session));

      await service.revokeSession('client-123');

      expect(mockRedisService.set).toHaveBeenCalled();
      const setCall = mockRedisService.set.mock.calls[0];
      const updatedSession = JSON.parse(setCall[1]);
      expect(updatedSession.revokedAt).toBeDefined();
    });

    it('should handle non-existent session gracefully', async () => {
      mockRedisService.get.mockResolvedValue(null);

      await service.revokeSession('non-existent');

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should update DB when session has accountId', async () => {
      const session: TdlibSession = {
        clientId: 'client-123',
        accountId: 'account-789',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRedisService.get.mockResolvedValue(JSON.stringify(session));

      await service.revokeSession('client-123');

      expect(mockPrismaService.accountSession.updateMany).toHaveBeenCalled();
    });
  });

  describe('revokeAccountSessions', () => {
    it('should revoke all sessions for account', async () => {
      const sessions = [
        {
          clientId: 'client-1',
          phoneNumber: '+1234567890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          clientId: 'client-2',
          phoneNumber: '+1234567890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockPrismaService.accountSession.findMany.mockResolvedValue([
        { sessionData: { clientId: 'client-1' } },
        { sessionData: { clientId: 'client-2' } },
      ]);
      mockRedisService.get.mockResolvedValue(JSON.stringify(sessions[0]));

      await service.revokeAccountSessions('account-789');

      expect(mockRedisService.set).toHaveBeenCalledTimes(2);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should cleanup expired sessions', async () => {
      mockPrismaService.accountSession.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.cleanupExpiredSessions();

      expect(result).toBe(5);
      expect(mockPrismaService.accountSession.updateMany).toHaveBeenCalled();
    });

    it('should return 0 when DB backup disabled', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'TDLIB_SESSION_DB_BACKUP') return false;
        return true;
      });

      const result = await service.cleanupExpiredSessions();

      expect(result).toBe(0);
    });
  });

  describe('getAllActiveSessions', () => {
    it('should return all active sessions', async () => {
      const dbSessions = [
        {
          id: 'session-1',
          accountId: 'account-1',
          sessionData: { clientId: 'client-1' },
          account: { phone: '+1234567890' },
        },
      ];
      mockPrismaService.accountSession.findMany.mockResolvedValue(dbSessions);
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          clientId: 'client-1',
          phoneNumber: '+1234567890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      const result = await service.getAllActiveSessions();

      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter out revoked sessions', async () => {
      const dbSessions = [
        {
          id: 'session-1',
          accountId: 'account-1',
          sessionData: { clientId: 'client-1' },
          account: { phone: '+1234567890' },
        },
      ];
      mockPrismaService.accountSession.findMany.mockResolvedValue(dbSessions);
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          clientId: 'client-1',
          phoneNumber: '+1234567890',
          revokedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      const result = await service.getAllActiveSessions();

      expect(result.length).toBe(0);
    });
  });
});
