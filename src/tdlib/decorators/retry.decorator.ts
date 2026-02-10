/**
 * Retry Decorator
 * 
 * Decorator for automatic retry with exponential backoff
 */

import { TdlibRetryService } from '../services/tdlib-retry.service';
import { RetryOptions } from '../services/tdlib-retry.service';

/**
 * Retry decorator factory
 */
export function Retryable(options: RetryOptions = {}) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      // Get retry service from dependency injection
      // Note: This assumes the class has access to TdlibRetryService
      // In practice, you'd inject it via constructor
      const retryService = new TdlibRetryService(
        (this as { logger?: { debug: (msg: string, meta?: unknown) => void; warn: (msg: string, meta?: unknown) => void } }).logger as any,
      );

      return retryService.executeWithRetry(
        () => originalMethod.apply(this, args),
        options,
      );
    };

    return descriptor;
  };
}
