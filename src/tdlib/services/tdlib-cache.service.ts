/**
 * TDLib Cache Service
 * 
 * Redis caching for TDLib responses with TTL management
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/services/logger.service';
import { RedisService } from '../../config/redis.service';
import { TdlibResponse } from '../types';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
  invalidateOnUpdate?: boolean;
}

@Injectable()
export class TdlibCacheService {
  private readonly defaultTtl: number;
  private readonly defaultKeyPrefix: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.defaultTtl = this.configService.get<number>(
      'TDLIB_CACHE_DEFAULT_TTL_SECONDS',
      3600, // 1 hour default
    );
    this.defaultKeyPrefix = this.configService.get<string>(
      'TDLIB_CACHE_KEY_PREFIX',
      'tdlib:cache:',
    );
  }

  /**
   * Get cached response
   */
  async get<T extends TdlibResponse>(
    key: string,
    options: CacheOptions = {},
  ): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key, options.keyPrefix);
      const cached = await this.redisService.get(fullKey);
      
      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as T;
    } catch (error) {
      this.logger.error(`Cache get failed: ${error.message}`, error.stack);
      return null; // Fail open
    }
  }

  /**
   * Set cached response
   */
  async set(
    key: string,
    value: TdlibResponse,
    options: CacheOptions = {},
  ): Promise<void> {
    try {
      const fullKey = this.buildKey(key, options.keyPrefix);
      const ttl = options.ttl || this.defaultTtl;
      const serialized = JSON.stringify(value);

      await this.redisService.set(fullKey, serialized, ttl);
    } catch (error) {
      this.logger.error(`Cache set failed: ${error.message}`, error.stack);
      // Fail silently
    }
  }

  /**
   * Invalidate cache
   */
  async invalidate(
    key: string,
    options: CacheOptions = {},
  ): Promise<void> {
    try {
      const fullKey = this.buildKey(key, options.keyPrefix);
      await this.redisService.del(fullKey);
    } catch (error) {
      this.logger.error(`Cache invalidation failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisService.keys(pattern);
      if (keys.length > 0) {
        for (const key of keys) {
          await this.redisService.del(key);
        }
      }
    } catch (error) {
      this.logger.error(`Cache pattern invalidation failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Warm cache with data
   */
  async warmCache(
    entries: Array<{ key: string; value: TdlibResponse; ttl?: number }>,
  ): Promise<void> {
    const promises = entries.map(entry =>
      this.set(entry.key, entry.value, { ttl: entry.ttl }),
    );
    await Promise.all(promises);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    hitRate: number;
    missRate: number;
    totalKeys: number;
  }> {
    try {
      const keys = await this.redisService.keys(`${this.defaultKeyPrefix}*`);
      return {
        hitRate: 0, // Would need to track hits/misses
        missRate: 0,
        totalKeys: keys.length,
      };
    } catch (error) {
      this.logger.error(`Get cache stats failed: ${error.message}`, error.stack);
      return { hitRate: 0, missRate: 0, totalKeys: 0 };
    }
  }

  private buildKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultKeyPrefix}${key}`;
  }
}
