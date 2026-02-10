/**
 * TDLib Rate Limit Guard
 * 
 * Guard to enforce rate limiting on endpoints
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TdlibRateLimiterService, RateLimitMetadata } from '../services/tdlib-rate-limiter.service';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';

@Injectable()
export class TdlibRateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimiter: TdlibRateLimiterService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const metadata = this.reflector.get<RateLimitMetadata>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      // No rate limit configured, allow
      return true;
    }

    const clientId = request.params?.clientId || request.body?.clientId;
    const method = request.route?.path || request.url;

    let result;

    switch (metadata.scope || 'client-method') {
      case 'client':
        if (!clientId) {
          throw new HttpException(
            'Client ID required for rate limiting',
            HttpStatus.BAD_REQUEST,
          );
        }
        result = await this.rateLimiter.checkClientRateLimit(clientId, metadata);
        break;

      case 'method':
        result = await this.rateLimiter.checkMethodRateLimit(method, metadata);
        break;

      case 'client-method':
      default:
        if (!clientId) {
          throw new HttpException(
            'Client ID required for rate limiting',
            HttpStatus.BAD_REQUEST,
          );
        }
        result = await this.rateLimiter.checkClientMethodRateLimit(
          clientId,
          method,
          metadata,
        );
        break;
    }

    if (!result.allowed) {
      throw new HttpException(
        {
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          resetAt: result.resetAt,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Remaining', result.remaining);
    response.setHeader('X-RateLimit-Reset', result.resetAt);

    return true;
  }
}
