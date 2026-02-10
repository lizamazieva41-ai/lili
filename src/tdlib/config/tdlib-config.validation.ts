/**
 * TDLib Configuration Validation
 * 
 * Validates TDLib-related environment variables
 * Uses class-validator for validation
 */

import { registerAs } from '@nestjs/config';

export interface TdlibConfig {
  enabled: boolean;
  addonPath?: string;
  libraryPath?: string;
  pool: {
    maxSize: number;
    maxIdleTimeMs: number;
    healthCheckIntervalMs: number;
  };
  cache: {
    defaultTtlSeconds: number;
    keyPrefix: string;
  };
  rateLimit: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
    burstSize: number;
  };
  retry: {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    retryableErrors: number[];
    nonRetryableErrors: number[];
  };
  circuitBreaker: {
    failureThreshold: number;
    successThreshold: number;
    timeoutMs: number;
    resetTimeoutMs: number;
  };
}

/**
 * Validate and parse configuration values
 */
export const validateTdlibConfig = (config: Record<string, unknown>): Record<string, unknown> => {
  const errors: string[] = [];

  // Validate numeric values
  const validateNumber = (
    key: string,
    value: unknown,
    min: number,
    max: number,
    defaultValue: number,
  ): number => {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      errors.push(`${key} must be a number between ${min} and ${max}`);
      return defaultValue;
    }
    return num;
  };

  // Validate boolean values
  const validateBoolean = (key: string, value: unknown, defaultValue: boolean): boolean => {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };

  // Validate string values
  const validateString = (
    key: string,
    value: unknown,
    defaultValue: string,
  ): string => {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    return String(value);
  };

  const validated: Record<string, unknown> = {
    TDLIB_ENABLED: validateBoolean('TDLIB_ENABLED', config.TDLIB_ENABLED, true),
    TDLIB_ADDON_PATH: config.TDLIB_ADDON_PATH ? validateString('TDLIB_ADDON_PATH', config.TDLIB_ADDON_PATH, '') : undefined,
    TDLIB_LIBRARY_PATH: config.TDLIB_LIBRARY_PATH ? validateString('TDLIB_LIBRARY_PATH', config.TDLIB_LIBRARY_PATH, '') : undefined,
    TDLIB_POOL_MAX_SIZE: validateNumber('TDLIB_POOL_MAX_SIZE', config.TDLIB_POOL_MAX_SIZE, 1, 1000, 100),
    TDLIB_POOL_MAX_IDLE_TIME_MS: validateNumber('TDLIB_POOL_MAX_IDLE_TIME_MS', config.TDLIB_POOL_MAX_IDLE_TIME_MS, 1000, 3600000, 1800000),
    TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS: validateNumber('TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS', config.TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS, 1000, 600000, 60000),
    TDLIB_CACHE_DEFAULT_TTL_SECONDS: validateNumber('TDLIB_CACHE_DEFAULT_TTL_SECONDS', config.TDLIB_CACHE_DEFAULT_TTL_SECONDS, 1, 86400, 3600),
    TDLIB_CACHE_KEY_PREFIX: validateString('TDLIB_CACHE_KEY_PREFIX', config.TDLIB_CACHE_KEY_PREFIX, 'tdlib:cache:'),
    TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND: validateNumber('TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND', config.TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND, 1, 1000, 10),
    TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE: validateNumber('TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE', config.TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE, 1, 60000, 60),
    TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR: validateNumber('TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR', config.TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR, 1, 3600000, 1000),
    TDLIB_RATE_LIMIT_BURST_SIZE: validateNumber('TDLIB_RATE_LIMIT_BURST_SIZE', config.TDLIB_RATE_LIMIT_BURST_SIZE, 1, 1000, 20),
    TDLIB_RETRY_MAX_ATTEMPTS: validateNumber('TDLIB_RETRY_MAX_ATTEMPTS', config.TDLIB_RETRY_MAX_ATTEMPTS, 1, 10, 3),
    TDLIB_RETRY_INITIAL_DELAY_MS: validateNumber('TDLIB_RETRY_INITIAL_DELAY_MS', config.TDLIB_RETRY_INITIAL_DELAY_MS, 100, 60000, 1000),
    TDLIB_RETRY_MAX_DELAY_MS: validateNumber('TDLIB_RETRY_MAX_DELAY_MS', config.TDLIB_RETRY_MAX_DELAY_MS, 1000, 300000, 10000),
    TDLIB_RETRY_BACKOFF_MULTIPLIER: validateNumber('TDLIB_RETRY_BACKOFF_MULTIPLIER', config.TDLIB_RETRY_BACKOFF_MULTIPLIER, 1, 10, 2),
    TDLIB_RETRY_RETRYABLE_ERRORS: config.TDLIB_RETRY_RETRYABLE_ERRORS ? String(config.TDLIB_RETRY_RETRYABLE_ERRORS) : undefined,
    TDLIB_RETRY_NON_RETRYABLE_ERRORS: config.TDLIB_RETRY_NON_RETRYABLE_ERRORS ? String(config.TDLIB_RETRY_NON_RETRYABLE_ERRORS) : undefined,
    TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD: validateNumber('TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD', config.TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD, 1, 100, 5),
    TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD: validateNumber('TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD', config.TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD, 1, 100, 2),
    TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS: validateNumber('TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS', config.TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS, 1000, 600000, 60000),
    TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS: validateNumber('TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS', config.TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS, 1000, 300000, 30000),
  };

  if (errors.length > 0) {
    console.warn('TDLib configuration validation warnings:', errors);
  }

  return validated;
};

export const tdlibConfig = registerAs('tdlib', (): TdlibConfig => {
  const config = {
    TDLIB_ENABLED: process.env.TDLIB_ENABLED,
    TDLIB_ADDON_PATH: process.env.TDLIB_ADDON_PATH,
    TDLIB_LIBRARY_PATH: process.env.TDLIB_LIBRARY_PATH,
    TDLIB_POOL_MAX_SIZE: process.env.TDLIB_POOL_MAX_SIZE,
    TDLIB_POOL_MAX_IDLE_TIME_MS: process.env.TDLIB_POOL_MAX_IDLE_TIME_MS,
    TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS: process.env.TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS,
    TDLIB_CACHE_DEFAULT_TTL_SECONDS: process.env.TDLIB_CACHE_DEFAULT_TTL_SECONDS,
    TDLIB_CACHE_KEY_PREFIX: process.env.TDLIB_CACHE_KEY_PREFIX,
    TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND: process.env.TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND,
    TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE: process.env.TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE,
    TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR: process.env.TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR,
    TDLIB_RATE_LIMIT_BURST_SIZE: process.env.TDLIB_RATE_LIMIT_BURST_SIZE,
    TDLIB_RETRY_MAX_ATTEMPTS: process.env.TDLIB_RETRY_MAX_ATTEMPTS,
    TDLIB_RETRY_INITIAL_DELAY_MS: process.env.TDLIB_RETRY_INITIAL_DELAY_MS,
    TDLIB_RETRY_MAX_DELAY_MS: process.env.TDLIB_RETRY_MAX_DELAY_MS,
    TDLIB_RETRY_BACKOFF_MULTIPLIER: process.env.TDLIB_RETRY_BACKOFF_MULTIPLIER,
    TDLIB_RETRY_RETRYABLE_ERRORS: process.env.TDLIB_RETRY_RETRYABLE_ERRORS,
    TDLIB_RETRY_NON_RETRYABLE_ERRORS: process.env.TDLIB_RETRY_NON_RETRYABLE_ERRORS,
    TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD: process.env.TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD: process.env.TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD,
    TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS: process.env.TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS,
    TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS: process.env.TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
  };

  const validated = validateTdlibConfig(config);

  // Parse comma-separated error codes
  const parseErrorCodes = (str: string | undefined, defaultCodes: number[]): number[] => {
    if (!str) return defaultCodes;
    return str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  };

  return {
    enabled: validated.TDLIB_ENABLED === 'true' || validated.TDLIB_ENABLED === true,
    addonPath: validated.TDLIB_ADDON_PATH,
    libraryPath: validated.TDLIB_LIBRARY_PATH,
    pool: {
      maxSize: Number(validated.TDLIB_POOL_MAX_SIZE),
      maxIdleTimeMs: Number(validated.TDLIB_POOL_MAX_IDLE_TIME_MS),
      healthCheckIntervalMs: Number(validated.TDLIB_POOL_HEALTH_CHECK_INTERVAL_MS),
    },
    cache: {
      defaultTtlSeconds: Number(validated.TDLIB_CACHE_DEFAULT_TTL_SECONDS),
      keyPrefix: validated.TDLIB_CACHE_KEY_PREFIX,
    },
    rateLimit: {
      requestsPerSecond: Number(validated.TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND),
      requestsPerMinute: Number(validated.TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE),
      requestsPerHour: Number(validated.TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR),
      burstSize: Number(validated.TDLIB_RATE_LIMIT_BURST_SIZE),
    },
    retry: {
      maxAttempts: Number(validated.TDLIB_RETRY_MAX_ATTEMPTS),
      initialDelayMs: Number(validated.TDLIB_RETRY_INITIAL_DELAY_MS),
      maxDelayMs: Number(validated.TDLIB_RETRY_MAX_DELAY_MS),
      backoffMultiplier: Number(validated.TDLIB_RETRY_BACKOFF_MULTIPLIER),
      retryableErrors: parseErrorCodes(validated.TDLIB_RETRY_RETRYABLE_ERRORS, [429, 500, 502, 503, 504]),
      nonRetryableErrors: parseErrorCodes(validated.TDLIB_RETRY_NON_RETRYABLE_ERRORS, [400, 401, 403, 404]),
    },
    circuitBreaker: {
      failureThreshold: Number(validated.TDLIB_CIRCUIT_BREAKER_FAILURE_THRESHOLD),
      successThreshold: Number(validated.TDLIB_CIRCUIT_BREAKER_SUCCESS_THRESHOLD),
      timeoutMs: Number(validated.TDLIB_CIRCUIT_BREAKER_TIMEOUT_MS),
      resetTimeoutMs: Number(validated.TDLIB_CIRCUIT_BREAKER_RESET_TIMEOUT_MS),
    },
  };
});
