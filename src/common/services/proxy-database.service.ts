import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import {
  Prisma,
  Proxy,
  ProxyHealthLog,
  ProxyUsageStats,
  ProxyMetric,
  AccountProxyAssignment,
  ProxyStatus,
  ProxyType,
} from '@prisma/client';

@Injectable()
export class ProxyDatabaseService {
  constructor(private prisma: PrismaService) {}

  // Proxy CRUD operations
  async findById(id: string): Promise<Proxy | null> {
    return this.prisma.proxy.findUnique({
      where: { id },
      include: {
        accountAssignments: {
          include: {
            account: {
              select: { id: true, phone: true, username: true }
            }
          }
        },
        healthLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        usageStats: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });
  }

  async findByHostPort(host: string, port: number): Promise<Proxy | null> {
    return this.prisma.proxy.findUnique({
      where: { host_port: { host, port } },
      include: {
        accountAssignments: true
      }
    });
  }

  async findAll(filters: {
    type?: ProxyType;
    country?: string;
    status?: ProxyStatus;
    isActive?: boolean;
    minHealthScore?: number;
    tags?: string[];
    page?: number;
    limit?: number;
  } = {}): Promise<{ proxies: Proxy[]; total: number }> {
    const {
      type,
      country,
      status,
      isActive = true,
      minHealthScore,
      tags,
      page = 1,
      limit = 20
    } = filters;

    const where: Prisma.ProxyWhereInput = {
      isActive,
      ...(type && { type }),
      ...(country && { country }),
      ...(status && { status }),
      ...(minHealthScore && { healthScore: { gte: minHealthScore } }),
      ...(tags && tags.length > 0 && { 
        tags: { hasSome: tags } 
      })
    };

    const [proxies, total] = await Promise.all([
      this.prisma.proxy.findMany({
        where,
        include: {
          accountAssignments: {
            where: { isActive: true },
            select: { id: true, accountId: true }
          }
        },
        orderBy: { healthScore: 'desc' },
        take: limit,
        skip: (page - 1) * limit
      }),
      this.prisma.proxy.count({ where })
    ]);

    return { proxies, total };
  }

  async createProxy(proxyData: Partial<Proxy>): Promise<Proxy> {
    return this.prisma.proxy.create({
      data: {
        name: proxyData.name,
        type: proxyData.type!,
        host: proxyData.host!,
        port: proxyData.port!,
        username: proxyData.username,
        password: proxyData.password,
        country: proxyData.country || 'Unknown',
        region: proxyData.region || 'Unknown',
        city: proxyData.city,
        isp: proxyData.isp,
        asn: proxyData.asn,
        status: proxyData.status || ProxyStatus.INACTIVE,
        healthScore: proxyData.healthScore || 100,
        responseTime: proxyData.responseTime,
        uptime: proxyData.uptime || 0.0,
        maxConnections: proxyData.maxConnections || 10,
        currentConnections: 0,
        bandwidthLimit: proxyData.bandwidthLimit,
        protocols: (proxyData.protocols || []) as Prisma.InputJsonValue,
        features: (proxyData.features || {}) as Prisma.InputJsonValue,
        tags: proxyData.tags || [],
        notes: proxyData.notes,
        isActive: proxyData.isActive ?? true,
        createdBy: proxyData.createdBy
      }
    });
  }

  async updateProxy(id: string, updateData: Partial<Proxy>): Promise<Proxy> {
    return this.prisma.proxy.update({
      where: { id },
      // Prisma UpdateInput types are stricter than model types (especially Json fields).
      // Keep the update surface flexible but ensure compilation succeeds.
      data: { ...updateData, updatedAt: new Date() } as any,
    });
  }

  async updateProxyStatus(id: string, status: ProxyStatus, healthScore?: number): Promise<Proxy> {
    return this.prisma.proxy.update({
      where: { id },
      data: {
        status,
        ...(healthScore !== undefined && { healthScore }),
        lastChecked: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async deleteProxy(id: string): Promise<Proxy> {
    return this.prisma.proxy.delete({
      where: { id },
      include: {
        accountAssignments: true,
        healthLogs: true,
        usageStats: true
      }
    });
  }

  async softDeleteProxy(id: string): Promise<Proxy> {
    return this.prisma.proxy.update({
      where: { id },
      data: {
        isActive: false,
        status: ProxyStatus.MAINTENANCE,
        updatedAt: new Date()
      }
    });
  }

  // Health monitoring
  async createHealthLog(healthData: Partial<ProxyHealthLog>): Promise<ProxyHealthLog> {
    return this.prisma.proxyHealthLog.create({
      data: {
        proxyId: healthData.proxyId!,
        testType: healthData.testType || 'CONNECTIVITY',
        isHealthy: healthData.isHealthy!,
        responseTime: healthData.responseTime,
        downloadSpeed: healthData.downloadSpeed,
        uploadSpeed: healthData.uploadSpeed,
        error: healthData.error,
        errorMessage: healthData.errorMessage,
        metadata: healthData.metadata || {},
        ipAddress: healthData.ipAddress,
        country: healthData.country,
        anonymityLevel: healthData.anonymityLevel
      }
    });
  }

  async getRecentHealthLogs(
    proxyId: string,
    hours: number = 24,
    limit: number = 100
  ): Promise<ProxyHealthLog[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.prisma.proxyHealthLog.findMany({
      where: {
        proxyId,
        createdAt: { gte: since }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getHealthSummary(proxyId: string, hours: number = 24): Promise<any> {
    const logs = await this.getRecentHealthLogs(proxyId, hours);
    
    const totalTests = logs.length;
    const successfulTests = logs.filter(log => log.isHealthy).length;
    const avgResponseTime = logs
      .filter(log => log.responseTime)
      .reduce((sum, log) => sum + log.responseTime!, 0) / logs.length;

    return {
      totalTests,
      successfulTests,
      successRate: totalTests > 0 ? (successfulTests / totalTests) * 100 : 0,
      avgResponseTime,
      lastTest: logs[0]?.createdAt,
      healthTrend: this.calculateHealthTrend(logs)
    };
  }

  // Usage statistics
  async createUsageStats(usageData: Partial<ProxyUsageStats>): Promise<ProxyUsageStats> {
    return this.prisma.proxyUsageStats.create({
      data: {
        proxyId: usageData.proxyId!,
        date: usageData.date || new Date(),
        hour: usageData.hour || 0,
        requests: usageData.requests || 0,
        successfulRequests: usageData.successfulRequests || 0,
        failedRequests: usageData.failedRequests || 0,
        bytesTransferred: usageData.bytesTransferred || BigInt(0),
        avgResponseTime: usageData.avgResponseTime,
        peakConnections: usageData.peakConnections || 0,
        errors: usageData.errors || {},
        topDestinations: usageData.topDestinations || {}
      }
    });
  }

  async getUsageStats(
    proxyId: string,
    days: number = 7,
    hourly: boolean = false
  ): Promise<ProxyUsageStats[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const where = {
      proxyId,
      date: { gte: since }
    };

    if (hourly) {
      return this.prisma.proxyUsageStats.findMany({
        where,
        orderBy: { date: 'desc', hour: 'desc' },
        take: 24 * days // hours * days
      });
    } else {
      return this.prisma.proxyUsageStats.findMany({
        where,
        orderBy: { date: 'desc' },
        take: days
      });
    }
  }

  async updateProxyUsage(
    proxyId: string,
    bandwidthUsed: bigint,
    currentConnections?: number
  ): Promise<Proxy> {
    return this.prisma.proxy.update({
      where: { id: proxyId },
      data: {
        bandwidthUsed: { increment: bandwidthUsed },
        lastUsedAt: new Date(),
        ...(currentConnections !== undefined && { currentConnections })
      }
    });
  }

  // Metrics
  async createProxyMetric(metricData: Partial<ProxyMetric>): Promise<ProxyMetric> {
    return this.prisma.proxyMetric.create({
      data: {
        proxyId: metricData.proxyId!,
        date: metricData.date || new Date(),
        uptime: metricData.uptime || 0.0,
        avgResponseTime: metricData.avgResponseTime,
        successRate: metricData.successRate || 0.0,
        totalRequests: metricData.totalRequests || 0,
        totalBytes: metricData.totalBytes || BigInt(0),
        errorRate: metricData.errorRate || 0.0,
        bandwidthUsage: metricData.bandwidthUsage || BigInt(0)
      }
    });
  }

  async getProxyMetrics(proxyId: string, days: number = 30): Promise<ProxyMetric[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return this.prisma.proxyMetric.findMany({
      where: { proxyId, date: { gte: since } },
      orderBy: { date: 'asc' }
    });
  }

  // Account assignments
  async createAccountAssignment(assignmentData: Partial<AccountProxyAssignment>): Promise<AccountProxyAssignment> {
    return this.prisma.accountProxyAssignment.create({
      data: {
        accountId: assignmentData.accountId!,
        proxyId: assignmentData.proxyId!,
        priority: assignmentData.priority || 0,
        weight: assignmentData.weight || 1.0,
        isActive: assignmentData.isActive ?? true,
        settings: assignmentData.settings || {}
      }
    });
  }

  async getProxyAssignments(proxyId: string): Promise<AccountProxyAssignment[]> {
    return this.prisma.accountProxyAssignment.findMany({
      where: { proxyId, isActive: true },
      include: {
        account: {
          select: { id: true, phone: true, username: true, status: true }
        }
      },
      orderBy: { priority: 'desc', weight: 'desc' }
    });
  }

  async updateAssignmentUsage(id: string): Promise<AccountProxyAssignment> {
    return this.prisma.accountProxyAssignment.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    });
  }

  // Bulk operations
  async bulkUpdateHealthScores(updates: Array<{ id: string; score: number; status: ProxyStatus }>): Promise<void> {
    await this.prisma.$transaction(
      updates.map(update => 
        this.prisma.proxy.update({
          where: { id: update.id },
          data: {
            healthScore: update.score,
            status: update.status,
            lastChecked: new Date(),
            updatedAt: new Date()
          }
        })
      )
    );
  }

  async getProxyPoolStats(): Promise<any> {
    const [
      totalProxies,
      activeProxies,
      healthyProxies,
      byType,
      byCountry,
      avgUptime,
      totalBandwidth
    ] = await Promise.all([
      this.prisma.proxy.count(),
      this.prisma.proxy.count({ where: { isActive: true, status: 'ACTIVE' } }),
      this.prisma.proxy.count({ 
        where: { isActive: true, healthScore: { gte: 80 } } 
      }),
      this.prisma.$queryRaw`SELECT type, COUNT(*) as count FROM proxies WHERE isActive = true GROUP BY type`,
      this.prisma.$queryRaw`SELECT country, COUNT(*) as count FROM proxies WHERE isActive = true GROUP BY country`,
      this.prisma.proxy.aggregate({ 
        where: { isActive: true },
        _avg: { uptime: true } 
      }),
      this.prisma.proxy.aggregate({ 
        where: { isActive: true },
        _sum: { bandwidthUsed: true } 
      })
    ]);

    return {
      total: totalProxies,
      active: activeProxies,
      healthy: healthyProxies,
      healthRate: totalProxies > 0 ? (healthyProxies / totalProxies) * 100 : 0,
      byType,
      byCountry,
      avgUptime: avgUptime._avg.uptime || 0,
      totalBandwidth: totalBandwidth._sum.bandwidthUsed || BigInt(0)
    };
  }

  // Cleanup operations
  async cleanupOldLogs(days: number = 30): Promise<{ deleted: { healthLogs: number; usageStats: number } }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const [deletedHealthLogs, deletedUsageStats] = await Promise.all([
      this.prisma.proxyHealthLog.deleteMany({
        where: { createdAt: { lt: since } }
      }),
      this.prisma.proxyUsageStats.deleteMany({
        where: { date: { lt: since } }
      })
    ]);

    return {
      deleted: {
        healthLogs: deletedHealthLogs.count,
        usageStats: deletedUsageStats.count
      }
    };
  }

  // Helper methods
  private calculateHealthTrend(logs: ProxyHealthLog[]): 'improving' | 'stable' | 'degrading' {
    if (logs.length < 10) return 'stable';
    
    const recent = logs.slice(0, 5);
    const older = logs.slice(5, 10);
    
    const recentSuccessRate = recent.filter(log => log.isHealthy).length / recent.length;
    const olderSuccessRate = older.filter(log => log.isHealthy).length / older.length;
    
    if (recentSuccessRate > olderSuccessRate + 0.1) return 'improving';
    if (recentSuccessRate < olderSuccessRate - 0.1) return 'degrading';
    return 'stable';
  }

  // Search and filtering
  async searchProxies(
    query: string,
    filters: any = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<{ proxies: Proxy[]; total: number }> {
    const where = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { host: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
        { region: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } }
      ],
      ...filters
    };

    const [proxies, total] = await Promise.all([
      this.prisma.proxy.findMany({
        where,
        orderBy: { healthScore: 'desc' },
        take: limit,
        skip: offset
      }),
      this.prisma.proxy.count({ where })
    ]);

    return { proxies, total };
  }
}