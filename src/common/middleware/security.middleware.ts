import { Injectable, NestMiddleware, Logger, Inject, Optional } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityAuditService } from '../../auth/security-audit.service';
import { IpUtils } from '../../auth/utils/ip-utils';
import { UserAgentParser } from '../../auth/utils/user-agent-parser';
import { CsrfService } from '../services/csrf.service';
import { SessionManagementService } from '../../auth/session-management.service';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  constructor(
    private securityAuditService: SecurityAuditService,
    @Optional() @Inject(CsrfService) private csrfService?: CsrfService,
    @Optional() @Inject(SessionManagementService) private sessionManagementService?: SessionManagementService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Request size limit check
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const maxRequestSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength > maxRequestSize) {
      this.logger.warn(`Request size exceeded: ${contentLength} bytes from ${req.ip}`);
      return res.status(413).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request payload too large. Maximum size is 10MB.',
        },
      });
    }

    // Extract and normalize IP
    const ip = IpUtils.normalizeIp(IpUtils.extractIp(req));
    req.clientIp = ip;

    // Parse user agent
    const userAgent = req.headers['user-agent'] || '';
    const parsedUA = UserAgentParser.parse(userAgent);

    // Add security context to request
    req.securityContext = {
      ip,
      userAgent,
      parsedUA,
      isSuspicious: this.isSuspiciousRequest(ip, parsedUA, req),
      requestTimestamp: new Date(),
    };

    // Log suspicious requests
    if (req.securityContext.isSuspicious) {
      await this.logSuspiciousRequest(req);
    }

    // Add security headers
    this.addSecurityHeaders(res);

    // CSRF protection for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
      
      // For authenticated requests, verify CSRF token
      if (req.user && this.csrfService) {
        const sessionId = await this.getSessionId(req);
        if (sessionId) {
          const isValid = await this.csrfService.validateToken(csrfToken || '', sessionId);
          if (!isValid) {
            this.logger.warn(`CSRF token validation failed for ${req.method} ${req.path} from ${ip}`);
            return res.status(403).json({
              success: false,
              error: {
                code: 'CSRF_TOKEN_INVALID',
                message: 'Invalid or missing CSRF token',
              },
            });
          }
        }
      } else if (req.user && !this.csrfService) {
        // Fallback validation if CSRF service not available
        if (!this.validateCsrfToken(req, csrfToken)) {
          this.logger.warn(`CSRF token validation failed (fallback) for ${req.method} ${req.path} from ${ip}`);
          return res.status(403).json({
            success: false,
            error: {
              code: 'CSRF_TOKEN_INVALID',
              message: 'Invalid or missing CSRF token',
            },
          });
        }
      }
    }

    // Generate CSRF token for GET requests (for frontend to use)
    if (req.method === 'GET' && req.user && this.csrfService) {
      const sessionId = await this.getSessionId(req);
      if (sessionId) {
        const existingToken = await this.csrfService.getTokenForSession(sessionId);
        if (!existingToken) {
          const newToken = await this.csrfService.generateToken(sessionId);
          res.setHeader('X-CSRF-Token', newToken);
        } else {
          res.setHeader('X-CSRF-Token', existingToken);
        }
      }
    }

    next();
  }

  private isSuspiciousRequest(ip: string, parsedUA: UserAgentParser, req: Request): boolean {
    // Check for suspicious user agent
    if (UserAgentParser.isSuspicious(req.headers['user-agent'] || '')) {
      return true;
    }

    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-originating-ip',
    ];

    const hasMultipleIps = suspiciousHeaders.some(header => {
      const value = req.headers[header];
      return value && typeof value === 'string' && value.includes(',');
    });

    if (hasMultipleIps) {
      return true;
    }

    // Check for missing common headers
    const requiredHeaders = ['host', 'connection'];
    const missingHeaders = requiredHeaders.filter(header => !req.headers[header]);
    
    if (missingHeaders.length > 0) {
      return true;
    }

    return false;
  }

  private async logSuspiciousRequest(req: Request): Promise<void> {
    const context = req.securityContext;
    if (!context) {
      return;
    }
    
    // Only log if user is authenticated
    if (req.user) {
      await this.securityAuditService.logAuthEvent({
        userId: (req.user as any).id,
        event: 'SUSPICIOUS_REQUEST',
        severity: 'MEDIUM',
        details: {
          ip: context.ip,
          userAgent: context.userAgent,
          path: req.path,
          method: req.method,
          parsedUA: context.parsedUA,
        },
        ipAddress: context.ip,
        userAgent: context.userAgent,
        timestamp: new Date(),
      });
    }

    this.logger.warn(`Suspicious request from ${context.ip}: ${req.method} ${req.path}`);
  }

  private addSecurityHeaders(res: Response): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'fullscreen=()',
    ].join(', '));
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        'form-action \'self\'',
        'upgrade-insecure-requests',
      ].join('; '),
    );
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('X-Request-ID', this.generateRequestId());
    
    // Remove server information
    res.removeHeader('Server');
    res.removeHeader('X-Powered-By');
  }

  /**
   * Get session ID from request
   * Tries to extract from JWT token or session
   */
  private async getSessionId(req: Request): Promise<string | null> {
    if (!req.user) {
      return null;
    }

    // Try to get session ID from JWT token (if stored in token)
    const token = this.extractTokenFromRequest(req);
    if (token && this.sessionManagementService) {
      try {
        const validationResult = await this.sessionManagementService.validateSession(token);
        if (validationResult.isValid && validationResult.session) {
          return validationResult.session.sessionId;
        }
      } catch (error) {
        this.logger.debug(`Failed to validate session for CSRF: ${(error as Error).message}`);
      }
    }

    // Fallback: use user ID as session identifier (less secure but works)
    if (req.user && (req.user as any).id) {
      return `user_${(req.user as any).id}`;
    }

    return null;
  }

  /**
   * Extract JWT token from request
   */
  private extractTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Fallback CSRF validation (used when CSRF service not available)
   */
  private validateCsrfToken(req: Request, csrfToken?: string): boolean {
    // For now, allow requests without CSRF token in development
    // In production, this should always require CSRF token
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // In production, require CSRF token
    return !!csrfToken;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Extend Request interface to include security context
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
      securityContext?: {
        ip: string;
        userAgent: string;
        parsedUA: any;
        isSuspicious: boolean;
        requestTimestamp: Date;
      };
    }
  }
}