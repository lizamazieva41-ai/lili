import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../config/redis.service';
import { PrismaService } from '../config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../common/services/logger.service';
import { EncryptionService } from '../common/services/encryption.service';

export interface TdlibSession {
  clientId: string;
  userId?: string;
  accountId?: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string;
  lastActivityAt?: string;
}

@Injectable()
export class TdlibSessionStore {
  private readonly logger = new Logger(TdlibSessionStore.name);
  private readonly sessionKeyPrefix = 'tdlib:session:';
  private readonly sessionTtlSeconds: number;
  private readonly enableDbBackup: boolean;

  private readonly enableSessionEncryption: boolean;

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly customLogger: CustomLoggerService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.sessionTtlSeconds =
      this.configService.get<number>('TDLIB_SESSION_TTL_SECONDS', 86400 * 7) ||
      86400 * 7; // 7 days default
    this.enableDbBackup =
      this.configService.get<boolean>('TDLIB_SESSION_DB_BACKUP', true) ?? true;
    this.enableSessionEncryption =
      this.configService.get<boolean>('TDLIB_SESSION_ENCRYPTION_ENABLED', true) ?? true;
  }

  /**
   * Save session to Redis and optionally to DB
   */
  async saveSession(session: TdlibSession): Promise<void> {
    const key = this.buildKey(session.clientId);
    const now = new Date().toISOString();
    const payload: TdlibSession = {
      ...session,
      createdAt: session.createdAt ?? now,
      updatedAt: now,
      lastActivityAt: now,
    };

    // Serialize and optionally encrypt session data
    const serialized = JSON.stringify(payload);
    const dataToStore = this.enableSessionEncryption
      ? this.encryptionService.encrypt(serialized)
      : serialized;

    // Save to Redis with TTL
    await this.redisService.set(key, dataToStore, this.sessionTtlSeconds);

    // Backup to DB if enabled (encrypted if encryption is enabled)
    if (this.enableDbBackup && session.accountId) {
      try {
        await this.backupSessionToDb(payload, this.enableSessionEncryption ? dataToStore : serialized);
      } catch (error) {
        this.logger.warn('Failed to backup session to DB', {
          clientId: session.clientId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    this.logger.debug('Session saved', { clientId: session.clientId, encrypted: this.enableSessionEncryption });
  }

  /**
   * Get session from Redis
   */
  async getSession(clientId: string): Promise<TdlibSession | null> {
    const key = this.buildKey(clientId);
    const raw = await this.redisService.get(key);
    if (!raw) {
      // Try to restore from DB if Redis miss
      if (this.enableDbBackup) {
        return await this.restoreSessionFromDb(clientId);
      }
      return null;
    }

    // Decrypt if encrypted
    let decrypted: string;
    try {
      if (this.enableSessionEncryption && this.encryptionService.isEncrypted(raw)) {
        decrypted = this.encryptionService.decrypt(raw);
      } else {
        decrypted = raw;
      }
    } catch (error) {
      this.logger.error('Failed to decrypt session data', {
        clientId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }

    const session = JSON.parse(decrypted) as TdlibSession;
    
    // Update last activity
    session.lastActivityAt = new Date().toISOString();
    await this.saveSession(session); // Re-save with updated timestamp

    return session;
  }

  /**
   * Get all sessions for a user
   */
  async getSessionsByUserId(userId: string): Promise<TdlibSession[]> {
    if (!this.enableDbBackup) {
      // Without DB backup, we can't efficiently query by userId
      this.logger.warn('Cannot get sessions by userId without DB backup enabled');
      return [];
    }

    try {
      // Query DB for sessions with this userId
      const sessions = await this.prisma.accountSession.findMany({
        where: {
          account: {
            userId,
          },
          isActive: true,
        },
        include: {
          account: true,
        },
      });

      // Load full session data from Redis
      const result: TdlibSession[] = [];
      for (const dbSession of sessions) {
        const sessionData = dbSession.sessionData as any;
        if (sessionData?.clientId) {
          const redisSession = await this.getSession(sessionData.clientId);
          if (redisSession) {
            result.push(redisSession);
          }
        }
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get sessions by userId', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Get all sessions for an account
   */
  async getSessionsByAccountId(accountId: string): Promise<TdlibSession[]> {
    if (!this.enableDbBackup) {
      return [];
    }

    try {
      const sessions = await this.prisma.accountSession.findMany({
        where: {
          accountId,
          isActive: true,
        },
      });

      const result: TdlibSession[] = [];
      for (const dbSession of sessions) {
        const sessionData = dbSession.sessionData as any;
        if (sessionData?.clientId) {
          const redisSession = await this.getSession(sessionData.clientId);
          if (redisSession) {
            result.push(redisSession);
          }
        }
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get sessions by accountId', {
        accountId,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Revoke a session
   */
  async revokeSession(clientId: string): Promise<void> {
    const existing = await this.getSession(clientId);
    if (!existing) {
      this.logger.warn('Attempted to revoke non-existent session', { clientId });
      return;
    }

    existing.revokedAt = new Date().toISOString();
    await this.saveSession(existing);

    // Also mark as inactive in DB if backed up
    if (this.enableDbBackup && existing.accountId) {
      try {
        await this.prisma.accountSession.updateMany({
          where: {
            accountId: existing.accountId,
            sessionData: {
              path: ['clientId'],
              equals: clientId,
            },
          },
          data: {
            isActive: false,
          },
        });
      } catch (error) {
        this.logger.warn('Failed to update DB session on revoke', {
          clientId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    this.logger.log('Session revoked', { clientId });
  }

  /**
   * Revoke all sessions for an account
   */
  async revokeAccountSessions(accountId: string): Promise<void> {
    const sessions = await this.getSessionsByAccountId(accountId);
    for (const session of sessions) {
      await this.revokeSession(session.clientId);
    }
    this.logger.log('All sessions revoked for account', { accountId, count: sessions.length });
  }

  /**
   * Get all active sessions (non-revoked)
   */
  async getAllActiveSessions(): Promise<TdlibSession[]> {
    if (!this.enableDbBackup) {
      // Without DB backup, we need to scan Redis keys (not efficient)
      this.logger.warn('getAllActiveSessions requires DB backup enabled');
      return [];
    }

    try {
      const sessions = await this.prisma.accountSession.findMany({
        where: {
          isActive: true,
        },
        include: {
          account: true,
        },
      });

      const result: TdlibSession[] = [];
      for (const dbSession of sessions) {
        const sessionData = dbSession.sessionData as any;
        if (sessionData?.clientId) {
          const redisSession = await this.getSession(sessionData.clientId);
          if (redisSession && !redisSession.revokedAt) {
            result.push(redisSession);
          }
        }
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get all active sessions', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    // Redis TTL handles expiration automatically
    // This method is for DB cleanup if needed
    if (!this.enableDbBackup) {
      return 0;
    }

    try {
      const expiredCutoff = new Date();
      expiredCutoff.setSeconds(expiredCutoff.getSeconds() - this.sessionTtlSeconds);

      const result = await this.prisma.accountSession.updateMany({
        where: {
          isActive: true,
          lastUsedAt: {
            lt: expiredCutoff,
          },
        },
        data: {
          isActive: false,
        },
      });

      this.logger.log('Expired sessions cleaned up', { count: result.count });
      return result.count;
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  }

  /**
   * Backup session to database
   */
  private async backupSessionToDb(session: TdlibSession, encryptedData?: string): Promise<void> {
    if (!session.accountId) {
      return; // Can't backup without accountId
    }

    // Store encrypted data if provided, otherwise store minimal data
    const sessionDataToStore = encryptedData
      ? { encrypted: encryptedData }
      : {
          clientId: session.clientId,
          phoneNumber: session.phoneNumber,
          userId: session.userId,
        };

    await this.prisma.accountSession.upsert({
      where: {
        accountId: session.accountId,
      },
      create: {
        accountId: session.accountId,
        sessionData: sessionDataToStore,
        isActive: !session.revokedAt,
        lastUsedAt: session.lastActivityAt
          ? new Date(session.lastActivityAt)
          : new Date(),
        expiresAt: new Date(
          Date.now() + this.sessionTtlSeconds * 1000,
        ),
      },
      update: {
        sessionData: sessionDataToStore,
        isActive: !session.revokedAt,
        lastUsedAt: session.lastActivityAt
          ? new Date(session.lastActivityAt)
          : new Date(),
        expiresAt: new Date(
          Date.now() + this.sessionTtlSeconds * 1000,
        ),
      },
    });
  }

  /**
   * Restore session from database
   */
  private async restoreSessionFromDb(clientId: string): Promise<TdlibSession | null> {
    try {
      const dbSession = await this.prisma.accountSession.findFirst({
        where: {
          sessionData: {
            path: ['clientId'],
            equals: clientId,
          },
          isActive: true,
        },
        include: {
          account: true,
        },
      });

      if (!dbSession) {
        return null;
      }

      const sessionData = dbSession.sessionData as any;
      
      // Check if data is encrypted
      let session: TdlibSession;
      if (sessionData.encrypted) {
        try {
          const decrypted = this.encryptionService.decrypt(sessionData.encrypted);
          session = JSON.parse(decrypted) as TdlibSession;
        } catch (error) {
          this.logger.error('Failed to decrypt session from DB', {
            clientId,
            error: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      } else {
        // Legacy format (not encrypted)
        session = {
          clientId: sessionData.clientId,
          userId: sessionData.userId,
          accountId: dbSession.accountId,
          phoneNumber: sessionData.phoneNumber || dbSession.account.phone,
          createdAt: dbSession.createdAt.toISOString(),
          updatedAt: dbSession.updatedAt.toISOString(),
          lastActivityAt: dbSession.lastUsedAt?.toISOString(),
        };
      }

      // Restore to Redis
      await this.saveSession(session);
      return session;
    } catch (error) {
      this.logger.warn('Failed to restore session from DB', {
        clientId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private buildKey(clientId: string): string {
    return `${this.sessionKeyPrefix}${clientId}`;
  }
}
