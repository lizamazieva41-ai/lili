import { SetMetadata } from '@nestjs/common';
import { CACHE_TTL_KEY, CACHE_KEY } from '../interceptors/cache.interceptor';

/**
 * Decorator to enable caching for an endpoint
 * @param ttl Time to live in seconds (default: 60)
 * @param key Optional custom cache key
 */
export const Cache = (ttl: number = 60, key?: string) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      SetMetadata(CACHE_TTL_KEY, ttl)(target, propertyKey, descriptor as TypedPropertyDescriptor<any>);
      if (key) {
        SetMetadata(CACHE_KEY, key)(target, propertyKey, descriptor as TypedPropertyDescriptor<any>);
      }
    }
  };
};
