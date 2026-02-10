/**
 * TDLib Rate Limiter Service
 * 
 * Implements token bucket algorithm for rate limiting
 * Redis-backed for distributed systems
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/services/logger.service';
import { RedisService } from '../../config/redis.service';

export interface RateLimitOptions {
  requestsPerSecond?: number;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  burstSize?: number; // Maximum burst capacity
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Timestamp when limit resets
  retryAfter?: number; // Seconds to wait before retry
}

@Injectable()
export class TdlibRateLimiterService {
  private readonly defaultOptions: Required<RateLimitOptions>;

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.defaultOptions = {
      requestsPerSecond: this.configService.get<number>(
        'TDLIB_RATE_LIMIT_REQUESTS_PER_SECOND',
        10,
      ),
      requestsPerMinute: this.configService.get<number>(
        'TDLIB_RATE_LIMIT_REQUESTS_PER_MINUTE',
        60,
      ),
      requestsPerHour: this.configService.get<number>(
        'TDLIB_RATE_LIMIT_REQUESTS_PER_HOUR',
        1000,
      ),
      burstSize: this.configService.get<number>(
        'TDLIB_RATE_LIMIT_BURST_SIZE',
        20,
      ),
    };
  }

  /**
   * Check if request is allowed (token bucket algorithm)
   */
  async checkRateLimit(
    key: string,
    options: RateLimitOptions = {},
  ): Promise<RateLimitResult> {
    const opts = { ...this.defaultOptions, ...options };
    const now = Date.now();
    const windowMs = 1000; // 1 second window

    // Use Lua script for atomic operations (simplified version using RedisService methods)
    // Since redis package doesn't support eval the same way, we'll use a simpler approach
    try {
      const redis = this.redisService.getClient();
      
      // Get current state
      const tokensStr = await this.redisService.hGet(key, 'tokens');
      const lastRefillStr = await this.redisService.hGet(key, 'lastRefill');
      
      let tokens = tokensStr ? parseInt(tokensStr, 10) : opts.burstSize;
      const lastRefill = lastRefillStr ? parseInt(lastRefillStr, 10) : now;
      
      // Calculate tokens to add
      const timePassed = now - lastRefill;
      const tokensToAdd = Math.floor(timePassed / windowMs) * (opts.requestsPerSecond / 1000);
      tokens = Math.min(opts.burstSize, tokens + tokensToAdd);
      
      // Check if allowed
      if (tokens >= 1) {
        tokens = tokens - 1;
        await this.redisService.hSet(key, 'tokens', tokens.toString());
        await this.redisService.hSet(key, 'lastRefill', now.toString());
        await redis.expire(key, 3600);
        
        return {
          allowed: true,
          remaining: Math.floor(tokens),
          resetAt: now + windowMs,
        };
      } else {
        await this.redisService.hSet(key, 'tokens', tokens.toString());
        await this.redisService.hSet(key, 'lastRefill', now.toString());
        await redis.expire(key, 3600);
        
        const retryAfter = Math.ceil(windowMs / 1000);
        return {
          allowed: false,
          remaining: Math.floor(tokens),
          resetAt: now + windowMs,
          retryAfter,
        };
      }
    } catch (error) {
      this.logger.error(`Rate limit check failed: ${error.message}`, error.stack);
      // Fail open - allow request if Redis fails
      return {
        allowed: true,
        remaining: opts.burstSize,
        resetAt: now + windowMs,
      };
    }
  }

  /**
   * Check rate limit per client
   */
  async checkClientRateLimit(
    clientId: string,
    options: RateLimitOptions = {},
  ): Promise<RateLimitResult> {
    const key = `tdlib:ratelimit:client:${clientId}`;
    return this.checkRateLimit(key, options);
  }

  /**
   * Check rate limit per method
   */
  async checkMethodRateLimit(
    method: string,
    options: RateLimitOptions = {},
  ): Promise<RateLimitResult> {
    const key = `tdlib:ratelimit:method:${method}`;
    return this.checkRateLimit(key, options);
  }

  /**
   * Check rate limit per client and method combination
   */
  async checkClientMethodRateLimit(
    clientId: string,
    method: string,
    options: RateLimitOptions = {},
  ): Promise<RateLimitResult> {
    const key = `tdlib:ratelimit:client:${clientId}:method:${method}`;
    return this.checkRateLimit(key, options);
  }

  /**
   * Reset rate limit for a key
   */
  async resetRateLimit(key: string): Promise<void> {
    try {
      await this.redisService.del(key);
    } catch (error) {
      this.logger.error(`Rate limit reset failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(key: string): Promise<{
    tokens: number;
    lastRefill: number;
    ttl: number;
  } | null> {
    try {
      const redis = this.redisService.getClient();
      const tokens = await this.redisService.hGet(key, 'tokens');
      const lastRefill = await this.redisService.hGet(key, 'lastRefill');
      const ttl = await redis.ttl(key);

      if (!tokens) {
        return null;
      }

      return {
        tokens: parseInt(tokens, 10),
        lastRefill: parseInt(lastRefill || '0', 10),
        ttl: ttl,
      };
    } catch (error) {
      this.logger.error(`Get rate limit status failed: ${error.message}`, error.stack);
      return null;
    }
  }
}
