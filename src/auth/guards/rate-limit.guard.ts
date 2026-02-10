import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../config/redis.service';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
  keyGenerator?: (context: ExecutionContext) => string;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitOptions = this.reflector.get<RateLimitOptions>(
      'rateLimit',
      context.getHandler(),
    ) || this.getDefaultOptions();

    const key = this.generateKey(context, rateLimitOptions);
    const current = await this.getCurrentCount(key);
    const windowStart = Date.now() - rateLimitOptions.windowMs;

    // Clean old entries and count current window
    const requests = current.filter((timestamp: number) => timestamp > windowStart);

    if (requests.length >= rateLimitOptions.max) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: rateLimitOptions.message || 'Too many requests',
          retryAfter: Math.ceil(rateLimitOptions.windowMs / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add current request
    requests.push(Date.now());

    // Store updated count with expiry
    await this.redisService.set(
      key,
      JSON.stringify(requests),
      Math.ceil(rateLimitOptions.windowMs / 1000),
    );

    return true;
  }

  private getDefaultOptions(): RateLimitOptions {
    return {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests per minute
      message: 'Rate limit exceeded',
    };
  }

  private generateKey(context: ExecutionContext, options: RateLimitOptions): string {
    if (options.keyGenerator) {
      return options.keyGenerator(context);
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || 'anonymous';
    const ip = request.ip || request.connection.remoteAddress;
    const path = request.route?.path || request.path;

    return `rate_limit:${userId}:${ip}:${path}`;
  }

  private async getCurrentCount(key: string): Promise<number[]> {
    const data = await this.redisService.get(key);
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

// Decorator for setting rate limit options
export const RateLimit = (options: RateLimitOptions) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      // Method decorator
      Reflect.defineMetadata('rateLimit', options, descriptor.value);
    } else {
      // Class decorator
      Reflect.defineMetadata('rateLimit', options, target);
    }
  };
};