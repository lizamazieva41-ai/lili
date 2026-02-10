import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class SecurityAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAuthFailures() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM auth_failures_view ORDER BY failure_count DESC LIMIT 20
    `;
    return result;
  }

  async getSecurityEvents() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM security_events_daily_view ORDER BY date DESC, severity
    `;
    return result;
  }

  async getSecurityOverview() {
    const result = await this.prisma.$queryRaw`
      SELECT
        DATE(al."createdAt") as date,
        COUNT(CASE WHEN al.event = 'LOGIN_FAILED' THEN 1 END) as failed_logins,
        COUNT(CASE WHEN al.severity = 'HIGH' THEN 1 END) as high_severity_events,
        COUNT(CASE WHEN al.severity = 'CRITICAL' THEN 1 END) as critical_events,
        COUNT(DISTINCT al."userId") as affected_users,
        array_agg(DISTINCT al."ipAddress") FILTER (WHERE al.event = 'LOGIN_FAILED') as suspicious_ips
      FROM auth_audit_log al
      WHERE al."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(al."createdAt")
      ORDER BY date DESC
    `;
    return result;
  }

  async getTopFailingIPs(limit = 10) {
    const result = await this.prisma.$queryRaw`
      SELECT
        "ipAddress",
        COUNT(*) as failure_count,
        COUNT(DISTINCT "userId") as unique_users,
        array_agg(DISTINCT "userAgent") as user_agents,
        MAX("createdAt") as last_attempt
      FROM auth_audit_log
      WHERE event = 'LOGIN_FAILED'
        AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY "ipAddress"
      ORDER BY failure_count DESC
      LIMIT ${limit}
    `;
    return result;
  }

  async getSecurityAnomalyScore() {
    // Calculate anomaly scores based on unusual patterns
    const result = await this.prisma.$queryRaw`
      SELECT
        "userId",
        COUNT(CASE WHEN event = 'LOGIN_FAILED' THEN 1 END) as failed_attempts,
        COUNT(DISTINCT "ipAddress") as unique_ips,
        COUNT(DISTINCT DATE("createdAt")) as active_days,
        ROUND(
          (COUNT(CASE WHEN event = 'LOGIN_FAILED' THEN 1 END) * 1.0 / GREATEST(COUNT(*), 1)) * 100, 2
        ) as failure_rate,
        CASE
          WHEN COUNT(CASE WHEN event = 'LOGIN_FAILED' THEN 1 END) > 10 THEN 'CRITICAL'
          WHEN COUNT(CASE WHEN event = 'LOGIN_FAILED' THEN 1 END) > 5 THEN 'HIGH'
          WHEN COUNT(DISTINCT "ipAddress") > 3 THEN 'MEDIUM'
          ELSE 'LOW'
        END as risk_level
      FROM auth_audit_log
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY "userId"
      HAVING COUNT(*) > 5
      ORDER BY failure_rate DESC, failed_attempts DESC
      LIMIT 20
    `;
    return result;
  }

  async getRecentSecurityAlerts() {
    const result = await this.prisma.$queryRaw`
      SELECT
        sa.*,
        u.username,
        u.email
      FROM security_alerts sa
      LEFT JOIN users u ON sa."userId" = u.id
      WHERE sa."isActive" = true
      ORDER BY sa."createdAt" DESC
      LIMIT 50
    `;
    return result;
  }
}