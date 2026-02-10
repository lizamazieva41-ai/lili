import { Injectable, Logger, OnModuleInit, Inject, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../config/redis.service';
import { MetricsService } from './metrics.service';

/**
 * Cache options for configuring cache behavior
 */
export interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Key prefix for namespacing */
  prefix?: string;
}

/**
 * Cache service providing Redis-based caching with TTL and invalidation
 * 
 * @class CacheService
 * @description Handles caching operations for frequently accessed data like users, licenses, and proxies
 * Supports cache-aside pattern with automatic TTL management
 */
@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL: number;
  private readonly keyPrefix: string;

  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
    @Optional() @Inject(MetricsService) private metricsService?: MetricsService,
  ) {
    this.defaultTTL = this.configService.get<number>('CACHE_DEFAULT_TTL', 3600);
    this.keyPrefix = this.configService.get<string>('CACHE_KEY_PREFIX', 'app:cache:');
  }

  async onModuleInit() {
    this.logger.log('Cache service initialized');
  }

  /**
   * Get value from cache or set it using fetcher function (cache-aside pattern)
   * 
   * @template T
   * @param {string} key - Cache key
   * @param {Function} fetcher - Function to fetch data if cache miss
   * @param {CacheOptions} [options] - Cache options (TTL, prefix)
   * @returns {Promise<T>} Cached or freshly fetched data
   * @example
   * const user = await cacheService.getOrSet('user:123', () => fetchUserFromDB(123), { ttl: 1800 });
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const cacheKey = this.buildKey(key, options.prefix);
    const ttl = options.ttl || this.defaultTTL;

    try {
      // Try to get from cache
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
        this.metricsService?.incrementCacheHits('redis');
        return JSON.parse(cached) as T;
      }

      // Cache miss, fetch data
      this.logger.debug(`Cache miss: ${cacheKey}`);
      this.metricsService?.incrementCacheMisses('redis');
      const data = await fetcher();

      // Store in cache (pass original key + prefix; set() will build the final cache key)
      await this.set(key, data, ttl, options.prefix);
      this.metricsService?.incrementCacheOperations('set', 'redis');

      return data;
    } catch (error) {
      this.logger.error(`Cache error for key ${cacheKey}:`, error);
      // On cache error, still return fetched data
      return await fetcher();
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    const cacheKey = this.buildKey(key, prefix);
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error getting cache key ${cacheKey}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number, prefix?: string): Promise<void> {
    const cacheKey = this.buildKey(key, prefix);
    const cacheTTL = ttl || this.defaultTTL;
    try {
      await this.redisService.set(cacheKey, JSON.stringify(value), cacheTTL);
      this.logger.debug(`Cache set: ${cacheKey} (TTL: ${cacheTTL}s)`);
    } catch (error) {
      this.logger.error(`Error setting cache key ${cacheKey}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string, prefix?: string): Promise<void> {
    const cacheKey = this.buildKey(key, prefix);
    try {
      await this.redisService.del(cacheKey);
      this.logger.debug(`Cache deleted: ${cacheKey}`);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${cacheKey}:`, error);
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string, prefix?: string): Promise<number> {
    const fullPattern = this.buildKey(pattern, prefix);
    try {
      // Note: SCAN is preferred over KEYS in production, but for simplicity using KEYS here
      // In production, consider implementing SCAN-based deletion
      const keys = await this.redisService.keys(fullPattern);
      if (keys.length === 0) {
        return 0;
      }
      let deleted = 0;
      for (const key of keys) {
        const result = await this.redisService.del(key);
        deleted += result;
      }
      this.logger.debug(`Deleted ${deleted} cache keys matching pattern: ${fullPattern}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting cache pattern ${fullPattern}:`, error);
      return 0;
    }
  }

  /**
   * Invalidate cache by key pattern
   */
  async invalidate(pattern: string, prefix?: string): Promise<number> {
    return this.deletePattern(pattern, prefix);
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string, prefix?: string): Promise<boolean> {
    const cacheKey = this.buildKey(key, prefix);
    try {
      return await this.redisService.exists(cacheKey);
    } catch (error) {
      this.logger.error(`Error checking cache key existence ${cacheKey}:`, error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    keys: number;
    memory: string;
  }> {
    try {
      const info = await this.redisService.info('memory');
      const keys = await this.redisService.dbSize();

      // Parse memory info
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memory = memoryMatch ? memoryMatch[1].trim() : 'unknown';

      return {
        keys,
        memory,
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return {
        keys: 0,
        memory: 'unknown',
      };
    }
  }

  /**
   * Build cache key with prefix
   */
  private buildKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || this.keyPrefix;
    return `${keyPrefix}${key}`;
  }

  /**
   * Cache helper for user data
   */
  async getUser(userId: string, fetcher: () => Promise<any>) {
    return this.getOrSet(`user:${userId}`, fetcher, { ttl: 1800 }); // 30 minutes
  }

  /**
   * Cache helper for license data
   */
  async getLicense(licenseId: string, fetcher: () => Promise<any>) {
    return this.getOrSet(`license:${licenseId}`, fetcher, { ttl: 3600 }); // 1 hour
  }

  /**
   * Cache helper for proxy data
   */
  async getProxy(proxyId: string, fetcher: () => Promise<any>) {
    return this.getOrSet(`proxy:${proxyId}`, fetcher, { ttl: 600 }); // 10 minutes
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(userId: string): Promise<void> {
    await this.delete(`user:${userId}`);
  }

  /**
   * Invalidate license cache
   */
  async invalidateLicense(licenseId: string): Promise<void> {
    await this.delete(`license:${licenseId}`);
  }

  /**
   * Invalidate proxy cache
   */
  async invalidateProxy(proxyId: string): Promise<void> {
    await this.delete(`proxy:${proxyId}`);
  }
}
