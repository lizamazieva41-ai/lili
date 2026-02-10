import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SessionManagementService } from './session-management.service';
import { JwtPayload } from '../common/interfaces/common.interfaces';

/**
 * Authentication service handling user authentication, token generation, and session management
 * 
 * @class AuthService
 * @description Provides methods for user validation, login, token refresh, and logout operations
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionManagementService: SessionManagementService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validate user by Telegram ID
   * 
   * @param {number} telegramId - Telegram user ID
   * @param {string} [username] - Optional username for additional validation
   * @returns {Promise<any>} User object if valid and active, null otherwise
   */
  async validateUser(telegramId: number, username?: string): Promise<any> {
    const user = await this.usersService.findByTelegramId(telegramId);
    if (user && user.isActive) {
      return user;
    }
    return null;
  }

  /**
   * Authenticate user and generate JWT tokens
   * 
   * @param {any} user - User object from database
   * @param {Object} context - Authentication context
   * @param {string} [context.ipAddress] - Client IP address
   * @param {string} [context.userAgent] - Client user agent
   * @returns {Promise<Object>} Authentication response with tokens and user info
   * @throws {UnauthorizedException} If user is not active or validation fails
   */
  async login(user: any, context: {
    ipAddress?: string;
    userAgent?: string;
  } = {}) {
    const payload: JwtPayload = {
      sub: user.id,
      telegramId: user.telegramId,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Create advanced session
    const session = await this.sessionManagementService.createSession(
      user.id,
      accessToken,
      refreshToken,
      context,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
      tokenType: 'Bearer',
      sessionInfo: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
      },
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };
  }

  async refreshTokenWithRotation(
    refreshToken: string, 
    context: {
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ) {
    try {
      // Validate refresh token format
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Get user
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new access token
      const newPayload: JwtPayload = {
        sub: user.id,
        telegramId: user.telegramId,
        username: user.username,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      // Rotate session
      const rotatedSession = await this.sessionManagementService.refreshSession(
        refreshToken,
        newAccessToken,
        context
      );

      if (!rotatedSession) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        accessToken: newAccessToken,
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
        tokenType: 'Bearer',
        sessionInfo: {
          sessionId: rotatedSession.sessionId,
          expiresAt: rotatedSession.expiresAt,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateToken(token: string, context: {
    ipAddress?: string;
    userAgent?: string;
  } = {}) {
    const validation = await this.sessionManagementService.validateSession(token, context);
    
    if (!validation.isValid) {
      throw new UnauthorizedException(`Token invalid: ${validation.reason}`);
    }

    return validation.session;
  }

  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.sessionManagementService.invalidateSession(sessionId, 'MANUAL_LOGOUT');
    } else {
      await this.sessionManagementService.invalidateAllUserSessions(userId, 'MANUAL_LOGOUT');
    }
  }

  async revokeAllSessions(userId: string) {
    await this.sessionManagementService.invalidateAllUserSessions(userId, 'ACCOUNT_REVOCATION');
  }

  async getUserSessions(userId: string) {
    return this.sessionManagementService.getUserSessions(userId);
  }
}