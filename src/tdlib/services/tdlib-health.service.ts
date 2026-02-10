/**
 * TDLib Health Service
 * 
 * Provides health check functionality for TDLib integration
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  nativeAddon: {
    loaded: boolean;
    ready: boolean;
  };
  tdlibLibrary: {
    initialized: boolean;
    clientCount: number;
  };
  timestamp: number;
}

@Injectable()
export class TdlibHealthService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Get health status
   */
  getHealthStatus(): HealthStatus {
    const isReady = this.tdlibService.isReady();
    const libraryInfo = this.tdlibService.getLibraryInfo();
    const clientCount = this.tdlibService.getClientCount();

    const nativeAddon = {
      loaded: isReady,
      ready: isReady,
    };

    const tdlibLibrary = {
      initialized: libraryInfo?.initialized || false,
      clientCount: clientCount,
    };

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (nativeAddon.loaded && tdlibLibrary.initialized) {
      status = 'healthy';
    } else if (nativeAddon.loaded || tdlibLibrary.initialized) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      nativeAddon,
      tdlibLibrary,
      timestamp: Date.now(),
    };
  }

  /**
   * Check if TDLib is healthy
   */
  isHealthy(): boolean {
    const health = this.getHealthStatus();
    return health.status === 'healthy';
  }

  /**
   * Perform a health check (active check)
   */
  async performHealthCheck(): Promise<HealthStatus> {
    try {
      // Try to get library info as an active check
      const libraryInfo = this.tdlibService.getLibraryInfo();
      if (!libraryInfo || !libraryInfo.initialized) {
        this.logger.warn('Health check failed: TDLib library not initialized');
      }

      return this.getHealthStatus();
    } catch (error) {
      this.logger.error('Health check error', {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        status: 'unhealthy',
        nativeAddon: { loaded: false, ready: false },
        tdlibLibrary: { initialized: false, clientCount: 0 },
        timestamp: Date.now(),
      };
    }
  }
}
