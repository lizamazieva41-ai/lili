/**
 * Rate Limit Decorator
 * 
 * Decorator to apply rate limiting to methods
 */

import { SetMetadata } from '@nestjs/common';
import { RateLimitOptions } from '../services/tdlib-rate-limiter.service';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitMetadata extends RateLimitOptions {
  scope?: 'client' | 'method' | 'client-method';
}

export const RateLimit = (options: RateLimitMetadata = {}) =>
  SetMetadata(RATE_LIMIT_KEY, options);
