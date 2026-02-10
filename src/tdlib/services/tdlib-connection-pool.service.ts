/**
 * TDLib Connection Pool Service
 * 
 * Manages client connection pooling, reuse, health checks, and automatic reconnection
 */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibService } from '../tdlib.service';
import { TdlibHealthService } from './tdlib-health.service';

interface PooledClient {
  clientId: string;
  lastUsed: number;
  useCount: number;
  isHealthy: boolean;
  createdAt: number;
}

@Injectable()
export class TdlibConnectionPoolService implements OnModuleDestroy {
  private readonly pool = new Map<string, PooledClient>();
  private readonly maxPoolSize: number;
  private readonly maxIdleTime: number; // milliseconds
  private readonly healthCheckIntervalMs: number;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(
    private readonly tdlibService: TdlibService,
    private readonly healthService: TdlibHealthService,
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.maxPoolSize = this.configService.get<number>(
      'TDLIB_POOL_MAX_SIZE',
      100,
    );
    this.maxIdleTime = this.configService.get<number>(
      'TDLIB_POOL_MAX_IDLE_TIME_MS',
      30 * 60 * 1000, // 30 minutes default
    );
    this.healthCheckIntervalMs = this.configService.get<number>(
      'TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS',
      60000, // 1 minute default
    );
    this.startHealthChecks();
  }

  async onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    await this.cleanup();
  }

  /**
   * Get or create a client from pool
   */
  async acquireClient(clientId: string): Promise<string> {
    // Check if client exists in pool
    if (this.pool.has(clientId)) {
      const pooled = this.pool.get(clientId)!;
      pooled.lastUsed = Date.now();
      pooled.useCount++;
      
      // Check health before returning
      if (pooled.isHealthy) {
        return clientId;
      } else {
        // Remove unhealthy client and create new one
        this.pool.delete(clientId);
      }
    }

    // Create new client if pool not full
    if (this.pool.size >= this.maxPoolSize) {
      // Evict least recently used
      await this.evictLRU();
    }

    // Create new client
    try {
      this.tdlibService.createClient(clientId);
      this.pool.set(clientId, {
        clientId,
        lastUsed: Date.now(),
        useCount: 1,
        isHealthy: true,
        createdAt: Date.now(),
      });
      return clientId;
    } catch (error) {
      this.logger.error(`Failed to create pooled client: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Release client back to pool
   */
  releaseClient(clientId: string): void {
    if (this.pool.has(clientId)) {
      const pooled = this.pool.get(clientId)!;
      pooled.lastUsed = Date.now();
    }
  }

  /**
   * Remove client from pool
   */
  async removeClient(clientId: string): Promise<void> {
    if (this.pool.has(clientId)) {
      try {
        this.tdlibService.destroyClient(clientId);
      } catch (error) {
        this.logger.warn(`Failed to destroy pooled client: ${error.message}`);
      }
      this.pool.delete(clientId);
    }
  }

  /**
   * Health check for all pooled clients
   */
  private async performHealthChecks(): Promise<void> {
    const now = Date.now();
    const clientsToRemove: string[] = [];

    for (const [clientId, pooled] of this.pool.entries()) {
      // Check if client is idle too long
      if (now - pooled.lastUsed > this.maxIdleTime) {
        clientsToRemove.push(clientId);
        continue;
      }

      // Check client health
      try {
        const health = await this.healthService.checkClientHealth(clientId);
        pooled.isHealthy = health.isHealthy;
      } catch (error) {
        pooled.isHealthy = false;
        clientsToRemove.push(clientId);
      }
    }

    // Remove unhealthy/idle clients
    for (const clientId of clientsToRemove) {
      await this.removeClient(clientId);
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks().catch(error => {
        this.logger.error(`Health check failed: ${error.message}`, error.stack);
      });
    }, this.healthCheckIntervalMs);
  }

  /**
   * Evict least recently used client
   */
  private async evictLRU(): Promise<void> {
    let lruClient: string | null = null;
    let lruTime = Date.now();

    for (const [clientId, pooled] of this.pool.entries()) {
      if (pooled.lastUsed < lruTime) {
        lruTime = pooled.lastUsed;
        lruClient = clientId;
      }
    }

    if (lruClient) {
      await this.removeClient(lruClient);
    }
  }

  /**
   * Cleanup all pooled clients
   */
  private async cleanup(): Promise<void> {
    const clientIds = Array.from(this.pool.keys());
    for (const clientId of clientIds) {
      await this.removeClient(clientId);
    }
  }

  /**
   * Get pool statistics
   */
  getPoolStats(): {
    size: number;
    healthy: number;
    unhealthy: number;
    averageUseCount: number;
  } {
    let healthy = 0;
    let totalUseCount = 0;

    for (const pooled of this.pool.values()) {
      if (pooled.isHealthy) {
        healthy++;
      }
      totalUseCount += pooled.useCount;
    }

    return {
      size: this.pool.size,
      healthy,
      unhealthy: this.pool.size - healthy,
      averageUseCount: this.pool.size > 0 ? totalUseCount / this.pool.size : 0,
    };
  }
}
