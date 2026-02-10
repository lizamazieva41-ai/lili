import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TdlibAuthService } from '../../../src/tdlib/tdlib-auth.service';
import { TdlibService } from '../../../src/tdlib/tdlib.service';
import { TdlibSessionStore } from '../../../src/tdlib/tdlib-session.store';
import { RedisService } from '../../../src/config/redis.service';
import { PrismaService } from '../../../src/config/prisma.service';
import { CustomLoggerService } from '../../../src/common/services/logger.service';
import { AccountsService } from '../../../src/accounts/accounts.service';

describe('TdlibAuthService', () => {
  let service: TdlibAuthService;
  let mockTdlibService: any;
  let mockSessionStore: any;
  let mockRedisService: any;
  let mockPrismaService: any;
  let mockConfigService: any;
  let mockLogger: any;
  let mockAccountsService: any;

  beforeEach(async () => {
    mockTdlibService = {
      createClient: jest.fn(),
      send: jest.fn(),
      receive: jest.fn(),
      destroyClient: jest.fn(),
    };

    mockSessionStore = {
      saveSession: jest.fn(),
      getSession: jest.fn(),
    };

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockPrismaService = {
      telegramAccount: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      accountSession: {
        upsert: jest.fn(),
      },
      accountProxyAssignment: {
        findFirst: jest.fn(),
      },
      proxy: {
        findUnique: jest.fn(),
      },
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          TDLIB_PHONE_CODE_TTL_SECONDS: 300,
          TDLIB_AUTH_WAIT_TIMEOUT_MS: 60000,
          TDLIB_MAX_AUTH_ATTEMPTS: 5,
          TDLIB_AUTH_ATTEMPT_WINDOW_MS: 3600000,
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

    mockAccountsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TdlibAuthService,
        { provide: TdlibService, useValue: mockTdlibService },
        { provide: TdlibSessionStore, useValue: mockSessionStore },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CustomLoggerService, useValue: mockLogger },
        { provide: AccountsService, useValue: mockAccountsService },
      ],
    }).compile();

    service = module.get<TdlibAuthService>(TdlibAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestCode', () => {
    it('should request code successfully', async () => {
      const phoneNumber = '+1234567890';
      const userId = 'user-123';
      const clientId = 'client-456';

      mockTdlibService.createClient.mockResolvedValue({ id: clientId });
      mockRedisService.get.mockResolvedValue(null);

      // Mock waitForAuthorizationState to return waitCode state
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateWaitCode',
      );

      const result = await service.requestCode(phoneNumber, userId);

      expect(result.clientId).toBe(clientId);
      expect(result.phoneNumber).toBe(phoneNumber);
      expect(result.userId).toBe(userId);
      expect(mockTdlibService.send).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should return existing clientId if still valid', async () => {
      const phoneNumber = '+1234567890';
      const userId = 'user-123';
      const existingData = {
        clientId: 'existing-client',
        expiresAt: Date.now() + 60000,
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(existingData));

      const result = await service.requestCode(phoneNumber, userId);

      expect(result.clientId).toBe('existing-client');
      expect(mockTdlibService.createClient).not.toHaveBeenCalled();
    });

    it('should handle rate limiting', async () => {
      const phoneNumber = '+1234567890';
      const userId = 'user-123';

      mockRedisService.get.mockImplementation((key: string) => {
        if (key.includes('ratelimit')) {
          return '10'; // Exceeds max attempts
        }
        return null;
      });

      await expect(service.requestCode(phoneNumber, userId)).rejects.toThrow(
        'Rate limit exceeded',
      );
    });

    it('should create session when already authorized', async () => {
      const phoneNumber = '+1234567890';
      const userId = 'user-123';
      const clientId = 'client-456';

      mockTdlibService.createClient.mockResolvedValue({ id: clientId });
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.telegramAccount.findFirst.mockResolvedValue({
        id: 'account-789',
        phone: phoneNumber,
        userId,
      });
      mockPrismaService.accountSession.upsert.mockResolvedValue({});

      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateReady',
      );
      jest.spyOn(service as any, 'linkAccountWithSession').mockResolvedValue('account-789');

      const result = await service.requestCode(phoneNumber, userId);

      expect(result.clientId).toBe(clientId);
      expect(mockSessionStore.saveSession).toHaveBeenCalled();
    });
  });

  describe('confirmCode', () => {
    it('should confirm code successfully', async () => {
      const phoneNumber = '+1234567890';
      const code = '12345';
      const userId = 'user-123';
      const clientId = 'client-456';

      mockRedisService.get.mockResolvedValue(
        JSON.stringify({ clientId, expiresAt: Date.now() + 60000 }),
      );
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateReady',
      );
      jest.spyOn(service as any, 'linkAccountWithSession').mockResolvedValue('account-789');

      const result = await service.confirmCode(phoneNumber, code, userId);

      expect(result.clientId).toBe(clientId);
      expect(mockTdlibService.send).toHaveBeenCalled();
      expect(mockSessionStore.saveSession).toHaveBeenCalled();
      expect(mockRedisService.del).toHaveBeenCalled();
    });

    it('should handle 2FA password requirement', async () => {
      const phoneNumber = '+1234567890';
      const code = '12345';
      const userId = 'user-123';
      const clientId = 'client-456';

      mockRedisService.get.mockResolvedValue(
        JSON.stringify({ clientId, expiresAt: Date.now() + 60000 }),
      );
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateWaitPassword',
      );

      const result = await service.confirmCode(phoneNumber, code, userId);

      expect(result.clientId).toBe(clientId);
      expect(mockSessionStore.saveSession).toHaveBeenCalled();
      expect(mockRedisService.del).not.toHaveBeenCalled(); // Don't delete yet, password needed
    });

    it('should throw error when code expired', async () => {
      mockRedisService.get.mockResolvedValue(null);

      await expect(
        service.confirmCode('+1234567890', '12345', 'user-123'),
      ).rejects.toThrow('AUTH_CODE_EXPIRED_OR_NOT_FOUND');
    });
  });

  describe('confirmPassword', () => {
    it('should confirm password successfully', async () => {
      const clientId = 'client-456';
      const password = 'password123';
      const session = {
        clientId,
        phoneNumber: '+1234567890',
        userId: 'user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSessionStore.getSession.mockResolvedValue(session);
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateReady',
      );
      jest.spyOn(service as any, 'linkAccountWithSession').mockResolvedValue('account-789');

      const result = await service.confirmPassword(clientId, password);

      expect(result.clientId).toBe(clientId);
      expect(mockTdlibService.send).toHaveBeenCalled();
      expect(mockSessionStore.saveSession).toHaveBeenCalled();
    });

    it('should throw error when session not found', async () => {
      mockSessionStore.getSession.mockResolvedValue(null);

      await expect(service.confirmPassword('non-existent', 'password')).rejects.toThrow(
        'SESSION_NOT_FOUND',
      );
    });

    it('should throw error when password authentication fails', async () => {
      const session = {
        clientId: 'client-456',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSessionStore.getSession.mockResolvedValue(session);
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateWaitCode',
      );

      await expect(service.confirmPassword('client-456', 'wrong-password')).rejects.toThrow(
        'PASSWORD_AUTHENTICATION_FAILED',
      );
    });
  });

  describe('resendCode', () => {
    it('should resend code successfully', async () => {
      const phoneNumber = '+1234567890';
      const clientId = 'client-456';

      mockRedisService.get.mockResolvedValue(
        JSON.stringify({ clientId, expiresAt: Date.now() + 60000 }),
      );
      jest.spyOn(service as any, 'waitForAuthorizationState').mockResolvedValue(
        'authorizationStateWaitCode',
      );

      const result = await service.resendCode(phoneNumber);

      expect(result.clientId).toBe(clientId);
      expect(mockTdlibService.send).toHaveBeenCalled();
    });

    it('should throw error when code expired', async () => {
      mockRedisService.get.mockResolvedValue(null);

      await expect(service.resendCode('+1234567890')).rejects.toThrow(
        'AUTH_CODE_EXPIRED_OR_NOT_FOUND',
      );
    });
  });

  describe('cancelAuth', () => {
    it('should cancel auth successfully', async () => {
      const phoneNumber = '+1234567890';
      const clientId = 'client-456';

      mockRedisService.get.mockResolvedValue(JSON.stringify({ clientId }));

      await service.cancelAuth(phoneNumber);

      expect(mockTdlibService.destroyClient).toHaveBeenCalledWith(clientId);
      expect(mockRedisService.del).toHaveBeenCalled();
    });

    it('should handle missing auth key gracefully', async () => {
      mockRedisService.get.mockResolvedValue(null);

      await service.cancelAuth('+1234567890');

      expect(mockTdlibService.destroyClient).not.toHaveBeenCalled();
    });
  });

  describe('waitForAuthorizationState', () => {
    it('should return state when expected state reached', async () => {
      const clientId = 'client-456';
      const expectedStates = ['authorizationStateWaitCode', 'authorizationStateReady'];

      mockTdlibService.receive.mockReturnValue({
        '@type': 'updateAuthorizationState',
        authorization_state: {
          '@type': 'authorizationStateWaitCode',
        },
      });

      const result = await (service as any).waitForAuthorizationState(clientId, expectedStates);

      expect(result).toBe('authorizationStateWaitCode');
    });

    it('should handle timeout', async () => {
      const clientId = 'client-456';
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'TDLIB_AUTH_WAIT_TIMEOUT_MS') return 100; // Short timeout for test
        return 60000;
      });

      mockTdlibService.receive.mockReturnValue(null);

      const result = await (service as any).waitForAuthorizationState(
        clientId,
        ['authorizationStateWaitCode'],
      );

      expect(result).toBeNull();
    });

    it('should handle authorization closed state', async () => {
      const clientId = 'client-456';

      mockTdlibService.receive.mockReturnValue({
        '@type': 'updateAuthorizationState',
        authorization_state: {
          '@type': 'authorizationStateClosed',
        },
      });

      await expect(
        (service as any).waitForAuthorizationState(clientId, ['authorizationStateWaitCode']),
      ).rejects.toThrow('AUTHORIZATION_CLOSED');
    });
  });
});
