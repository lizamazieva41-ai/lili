import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class CampaignAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getCampaignStats(userId?: string) {
    const query = userId
      ? `SELECT * FROM campaign_stats_view WHERE "userId" = $1 ORDER BY messages_total DESC`
      : `SELECT * FROM campaign_stats_view ORDER BY messages_total DESC LIMIT 50`;

    const result = userId
      ? await this.prisma.$queryRawUnsafe(query, userId)
      : await this.prisma.$queryRawUnsafe(query);
    return result;
  }

  async getMessageLatency() {
    const result = await this.prisma.$queryRaw`
      SELECT
        "campaignId",
        AVG(sent_to_delivered_seconds) as avg_delivery_time,
        AVG(delivered_to_read_seconds) as avg_read_time,
        AVG(total_response_time_seconds) as avg_total_time,
        COUNT(*) as messages_analyzed
      FROM message_status_time_view
      WHERE sent_to_delivered_seconds IS NOT NULL
      GROUP BY "campaignId"
      ORDER BY avg_delivery_time DESC
    `;
    return result;
  }

  async getCampaignPerformance(campaignId: string) {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM campaign_stats_view WHERE campaign_id = ${campaignId}
    `;
    return result;
  }

  async getTopPerformingCampaigns(limit = 10) {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM campaign_stats_view
      WHERE success_rate > 50
      ORDER BY success_rate DESC, messages_total DESC
      LIMIT ${limit}
    `;
    return result;
  }

  async getCampaignFunnel() {
    const result = await this.prisma.$queryRaw`
      SELECT
        DATE(c.created_at) as date,
        COUNT(*) as campaigns_created,
        COUNT(CASE WHEN csv.messages_total > 0 THEN 1 END) as campaigns_with_messages,
        SUM(csv.messages_total) as total_messages,
        SUM(csv.delivered) as total_delivered,
        SUM(csv.read) as total_read
      FROM campaigns c
      LEFT JOIN campaign_stats_view csv ON c.id = csv.campaign_id
      WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(c.created_at)
      ORDER BY date DESC
    `;
    return result;
  }
}