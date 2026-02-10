import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DataRetentionService {
  private readonly logger = new Logger(DataRetentionService.name);

  constructor(private prisma: PrismaService) {}

  // Data retention policies
  private readonly RETENTION_POLICIES = {
    // Debug logs: 30 days
    debugLogs: 30,
    // Error logs: 6 months
    errorLogs: 180,
    // Auth audit logs: 2 years
    authAuditLogs: 730,
    // Usage logs: 1 year
    usageLogs: 365,
    // Job executions: 90 days
    jobExecutions: 90,
    // Metrics data: 6 months
    metrics: 180,
  };

  // Cron job to clean up old data - runs daily at 2 AM
  @Cron('0 2 * * *')
  async cleanupExpiredData() {
    this.logger.log('Starting data retention cleanup...');

    try {
      const results = await Promise.allSettled([
        this.cleanupDebugLogs(),
        this.cleanupErrorLogs(),
        this.cleanupAuthAuditLogs(),
        this.cleanupUsageLogs(),
        this.cleanupJobExecutions(),
        this.cleanupOldMetrics(),
        this.archiveOldData(),
      ]);

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failureCount = results.filter(r => r.status === 'rejected').length;

      this.logger.log(`Data retention cleanup completed: ${successCount} successful, ${failureCount} failed`);

      if (failureCount > 0) {
        this.logger.error('Some cleanup tasks failed:', {
          failures: results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason)
        });
      }
    } catch (error) {
      this.logger.error('Data retention cleanup failed:', error);
    }
  }

  private async cleanupDebugLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.debugLogs);

    const result = await this.prisma.messageLog.deleteMany({
      where: {
        level: 'DEBUG',
        timestamp: {
          lt: cutoffDate
        }
      }
    });

    this.logger.log(`Cleaned up ${result.count} debug log entries`);
    return result.count;
  }

  private async cleanupErrorLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.errorLogs);

    const result = await this.prisma.messageLog.deleteMany({
      where: {
        level: 'ERROR',
        timestamp: {
          lt: cutoffDate
        }
      }
    });

    this.logger.log(`Cleaned up ${result.count} error log entries`);
    return result.count;
  }

  private async cleanupAuthAuditLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.authAuditLogs);

    const result = await this.prisma.authAuditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        severity: {
          not: 'CRITICAL' // Keep critical security events longer
        }
      }
    });

    this.logger.log(`Cleaned up ${result.count} auth audit log entries`);
    return result.count;
  }

  private async cleanupUsageLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.usageLogs);

    const result = await this.prisma.usageLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    this.logger.log(`Cleaned up ${result.count} usage log entries`);
    return result.count;
  }

  private async cleanupJobExecutions() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.jobExecutions);

    const result = await this.prisma.jobExecution.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    this.logger.log(`Cleaned up ${result.count} job execution entries`);
    return result.count;
  }

  private async cleanupOldMetrics() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_POLICIES.metrics);

    const results = await Promise.all([
      this.prisma.licenseMetrics.deleteMany({
        where: { createdAt: { lt: cutoffDate } }
      }),
      this.prisma.jobMetric.deleteMany({
        where: { createdAt: { lt: cutoffDate } }
      }),
      this.prisma.proxyMetric.deleteMany({
        where: { createdAt: { lt: cutoffDate } }
      })
    ]);

    const totalDeleted = results.reduce((sum: number, result: { count: number }) => sum + result.count, 0);
    this.logger.log(`Cleaned up ${totalDeleted} old metrics entries`);
    return totalDeleted;
  }

  private async archiveOldData() {
    // Archive critical security events older than 1 year to separate table
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Create archive table if it doesn't exist
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS security_events_archive (
        LIKE security_alerts INCLUDING ALL
      )
    `;

    // Move old critical alerts to archive
    await this.prisma.$executeRaw`
      INSERT INTO security_events_archive
      SELECT * FROM security_alerts
      WHERE "createdAt" < ${oneYearAgo}
        AND severity = 'CRITICAL'
        AND "isResolved" = true
    `;

    // Delete archived records from main table
    const archivedCount = await this.prisma.securityAlert.deleteMany({
      where: {
        createdAt: { lt: oneYearAgo },
        severity: 'CRITICAL',
        isResolved: true
      }
    });

    this.logger.log(`Archived ${archivedCount.count} old security events`);
    return archivedCount.count;
  }

  // Manual cleanup method for testing
  async manualCleanup() {
    this.logger.log('Running manual data retention cleanup...');
    return this.cleanupExpiredData();
  }

  // Get retention statistics
  async getRetentionStats() {
    const [
      debugLogsCount,
      errorLogsCount,
      authLogsCount,
      usageLogsCount,
      jobExecutionsCount,
      metricsCount,
    ] = await Promise.all([
      this.prisma.messageLog.count({ where: { level: 'DEBUG' } }),
      this.prisma.messageLog.count({ where: { level: 'ERROR' } }),
      this.prisma.authAuditLog.count(),
      this.prisma.usageLog.count(),
      this.prisma.jobExecution.count(),
      (await this.prisma.licenseMetrics.count()) +
        (await this.prisma.jobMetric.count()) +
        (await this.prisma.proxyMetric.count()),
    ]);

    return {
      currentCounts: {
        debugLogs: debugLogsCount,
        errorLogs: errorLogsCount,
        authAuditLogs: authLogsCount,
        usageLogs: usageLogsCount,
        jobExecutions: jobExecutionsCount,
        metrics: metricsCount,
      },
      retentionPolicies: this.RETENTION_POLICIES,
      lastCleanup: new Date().toISOString(), // In real implementation, track this in DB
    };
  }
}