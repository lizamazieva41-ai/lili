import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
  requestId?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Add cache headers for GET requests
    if (request.method === 'GET') {
      // Set cache control headers
      response.setHeader('Cache-Control', 'public, max-age=60');
      response.setHeader('ETag', this.generateETag(request.url));
    }

    // Add request ID for tracing
    const requestId = request.headers['x-request-id'] || this.generateRequestId();
    response.setHeader('X-Request-ID', requestId);

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId,
      })),
    );
  }

  private generateETag(url: string): string {
    // Simple ETag generation based on URL and timestamp
    const hash = Buffer.from(url).toString('base64').substring(0, 16);
    return `"${hash}"`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}