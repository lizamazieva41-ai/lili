import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardOverview() {
    // Get overall system statistics
    const [
      totalUsers,
      totalLicenses,
      totalCampaigns,
      totalMessages,
      activeJobs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.license.count(),
      this.prisma.campaign.count(),
      this.prisma.message.count(),
      this.prisma.job.count({ where: { status: 'RUNNING' } }),
    ]);

    return {
      totalUsers,
      totalLicenses,
      totalCampaigns,
      totalMessages,
      activeJobs,
      timestamp: new Date().toISOString(),
    };
  }

  async getSystemHealth() {
    // Get recent metrics from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [
      recentRequests,
      recentErrors,
      recentJobs,
    ] = await Promise.all([
      this.prisma.usageLog.count({
        where: { createdAt: { gte: oneHourAgo } }
      }),
      this.prisma.authAuditLog.count({
        where: {
          createdAt: { gte: oneHourAgo },
          severity: 'HIGH'
        }
      }),
      this.prisma.job.count({
        where: {
          createdAt: { gte: oneHourAgo },
          status: 'FAILED'
        }
      }),
    ]);

    return {
      requestsLastHour: recentRequests,
      errorsLastHour: recentErrors,
      failedJobsLastHour: recentJobs,
      health: recentErrors > 10 ? 'WARNING' : 'HEALTHY',
      timestamp: new Date().toISOString(),
    };
  }
}