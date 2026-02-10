/**
 * TDLib Retry Service
 * 
 * Provides retry logic with exponential backoff for TDLib operations
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/services/logger.service';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: number[]; // TDLib error codes to retry
  nonRetryableErrors?: number[]; // TDLib error codes to not retry
}

@Injectable()
export class TdlibRetryService {
  private readonly defaultOptions: Required<RetryOptions>;

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.defaultOptions = {
      maxAttempts: this.configService.get<number>(
        'TDLIB_RETRY_MAX_ATTEMPTS',
        3,
      ),
      initialDelayMs: this.configService.get<number>(
        'TDLIB_RETRY_INITIAL_DELAY_MS',
        1000,
      ),
      maxDelayMs: this.configService.get<number>(
        'TDLIB_RETRY_MAX_DELAY_MS',
        10000,
      ),
      backoffMultiplier: this.configService.get<number>(
        'TDLIB_RETRY_BACKOFF_MULTIPLIER',
        2,
      ),
      retryableErrors: this.configService.get<number[]>(
        'TDLIB_RETRY_RETRYABLE_ERRORS',
        [429, 500, 502, 503, 504],
      ),
      nonRetryableErrors: this.configService.get<number[]>(
        'TDLIB_RETRY_NON_RETRYABLE_ERRORS',
        [400, 401, 403, 404],
      ),
    };
  }

  /**
   * Execute a function with retry logic
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;
    let delay = opts.initialDelayMs;

    for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        if (!this.isRetryableError(error, opts)) {
          this.logger.debug('Error is not retryable', {
            attempt,
            error: lastError.message,
          });
          throw lastError;
        }

        // Check if we have more attempts
        if (attempt >= opts.maxAttempts) {
          this.logger.warn('Max retry attempts reached', {
            attempts: attempt,
            error: lastError.message,
          });
          throw lastError;
        }

        // Wait before retry with exponential backoff
        this.logger.debug('Retrying after delay', {
          attempt,
          nextAttempt: attempt + 1,
          delayMs: delay,
          error: lastError.message,
        });

        await this.sleep(delay);
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: unknown, options: Required<RetryOptions>): boolean {
    // Extract error code from TDLib error
    const errorCode = this.extractErrorCode(error);

    if (errorCode === null) {
      // If we can't extract error code, assume retryable (network errors, etc.)
      return true;
    }

    // Check non-retryable errors first
    if (options.nonRetryableErrors.includes(errorCode)) {
      return false;
    }

    // Check retryable errors
    if (options.retryableErrors.includes(errorCode)) {
      return true;
    }

    // Default: retry for unknown errors
    return true;
  }

  /**
   * Extract error code from TDLib error
   */
  private extractErrorCode(error: unknown): number | null {
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      if (err.code && typeof err.code === 'number') {
        return err.code;
      }
      if (err['@type'] === 'error' && err.code) {
        return err.code as number;
      }
    }
    return null;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
