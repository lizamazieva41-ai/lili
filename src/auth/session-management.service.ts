import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../config/redis.service';
import { PrismaService } from '../config/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export interface SessionInfo {
  sessionId: string;
  userId: string;
  token: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: SessionInfo;
  reason?: string;
}

@Injectable()
export class SessionManagementService {
  private readonly logger = new Logger(SessionManagementService.name);
  private readonly MAX_CONCURRENT_SESSIONS = 3;
  private readonly SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
  private readonly REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60; // 14 days in seconds

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  /**
   * Create new session with advanced management
   */
  async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    options: {
      ipAddress?: string;
      userAgent?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<SessionInfo> {
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = options.expiresAt || new Date(now.getTime() + this.SESSION_TTL * 1000);

    // Check concurrent sessions limit
    await this.enforceSessionLimit(userId);

    // Create session in database
    const dbSession = await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId,
        token,
        refreshToken,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        isActive: true,
        expiresAt,
      },
    });

    // Store session metadata in Redis for fast access
    const sessionInfo: SessionInfo = {
      sessionId: dbSession.id,
      userId: dbSession.userId,
      token: dbSession.token,
      refreshToken: dbSession.refreshToken || '',
      ipAddress: dbSession.ipAddress || undefined,
      userAgent: dbSession.userAgent || undefined,
      isActive: dbSession.isActive,
      expiresAt: dbSession.expiresAt,
      createdAt: dbSession.createdAt,
      lastActivityAt: now,
    };

    await this.storeSessionInRedis(sessionInfo);

    // Log session creation
    await this.logSessionActivity(sessionId, 'SESSION_CREATED', {
      userId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });

    this.logger.log(`Session created for user ${userId}: ${sessionId}`);
    return sessionInfo;
  }

  /**
   * Validate session with comprehensive checks
   */
  async validateSession(token: string, context: {
    ipAddress?: string;
    userAgent?: string;
  } = {}): Promise<SessionValidationResult> {
    try {
      // Check Redis first for performance
      let sessionInfo = await this.getSessionFromRedis(token);

      // If not in Redis, check database
      if (!sessionInfo) {
        const dbSession = await this.prisma.userSession.findFirst({
          where: { token, isActive: true },
          include: { user: { select: { isActive: true } } },
        });

        if (!dbSession) {
          return { isValid: false, reason: 'Session not found' };
        }

        if (!dbSession.user.isActive) {
          return { isValid: false, reason: 'User is inactive' };
        }

        sessionInfo = await this.mapDbSessionToSessionInfo(dbSession);

        // Store back in Redis
        await this.storeSessionInRedis(sessionInfo);
      }

      // Check expiry
      if (new Date() > sessionInfo.expiresAt) {
        await this.invalidateSession(sessionInfo.sessionId, 'SESSION_EXPIRED');
        return { isValid: false, reason: 'Session expired' };
      }

      // IP-based security check (if enabled)
      if (context.ipAddress && sessionInfo.ipAddress) {
        const ipCheck = await this.validateIpAddress(
          sessionInfo.userId,
          context.ipAddress,
          sessionInfo.ipAddress
        );
        if (!ipCheck.isValid) {
          await this.logSecurityEvent(sessionInfo.userId, 'IP_MISMATCH', {
            sessionId: sessionInfo.sessionId,
            expectedIp: sessionInfo.ipAddress,
            actualIp: context.ipAddress,
          });
          // Still allow session but log for monitoring
        }
      }

      // Update last activity
      sessionInfo.lastActivityAt = new Date();
      await this.updateLastActivity(sessionInfo.sessionId);

      return { isValid: true, session: sessionInfo };
    } catch (error) {
      this.logger.error(`Session validation error: ${(error as Error).message}`);
      return { isValid: false, reason: 'Validation error' };
    }
  }

  /**
   * Invalidate session with reason
   */
  async invalidateSession(sessionId: string, reason: string = 'MANUAL_LOGOUT'): Promise<void> {
    // Update database
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    // Remove from Redis
    const session = await this.getSessionFromRedisBySessionId(sessionId);
    if (session) {
      await this.redisService.del(`session:${session.token}`);
    }

    // Log activity
    await this.logSessionActivity(sessionId, 'SESSION_INVALIDATED', { reason });

    this.logger.log(`Session invalidated: ${sessionId}, reason: ${reason}`);
  }

  /**
   * Invalidate all user sessions
   */
  async invalidateAllUserSessions(userId: string, reason: string = 'ACCOUNT_ACTION'): Promise<void> {
    // Get all active sessions
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, isActive: true },
    });

    // Invalidate each session
    for (const session of sessions) {
      await this.invalidateSession(session.id, reason);
    }

    this.logger.log(`All sessions invalidated for user ${userId}, reason: ${reason}`);
  }

  /**
   * Refresh session with rotation strategy
   */
  async refreshSession(refreshToken: string, newToken: string, context: {
    ipAddress?: string;
    userAgent?: string;
  } = {}): Promise<SessionInfo | null> {
    // Find session by refresh token
    const session = await this.prisma.userSession.findFirst({
      where: { refreshToken, isActive: true },
    });

    if (!session) {
      return null;
    }

    // Check if refresh token is expired
    const now = new Date();
    const refreshTokenExpiry = new Date(session.createdAt.getTime() + this.REFRESH_TOKEN_TTL * 1000);
    if (now > refreshTokenExpiry) {
      await this.invalidateSession(session.id, 'REFRESH_TOKEN_EXPIRED');
      return null;
    }

    // Generate new session ID and update
    const newSessionId = uuidv4();
    const newExpiresAt = new Date(now.getTime() + this.SESSION_TTL * 1000);

    // Update database
    const updatedSession = await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        id: newSessionId,
        token: newToken,
        ipAddress: context.ipAddress || session.ipAddress,
        userAgent: context.userAgent || session.userAgent,
        expiresAt: newExpiresAt,
      },
    });

    // Remove old session from Redis
    await this.redisService.del(`session:${session.token}`);

    // Store new session in Redis
    const sessionInfo: SessionInfo = {
      sessionId: updatedSession.id,
      userId: updatedSession.userId,
      token: updatedSession.token,
      refreshToken: updatedSession.refreshToken || '',
      ipAddress: updatedSession.ipAddress ?? undefined,
      userAgent: updatedSession.userAgent ?? undefined,
      isActive: updatedSession.isActive,
      expiresAt: updatedSession.expiresAt,
      createdAt: updatedSession.createdAt,
      lastActivityAt: now,
    };

    await this.storeSessionInRedis(sessionInfo);

    // Log refresh
    await this.logSessionActivity(sessionInfo.sessionId, 'SESSION_REFRESHED', {
      oldSessionId: session.id,
    });

    return sessionInfo;
  }

  /**
   * Get all active sessions for user
   */
  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(sessions.map(session => this.mapDbSessionToSessionInfo(session)));
  }

  /**
   * Enforce concurrent session limit
   */
  private async enforceSessionLimit(userId: string): Promise<void> {
    const activeSessions = await this.prisma.userSession.count({
      where: { userId, isActive: true },
    });

    if (activeSessions >= this.MAX_CONCURRENT_SESSIONS) {
      // Get oldest sessions to deactivate
      const oldestSessions = await this.prisma.userSession.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'asc' },
        take: activeSessions - this.MAX_CONCURRENT_SESSIONS + 1,
      });

      for (const oldSession of oldestSessions) {
        await this.invalidateSession(oldSession.id, 'SESSION_LIMIT_EXCEEDED');
      }
    }
  }

  /**
   * Store session in Redis for fast access
   */
  private async storeSessionInRedis(session: SessionInfo): Promise<void> {
    const key = `session:${session.token}`;
    await this.redisService.set(key, JSON.stringify(session), this.SESSION_TTL);
  }

  /**
   * Get session from Redis
   */
  private async getSessionFromRedis(token: string): Promise<SessionInfo | null> {
    const key = `session:${token}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get session by session ID from Redis
   */
  private async getSessionFromRedisBySessionId(sessionId: string): Promise<SessionInfo | null> {
    // This is inefficient - in production, maintain a token->sessionId index
    const sessions = await this.prisma.userSession.findMany({
      where: { id: sessionId, isActive: true },
    });

    if (sessions.length === 0) {
      return null;
    }

    return await this.getSessionFromRedis(sessions[0].token);
  }

  /**
   * Map database session to session info
   */
  private async mapDbSessionToSessionInfo(dbSession: any): Promise<SessionInfo> {
    return {
      sessionId: dbSession.id,
      userId: dbSession.userId,
      token: dbSession.token,
      refreshToken: dbSession.refreshToken || '',
      ipAddress: dbSession.ipAddress || undefined,
      userAgent: dbSession.userAgent || undefined,
      isActive: dbSession.isActive,
      expiresAt: dbSession.expiresAt,
      createdAt: dbSession.createdAt,
      lastActivityAt: dbSession.createdAt, // Will be updated separately
    };
  }

  /**
   * Update last activity timestamp
   */
  private async updateLastActivity(sessionId: string): Promise<void> {
    const key = `session_activity:${sessionId}`;
    await this.redisService.set(key, Date.now().toString(), this.SESSION_TTL);

    // Optionally update database periodically
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });
  }

  /**
   * Log session activity
   */
  private async logSessionActivity(sessionId: string, action: string, metadata?: any): Promise<void> {
    await this.prisma.sessionActivity.create({
      data: {
        sessionId,
        action,
        details: metadata || {},
        ipAddress: metadata?.ipAddress,
      },
    });
  }

  /**
   * Log security events
   */
  private async logSecurityEvent(userId: string, event: string, metadata?: any): Promise<void> {
    await this.prisma.authAuditLog.create({
      data: {
        userId,
        event,
        metadata: metadata || {},
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });
  }

  /**
   * Validate IP address with flexible rules
   */
  private async validateIpAddress(
    userId: string,
    currentIp: string,
    storedIp: string
  ): Promise<{ isValid: boolean; risk: string }> {
    // Allow localhost in development
    if (this.configService.get('NODE_ENV') === 'development') {
      if (currentIp.includes('127.0.0.1') || storedIp.includes('127.0.0.1')) {
        return { isValid: true, risk: 'LOW' };
      }
    }

    // Exact match
    if (currentIp === storedIp) {
      return { isValid: true, risk: 'LOW' };
    }

    // Check if IPs are in same subnet (simplified)
    if (this.getSubnet(currentIp) === this.getSubnet(storedIp)) {
      return { isValid: true, risk: 'MEDIUM' };
    }

    // Different IPs - log but allow (can be configured to be stricter)
    return { isValid: true, risk: 'HIGH' };
  }

  /**
   * Get subnet from IP (simplified)
   */
  private getSubnet(ip: string): string {
    const parts = ip.split('.');
    return parts.slice(0, 3).join('.');
  }
}