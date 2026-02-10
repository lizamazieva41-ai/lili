import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { UsersService } from '../../../src/users/users.service';
import { SessionManagementService } from '../../../src/auth/session-management.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockSessionManagementService: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUsersService = {
      findByTelegramId: jest.fn(),
      findById: jest.fn(),
    };

    mockSessionManagementService = {
      createSession: jest.fn(),
      refreshSession: jest.fn(),
      validateSession: jest.fn(),
      invalidateSession: jest.fn(),
      invalidateAllUserSessions: jest.fn(),
      getUserSessions: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: SessionManagementService, useValue: mockSessionManagementService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if valid and active', async () => {
      const mockUser = { id: '1', telegramId: 123, isActive: true };
      mockUsersService.findByTelegramId.mockResolvedValue(mockUser);

      const result = await service.validateUser(123);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByTelegramId.mockResolvedValue(null);

      const result = await service.validateUser(123);
      expect(result).toBeNull();
    });

    it('should return null if user is inactive', async () => {
      const mockUser = { id: '1', telegramId: 123, isActive: false };
      mockUsersService.findByTelegramId.mockResolvedValue(mockUser);

      const result = await service.validateUser(123);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return tokens and user info on successful login', async () => {
      const mockUser = {
        id: '1',
        telegramId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
      };

      const mockSession = {
        sessionId: 'session-123',
        expiresAt: new Date(),
      };

      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      mockConfigService.get.mockReturnValue('24h');
      mockSessionManagementService.createSession.mockResolvedValue(mockSession);

      const result = await service.login(mockUser, { ipAddress: '127.0.0.1', userAgent: 'Test Agent' });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: '24h',
        tokenType: 'Bearer',
        sessionInfo: {
          sessionId: 'session-123',
          expiresAt: mockSession.expiresAt,
        },
        user: {
          id: '1',
          telegramId: 123,
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          avatar: 'avatar.jpg',
        },
      });
    });
  });

  describe('refreshTokenWithRotation', () => {
    it('should refresh token successfully', async () => {
      const mockPayload = { sub: '1', telegramId: 123, username: 'testuser' };
      const mockUser = { id: '1', telegramId: 123, username: 'testuser', isActive: true };
      const mockRotatedSession = { sessionId: 'new-session-123', expiresAt: new Date() };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockConfigService.get.mockReturnValue('24h');
      mockSessionManagementService.refreshSession.mockResolvedValue(mockRotatedSession);

      const result = await service.refreshTokenWithRotation('refresh-token', { ipAddress: '127.0.0.1' });

      expect(result).toEqual({
        accessToken: 'new-access-token',
        expiresIn: '24h',
        tokenType: 'Bearer',
        sessionInfo: {
          sessionId: 'new-session-123',
          expiresAt: mockRotatedSession.expiresAt,
        },
      });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshTokenWithRotation('invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const mockPayload = { sub: '1', telegramId: 123, username: 'testuser' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.refreshTokenWithRotation('refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const mockPayload = { sub: '1', telegramId: 123, username: 'testuser' };
      const mockUser = { id: '1', telegramId: 123, username: 'testuser', isActive: false };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.findById.mockResolvedValue(mockUser);

      await expect(
        service.refreshTokenWithRotation('refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if session refresh fails', async () => {
      const mockPayload = { sub: '1', telegramId: 123, username: 'testuser' };
      const mockUser = { id: '1', telegramId: 123, username: 'testuser', isActive: true };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockSessionManagementService.refreshSession.mockResolvedValue(null);

      await expect(
        service.refreshTokenWithRotation('refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return session if token is valid', async () => {
      const mockValidation = { isValid: true, session: { sessionId: 'session-123' } };
      mockSessionManagementService.validateSession.mockResolvedValue(mockValidation);

      const result = await service.validateToken('valid-token');
      expect(result).toEqual({ sessionId: 'session-123' });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockValidation = { isValid: false, reason: 'Token expired' };
      mockSessionManagementService.validateSession.mockResolvedValue(mockValidation);

      await expect(service.validateToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should invalidate specific session if sessionId is provided', async () => {
      await service.logout('user-1', 'session-123');
      expect(mockSessionManagementService.invalidateSession).toHaveBeenCalledWith(
        'session-123',
        'MANUAL_LOGOUT',
      );
    });

    it('should invalidate all user sessions if sessionId is not provided', async () => {
      await service.logout('user-1');
      expect(mockSessionManagementService.invalidateAllUserSessions).toHaveBeenCalledWith(
        'user-1',
        'MANUAL_LOGOUT',
      );
    });
  });

  describe('revokeAllSessions', () => {
    it('should invalidate all user sessions', async () => {
      await service.revokeAllSessions('user-1');
      expect(mockSessionManagementService.invalidateAllUserSessions).toHaveBeenCalledWith(
        'user-1',
        'ACCOUNT_REVOCATION',
      );
    });
  });

  describe('getUserSessions', () => {
    it('should return user sessions', async () => {
      const mockSessions = [{ sessionId: 'session-1' }, { sessionId: 'session-2' }];
      mockSessionManagementService.getUserSessions.mockResolvedValue(mockSessions);

      const result = await service.getUserSessions('user-1');
      expect(result).toEqual(mockSessions);
    });
  });
});