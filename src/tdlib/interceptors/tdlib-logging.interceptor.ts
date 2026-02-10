/**
 * TDLib Logging Interceptor
 * 
 * Logs all TDLib requests and responses for observability
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from '../../common/services/logger.service';

@Injectable()
export class TdlibLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params } = request;
    const startTime = Date.now();

    // Log request
    this.logger.debug('TDLib API Request', {
      method,
      url,
      params,
      body: this.sanitizeBody(body),
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.logger.debug('TDLib API Response', {
            method,
            url,
            statusCode: 200,
            duration,
            responseSize: JSON.stringify(response).length,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error('TDLib API Error', {
            method,
            url,
            error: error.message,
            statusCode: error.status || 500,
            duration,
            stack: error.stack,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body } as Record<string, unknown>;
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
