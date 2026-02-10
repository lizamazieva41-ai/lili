import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeLogData, sanitizeLogMessage, createSafeLogObject } from '../utils/log-sanitizer';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    // Custom format for correlation IDs
    const correlationIdFormat = winston.format((info) => {
      // Generate correlation ID if not present
      if (!info.correlationId) {
        info.correlationId = uuidv4();
      }
      return info;
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        correlationIdFormat(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: {
        service: 'telegram-tool-backend',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),

        // File transport for all logs
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),

        // Separate error log file
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),

        // Security events log
        new DailyRotateFile({
          filename: 'logs/security-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'warn',
          maxSize: '20m',
          maxFiles: '90d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ]
    });
  }

  log(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? sanitizeLogMessage(message) : sanitizeLogData(message);
    this.logger.info(sanitizedMessage, { context });
  }

  error(message: any, stack?: string, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? sanitizeLogMessage(message) : sanitizeLogData(message);
    const sanitizedStack = stack ? sanitizeLogMessage(stack) : undefined;
    this.logger.error(sanitizedMessage, { stack: sanitizedStack, context });
  }

  warn(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? sanitizeLogMessage(message) : sanitizeLogData(message);
    this.logger.warn(sanitizedMessage, { context });
  }

  debug(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? sanitizeLogMessage(message) : sanitizeLogData(message);
    this.logger.debug(sanitizedMessage, { context });
  }

  verbose(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? sanitizeLogMessage(message) : sanitizeLogData(message);
    this.logger.verbose(sanitizedMessage, { context });
  }

  // Additional methods for structured logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string,
    correlationId?: string,
  ) {
    this.logger.info('HTTP Request', sanitizeLogData({
      type: 'http_request',
      method,
      url,
      statusCode,
      duration,
      userId,
      ip,
      correlationId: correlationId || uuidv4(),
      timestamp: new Date().toISOString()
    }));
  }

  logJob(jobId: string, jobType: string, status: string, duration?: number, error?: any, correlationId?: string) {
    this.logger.info('Job Execution', sanitizeLogData({
      type: 'job_execution',
      jobId,
      jobType,
      status,
      duration,
      correlationId: correlationId || uuidv4(),
      error: error ? { message: error.message, stack: sanitizeLogMessage(error.stack || '') } : undefined,
      timestamp: new Date().toISOString()
    }));
  }

  logSecurity(event: string, userId?: string, ip?: string, details?: any, correlationId?: string) {
    this.logger.warn('Security Event', sanitizeLogData({
      type: 'security_event',
      event,
      userId,
      ip,
      correlationId: correlationId || uuidv4(),
      details: sanitizeLogData(details),
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Create a child logger with correlation ID
   */
  child(meta: { correlationId?: string; userId?: string;[key: string]: any }) {
    return this.logger.child(meta);
  }

  /**
   * Get correlation ID from context or generate new one
   */
  getCorrelationId(context?: any): string {
    if (context?.request?.headers?.['x-correlation-id']) {
      return context.request.headers['x-correlation-id'];
    }
    if (context?.correlationId) {
      return context.correlationId;
    }
    return uuidv4();
  }
}