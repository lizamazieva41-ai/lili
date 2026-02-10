import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../services/logger.service';
import { MetricsService } from '../services/metrics.service';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(CustomLoggerService)
    private readonly logger: CustomLoggerService,
    @Inject(MetricsService)
    private readonly metrics: MetricsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userId = (req as any).user?.id || 'anonymous';
    const route = this.getRoute(originalUrl);

    // Generate or get correlation ID
    const correlationId = 
      (req.headers['x-correlation-id'] as string) || 
      (req.headers['x-request-id'] as string) ||
      this.logger.getCorrelationId();
    
    // Set correlation ID in request and response
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    // Log request start
    this.logger.logRequest(method, originalUrl, 0, 0, userId, ip, correlationId);

    // Override res.end to log response and record metrics
    const originalEnd = res.end.bind(res);
    (res as any).end = (...args: any[]) => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log response
      this.logger.logRequest(method, originalUrl, statusCode, duration, userId, ip, correlationId);

      // Record metrics
      this.metrics.incrementRequestCount(method, route, statusCode);
      this.metrics.recordRequestDuration(method, route, duration);

      if (statusCode >= 400) {
        this.metrics.incrementErrorCount(method, route, statusCode);
      }

      // Call original end
      return (originalEnd as any)(...args);
    };

    next();
  }

  private getRoute(url: string): string {
    // Extract route pattern (e.g., /api/users/:id -> /api/users)
    const path = url.split('?')[0]; // Remove query params
    const segments = path.split('/').filter(s => s);

    // Simple route pattern extraction
    if (segments.length >= 2 && segments[0] === 'api') {
      return `/${segments[0]}/${segments[1]}`;
    }

    return path || '/';
  }
}