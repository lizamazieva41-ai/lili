import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LicenseAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDailyUsage(userId?: string) {
    const query = userId
      ? `SELECT * FROM license_daily_usage_view WHERE "userId" = $1 ORDER BY date DESC LIMIT 30`
      : `SELECT * FROM license_daily_usage_view ORDER BY date DESC LIMIT 30`;

    const result = userId
      ? await this.prisma.$queryRawUnsafe(query, userId)
      : await this.prisma.$queryRawUnsafe(query);
    return result;
  }

  async getPlanAggregation() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM license_plan_agg_view ORDER BY plan
    `;
    return result;
  }

  async getUsageForecast(licenseId: string) {
    // Simple forecasting based on last 7 days average
    const result = await this.prisma.$queryRaw`
      SELECT
        license_id,
        AVG(total_requests) as avg_daily_requests,
        AVG(messages_sent) as avg_daily_messages,
        AVG(usage_ratio) as avg_usage_ratio,
        COUNT(*) as days_analyzed
      FROM license_daily_usage_view
      WHERE license_id = ${licenseId}
        AND date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY license_id
    `;
    return result;
  }

  async getTopUsageLicenses(limit = 10) {
    const result = await this.prisma.$queryRaw`
      SELECT
        license_id,
        "userId",
        plan,
        SUM(total_requests) as total_requests,
        AVG(usage_ratio) as avg_usage_ratio
      FROM license_daily_usage_view
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY license_id, "userId", plan
      ORDER BY total_requests DESC
      LIMIT ${limit}
    `;
    return result;
  }
}