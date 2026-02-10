import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { TelegramOAuthService } from '../../src/auth/telegram-oauth.service';
import { SessionManagementService } from '../../src/auth/session-management.service';
import { CsrfService } from '../../src/common/services/csrf.service';
import { EnhancedJwtAuthGuard } from '../../src/auth/guards/enhanced-jwt-auth.guard';
import { ApiKeyAuthGuard } from '../../src/auth/guards/api-key-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let telegramOAuthService: TelegramOAuthService;
  let sessionManagementService: SessionManagementService;

  const mockUser = {
    id: 'user-1',
    telegramId: 123456789,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    language: 'vi',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService = {
    login: jest.fn(),
    refreshTokenWithRotation: jest.fn(),
  };

  const mockTelegramOAuthService = {
    generateAuthUrl: jest.fn(),
    validateCallback: jest.fn(),
  };

  const mockSessionManagementService = {
    invalidateSession: jest.fn(),
    invalidateAllUserSessions: jest.fn(),
    getUserSessions: jest.fn(),
    validateSession: jest.fn(),
  };

  const mockCsrfService = {
    generateToken: jest.fn(),
    validateToken: jest.fn(),
    getTokenForSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: TelegramOAuthService,
          useValue: mockTelegramOAuthService,
        },
        {
          provide: SessionManagementService,
          useValue: mockSessionManagementService,
        },
        {
          provide: CsrfService,
          useValue: mockCsrfService,
        },
        ConfigService,
      ],
    })
      .overrideGuard(EnhancedJwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ApiKeyAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    telegramOAuthService = module.get<TelegramOAuthService>(TelegramOAuthService);
    sessionManagementService = module.get<SessionManagementService>(SessionManagementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initiateTelegramOAuth', () => {
    it('should generate OAuth URL', async () => {
      const mockAuthUrl = 'https://oauth.telegram.org/auth?bot_id=123&state=test';
      const mockStateId = 'state-123';

      mockTelegramOAuthService.generateAuthUrl.mockResolvedValue({
        authUrl: mockAuthUrl,
        stateId: mockStateId,
      });

      const result = await controller.initiateTelegramOAuth({
        redirectUri: 'http://localhost:3000/callback',
      });

      expect(telegramOAuthService.generateAuthUrl).toHaveBeenCalledWith('http://localhost:3000/callback');

      expect(result).toEqual({
        success: true,
        data: {
          authUrl: mockAuthUrl,
          stateId: mockStateId,
          expiresIn: 600,
        },
      });
    });
  });

  describe('telegramCallback', () => {
    it('should handle Telegram callback successfully', async () => {
      const mockTelegramData = {
        id: '123456789',
        first_name: 'Test',
        username: 'testuser',
        auth_date: '1640995200',
        hash: 'testhash',
        state: 'state-123',
      };

      const mockLoginResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: '24h',
        tokenType: 'Bearer',
        sessionInfo: {
          sessionId: 'session-123',
          expiresAt: new Date(),
        },
        user: mockUser,
      };

      mockTelegramOAuthService.validateCallback.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await controller.telegramCallback(mockTelegramData as any, {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any);

      expect(telegramOAuthService.validateCallback).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual({
        success: true,
        data: mockLoginResult,
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token with rotation', async () => {
      const mockRefreshResult = {
        accessToken: 'new-access-token',
        expiresIn: '24h',
        tokenType: 'Bearer',
        sessionInfo: {
          sessionId: 'new-session-123',
          expiresAt: new Date(),
        },
      };

      mockAuthService.refreshTokenWithRotation.mockResolvedValue(mockRefreshResult);

      const result = await controller.refreshToken({ refreshToken: 'old-refresh-token' } as any, {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any);

      expect(authService.refreshTokenWithRotation).toHaveBeenCalledWith('old-refresh-token', {
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });

      expect(result).toEqual({
        success: true,
        data: mockRefreshResult,
      });
    });
  });

  describe('logout', () => {
    it('should logout user from current session', async () => {
      const mockSession = {
        sessionId: 'session-123',
      };

      mockSessionManagementService.invalidateSession.mockResolvedValue(undefined);

      const result = await controller.logout(
        ({ ...mockUser, session: mockSession } as any),
        {
          ip: '127.0.0.1',
          headers: { 'user-agent': 'test-agent' },
        } as any
      );

      expect(sessionManagementService.invalidateSession).toHaveBeenCalledWith(
        'session-123',
        'MANUAL_LOGOUT'
      );

      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('getSessions', () => {
    it('should return user sessions', async () => {
      const mockSessions = [
        {
          sessionId: 'session-1',
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
          createdAt: new Date(),
          lastActivityAt: new Date(),
          expiresAt: new Date(),
        },
      ];

      mockSessionManagementService.getUserSessions.mockResolvedValue(mockSessions);

      const result = await controller.getSessions({ ...(mockUser as any), session: { sessionId: 'session-1' } } as any);

      expect(sessionManagementService.getUserSessions).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        success: true,
        data: {
          sessions: mockSessions.map(session => ({
            ...session,
            isCurrent: true,
          })),
        },
      });
    });
  });

  describe('validateSession', () => {
    it('should validate current session', async () => {
      const mockSession = {
        sessionId: 'session-123',
        expiresAt: new Date(),
      };

      const result = await controller.validateSession({
        ...mockUser,
        session: mockSession,
      } as any);

      expect(result).toEqual({
        success: true,
        data: {
          valid: true,
          user: {
            id: mockUser.id,
            telegramId: mockUser.telegramId,
            username: mockUser.username,
          },
          session: {
            expiresAt: mockSession.expiresAt,
          },
        },
      });
    });
  });
});