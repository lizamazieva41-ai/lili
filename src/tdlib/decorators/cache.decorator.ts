/**
 * Cache Decorator
 * 
 * Decorator to cache method results
 */

import { SetMetadata } from '@nestjs/common';
import { CacheOptions } from '../services/tdlib-cache.service';

export const CACHE_KEY = 'cache';

export interface CacheMetadata extends CacheOptions {
  keyGenerator?: (args: unknown[]) => string;
}

export const Cache = (options: CacheMetadata = {}) =>
  SetMetadata(CACHE_KEY, options);
