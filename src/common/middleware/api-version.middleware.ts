import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiVersionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract version from header or query parameter
    const version = 
      req.headers['api-version'] || 
      req.headers['x-api-version'] ||
      req.query.version ||
      'v1'; // Default to v1

    // Set version in request for use in controllers
    (req as any).apiVersion = version;

    // Add version to response headers
    res.setHeader('X-API-Version', version as string);

    next();
  }
}
