/**
 * TDLib Audit Service
 * 
 * Logs all TDLib operations for audit purposes
 * Stores logs in database with query and pagination support
 */

import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../common/services/logger.service';
import { PrismaService } from '../../config/prisma.service';
import { TdlibRequest, TdlibResponse } from '../types';
import { Prisma } from '@prisma/client';

export interface AuditLog {
  timestamp: Date;
  userId?: string;
  clientId: string;
  action: string;
  request: TdlibRequest;
  response?: TdlibResponse;
  error?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogQueryFilters {
  clientId?: string;
  userId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  apiKeyId?: string;
  statusCode?: number;
}

export interface AuditLogQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'action' | 'clientId';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogQueryResult {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TdlibAuditService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Log TDLib operation to database
   */
  async logOperation(
    clientId: string,
    action: string,
    request: TdlibRequest,
    response?: TdlibResponse,
    error?: string,
    metadata?: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      apiKeyId?: string;
      duration?: number;
      statusCode?: number;
    },
  ): Promise<void> {
    try {
      const sanitizedRequest = this.sanitizeRequest(request);
      const sanitizedResponse = response ? this.sanitizeResponse(response) : undefined;

      // Save to database
      await this.prisma.tdlibAuditLog.create({
        data: {
          userId: metadata?.userId,
          clientId,
          action,
          request: sanitizedRequest as Prisma.JsonObject,
          response: sanitizedResponse ? (sanitizedResponse as Prisma.JsonObject) : null,
          error: error || null,
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
          apiKeyId: metadata?.apiKeyId,
          duration: metadata?.duration,
          statusCode: metadata?.statusCode,
        },
      });

      // Also log to logger for immediate visibility
      this.logger.log('TDLib Audit Log', {
        clientId,
        action,
        userId: metadata?.userId,
        hasResponse: !!response,
        hasError: !!error,
      });
    } catch (error) {
      // Log error but don't fail the operation
      this.logger.error('Failed to save audit log', {
        error: error instanceof Error ? error.message : String(error),
        clientId,
        action,
      });
    }
  }

  /**
   * Query audit logs with filters and pagination
   */
  async queryAuditLogs(
    filters: AuditLogQueryFilters = {},
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLogQueryResult> {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100); // Max 100 per page
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    // Build where clause
    const where: Prisma.TdlibAuditLogWhereInput = {};

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.apiKeyId) {
      where.apiKeyId = filters.apiKeyId;
    }

    if (filters.statusCode !== undefined) {
      where.statusCode = filters.statusCode;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    // Build orderBy
    const orderBy: Prisma.TdlibAuditLogOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    try {
      // Get total count
      const total = await this.prisma.tdlibAuditLog.count({ where });

      // Get paginated data
      const logs = await this.prisma.tdlibAuditLog.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          apiKey: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Transform to AuditLog format
      const data: AuditLog[] = logs.map(log => ({
        timestamp: log.createdAt,
        userId: log.userId || undefined,
        clientId: log.clientId,
        action: log.action,
        request: log.request as TdlibRequest,
        response: log.response ? (log.response as TdlibResponse) : undefined,
        error: log.error || undefined,
        ipAddress: log.ipAddress || undefined,
        userAgent: log.userAgent || undefined,
      }));

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to query audit logs', {
        error: error instanceof Error ? error.message : String(error),
        filters,
      });
      throw error;
    }
  }

  /**
   * Get audit log statistics
   */
  async getAuditStatistics(filters: AuditLogQueryFilters = {}): Promise<{
    total: number;
    byAction: Array<{ action: string; count: number }>;
    byUser: Array<{ userId: string; count: number }>;
    byClient: Array<{ clientId: string; count: number }>;
    errorRate: number;
  }> {
    const where: Prisma.TdlibAuditLogWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [total, byAction, byUser, byClient, errorCount] = await Promise.all([
      this.prisma.tdlibAuditLog.count({ where }),
      this.prisma.tdlibAuditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
      this.prisma.tdlibAuditLog.groupBy({
        by: ['userId'],
        where: { ...where, userId: { not: null } },
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),
      this.prisma.tdlibAuditLog.groupBy({
        by: ['clientId'],
        where,
        _count: true,
        orderBy: { _count: { clientId: 'desc' } },
        take: 10,
      }),
      this.prisma.tdlibAuditLog.count({
        where: { ...where, error: { not: null } },
      }),
    ]);

    return {
      total,
      byAction: byAction.map(item => ({
        action: item.action,
        count: item._count.action,
      })),
      byUser: byUser.map(item => ({
        userId: item.userId || '',
        count: item._count.userId,
      })),
      byClient: byClient.map(item => ({
        clientId: item.clientId,
        count: item._count.clientId,
      })),
      errorRate: total > 0 ? (errorCount / total) * 100 : 0,
    };
  }

  private sanitizeRequest(request: TdlibRequest): TdlibRequest {
    const sanitized = { ...request } as Record<string, unknown>;
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'api_id', 'api_hash', 'secret'];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized as TdlibRequest;
  }

  private sanitizeResponse(response: TdlibResponse): TdlibResponse {
    // Sanitize response if needed
    const sanitized = { ...response } as Record<string, unknown>;
    
    // Remove sensitive fields from response
    const sensitiveFields = ['api_id', 'api_hash', 'secret', 'token'];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized as TdlibResponse;
  }
}
