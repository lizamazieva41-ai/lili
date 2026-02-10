import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TdlibService } from './tdlib.service';
import { TdlibSessionStore } from './tdlib-session.store';
import { CustomLoggerService } from '../common/services/logger.service';
import { TdlibUpdateDispatcher } from './tdlib-update-dispatcher.service';

/**
 * Service that polls TDLib for updates from all active clients
 * and dispatches them to appropriate handlers
 */
@Injectable()
export class TdlibUpdatePollingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TdlibUpdatePollingService.name);
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private readonly pollIntervalMs: number;
  private readonly pollTimeoutSeconds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly tdlibService: TdlibService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly customLogger: CustomLoggerService,
    private readonly updateDispatcher: TdlibUpdateDispatcher,
  ) {
    this.pollIntervalMs = this.configService.get<number>('TDLIB_POLL_INTERVAL_MS', 100) || 100;
    this.pollTimeoutSeconds = this.configService.get<number>('TDLIB_POLL_TIMEOUT_SECONDS', 1.0) || 1.0;
  }

  async onModuleInit() {
    const enabled = this.configService.get<boolean>('TDLIB_UPDATE_POLLING_ENABLED', true);
    if (!enabled) {
      this.logger.warn('TDLib update polling disabled via TDLIB_UPDATE_POLLING_ENABLED=false');
      return;
    }

    if (!this.tdlibService.isReady()) {
      this.logger.warn('TDLib service not ready, polling will not start');
      return;
    }

    this.startPolling();
  }

  onModuleDestroy() {
    this.stopPolling();
  }

  /**
   * Start polling for updates
   */
  startPolling(): void {
    if (this.isPolling) {
      this.logger.warn('Polling already started');
      return;
    }

    this.isPolling = true;
    this.logger.log('Starting TDLib update polling', {
      intervalMs: this.pollIntervalMs,
      timeoutSeconds: this.pollTimeoutSeconds,
    });

    // Start polling loop
    this.pollingInterval = setInterval(() => {
      this.pollUpdates().catch((error) => {
        this.logger.error('Error in polling loop', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }, this.pollIntervalMs);
  }

  /**
   * Stop polling for updates
   */
  stopPolling(): void {
    if (!this.isPolling) {
      return;
    }

    this.isPolling = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    this.logger.log('TDLib update polling stopped');
  }

  /**
   * Poll updates from all active clients
   */
  private async pollUpdates(): Promise<void> {
    try {
      // Get all active sessions
      const sessions = await this.sessionStore.getAllActiveSessions();
      
      if (sessions.length === 0) {
        return; // No active sessions to poll
      }

      // Poll each client
      const pollPromises = sessions.map((session) =>
        this.pollClientUpdates(session.clientId).catch((error) => {
          this.logger.warn('Error polling client updates', {
            clientId: session.clientId,
            error: error instanceof Error ? error.message : String(error),
          });
        }),
      );

      await Promise.allSettled(pollPromises);
    } catch (error) {
      this.logger.error('Error in pollUpdates', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Poll updates from a specific client
   */
  private async pollClientUpdates(clientId: string): Promise<void> {
    try {
      // Receive updates with timeout
      const update = this.tdlibService.receive(clientId, this.pollTimeoutSeconds);
      
      if (!update) {
        return; // No update available
      }

      // Dispatch update to handlers
      await this.updateDispatcher.dispatch(clientId, update);
    } catch (error) {
      // Log but don't throw - continue polling other clients
      this.logger.debug('Error receiving update from client', {
        clientId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get polling status
   */
  getStatus(): { isPolling: boolean; intervalMs: number; timeoutSeconds: number } {
    return {
      isPolling: this.isPolling,
      intervalMs: this.pollIntervalMs,
      timeoutSeconds: this.pollTimeoutSeconds,
    };
  }
}
