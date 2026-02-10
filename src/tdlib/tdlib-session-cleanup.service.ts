import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TdlibSessionStore } from './tdlib-session.store';
import { TdlibService } from './tdlib.service';

/**
 * Service that periodically cleans up expired TDLib sessions
 */
@Injectable()
export class TdlibSessionCleanupService implements OnModuleInit {
  private readonly logger = new Logger(TdlibSessionCleanupService.name);
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly cleanupIntervalMs: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly tdlibService: TdlibService,
  ) {
    // Default: cleanup every hour
    this.cleanupIntervalMs =
      this.configService.get<number>('TDLIB_SESSION_CLEANUP_INTERVAL_MS', 3600_000) || 3600_000;
  }

  async onModuleInit() {
    const enabled = this.configService.get<boolean>('TDLIB_SESSION_CLEANUP_ENABLED', true);
    if (!enabled) {
      this.logger.warn('TDLib session cleanup disabled via TDLIB_SESSION_CLEANUP_ENABLED=false');
      return;
    }

    this.startCleanup();
  }

  /**
   * Start periodic cleanup
   */
  startCleanup(): void {
    if (this.cleanupInterval) {
      this.logger.warn('Cleanup already started');
      return;
    }

    this.logger.log('Starting TDLib session cleanup', {
      intervalMs: this.cleanupIntervalMs,
    });

    // Run cleanup immediately on start
    this.runCleanup().catch((error) => {
      this.logger.error('Error in initial cleanup', {
        error: error instanceof Error ? error.message : String(error),
      });
    });

    // Schedule periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup().catch((error) => {
        this.logger.error('Error in periodic cleanup', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }, this.cleanupIntervalMs);
  }

  /**
   * Stop periodic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      this.logger.log('TDLib session cleanup stopped');
    }
  }

  /**
   * Run cleanup of expired sessions
   */
  private async runCleanup(): Promise<void> {
    try {
      const cleanedCount = await this.sessionStore.cleanupExpiredSessions();
      
      if (cleanedCount > 0) {
        this.logger.log('Session cleanup completed', { cleanedCount });
        
        // Also destroy clients for expired sessions
        // Note: This is handled by the session store, but we could add additional cleanup here
      }
    } catch (error) {
      this.logger.error('Failed to run session cleanup', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
