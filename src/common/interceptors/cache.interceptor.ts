import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';
import { Reflector } from '@nestjs/core';

export const CACHE_TTL_KEY = 'cache_ttl';
export const CACHE_KEY = 'cache_key';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Get cache configuration from decorators
    const ttl = this.reflector.get<number>(CACHE_TTL_KEY, handler) || 60;
    const cacheKey = this.reflector.get<string>(CACHE_KEY, handler);

    // Build cache key
    const key = cacheKey || this.buildCacheKey(request);

    // Try to get from cache
    const cached = await this.cacheService.get(key);
    if (cached) {
      response.setHeader('X-Cache', 'HIT');
      return of(cached);
    }

    // Cache miss, proceed with request
    return next.handle().pipe(
      tap(async (data) => {
        // Cache the response
        if (data && !response.headersSent) {
          response.setHeader('X-Cache', 'MISS');
          await this.cacheService.set(key, data, ttl);
        }
      }),
    );
  }

  private buildCacheKey(request: any): string {
    const { method, url, query, params, user } = request;
    const keyParts = [
      'http',
      method.toLowerCase(),
      url,
      JSON.stringify(query),
      JSON.stringify(params),
      user?.id || 'anonymous',
    ];
    return `cache:${keyParts.join(':')}`;
  }
}
