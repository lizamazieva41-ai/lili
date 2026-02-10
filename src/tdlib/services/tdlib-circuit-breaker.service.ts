/**
 * TDLib Circuit Breaker Service
 * 
 * Implements circuit breaker pattern to prevent cascade failures
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/services/logger.service';
import { MetricsService } from '../../common/services/metrics.service';

export enum CircuitState {
  CLOSED = 'closed', // Normal operation
  OPEN = 'open', // Failing, reject requests
  HALF_OPEN = 'half_open', // Testing if service recovered
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Number of failures before opening
  successThreshold?: number; // Number of successes in half-open to close
  timeoutMs?: number; // Time to wait before trying half-open
  resetTimeoutMs?: number; // Time before attempting to close circuit
}

@Injectable()
export class TdlibCircuitBreakerService {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private readonly options: Required<CircuitBreakerOptions>;

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly metrics: MetricsService,
    private readonly configService: ConfigService,
    options: CircuitBreakerOptions = {},
  ) {
    const defaultOptions: Required<CircuitBreakerOptions> = {
      failureThreshold: this.configService.get<number>(
        'TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD',
        5,
      ),
      successThreshold: this.configService.get<number>(
        'TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD',
        2,
      ),
      timeoutMs: this.configService.get<number>(
        'TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS',
        60000, // 1 minute
      ),
      resetTimeoutMs: this.configService.get<number>(
        'TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS',
        30000, // 30 seconds
      ),
    };
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check circuit state
    this.updateState();

    if (this.state === CircuitState.OPEN) {
      this.logger.warn('Circuit breaker is OPEN, rejecting request');
      this.metrics.incrementTdlibErrors('circuit_breaker_open', 0);
      throw new Error('Circuit breaker is OPEN - service unavailable');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Update circuit state based on current conditions
   */
  private updateState(): void {
    const now = Date.now();

    switch (this.state) {
      case CircuitState.CLOSED:
        // Check if we should open
        if (this.failureCount >= this.options.failureThreshold) {
          this.state = CircuitState.OPEN;
          this.lastFailureTime = now;
          this.logger.warn('Circuit breaker opened', {
            failureCount: this.failureCount,
          });
          this.metrics.incrementTdlibErrors('circuit_breaker_opened', 0);
        }
        break;

      case CircuitState.OPEN:
        // Check if we should try half-open
        if (
          this.lastFailureTime &&
          now - this.lastFailureTime >= this.options.resetTimeoutMs
        ) {
          this.state = CircuitState.HALF_OPEN;
          this.successCount = 0;
          this.logger.info('Circuit breaker entering HALF_OPEN state');
        }
        break;

      case CircuitState.HALF_OPEN:
        // Already in half-open, will transition based on success/failure
        break;
    }
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        this.logger.info('Circuit breaker closed - service recovered');
        this.metrics.incrementTdlibRequests('circuit_breaker_closed', 'success');
      }
    }
  }

  /**
   * Handle failed operation
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // If we fail in half-open, go back to open
      this.state = CircuitState.OPEN;
      this.successCount = 0;
      this.logger.warn('Circuit breaker reopened after failure in HALF_OPEN');
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    this.updateState();
    return this.state;
  }

  /**
   * Reset circuit breaker (for testing/manual recovery)
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.logger.info('Circuit breaker manually reset');
  }
}
