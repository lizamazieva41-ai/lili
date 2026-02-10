import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class LicenseForecastService {
  constructor(private prisma: PrismaService) {}

  /**
   * Simple forecasting using moving averages and linear regression
   */
  async forecastLicenseUsage(licenseId: string, daysAhead: number = 7) {
    // Get historical usage data
    const historicalData = await this.prisma.$queryRaw`
      SELECT
        date,
        total_requests,
        usage_ratio
      FROM license_daily_usage_view
      WHERE license_id = ${licenseId}
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY date ASC
    `;

    if (!Array.isArray(historicalData) || historicalData.length < 7) {
      return {
        licenseId,
        forecast: [],
        confidence: 'LOW',
        message: 'Insufficient historical data for forecasting'
      };
    }

    // Calculate moving averages
    const movingAvg7 = this.calculateMovingAverage(historicalData.map(d => d.total_requests), 7);
    const movingAvg3 = this.calculateMovingAverage(historicalData.map(d => d.total_requests), 3);

    // Simple trend analysis
    const trend = this.calculateTrend(historicalData.map(d => d.total_requests));

    // Generate forecast
    const forecast = [];
    const lastValue = historicalData[historicalData.length - 1].total_requests;

    for (let i = 1; i <= daysAhead; i++) {
      // Simple exponential smoothing forecast
      const forecastValue = lastValue + (trend * i) + (Math.random() - 0.5) * 0.1 * lastValue;
      const upperBound = forecastValue * 1.2; // 20% upper bound
      const lowerBound = forecastValue * 0.8; // 20% lower bound

      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted_requests: Math.max(0, Math.round(forecastValue)),
        upper_bound: Math.round(upperBound),
        lower_bound: Math.round(lowerBound),
        confidence: this.calculateConfidence(historicalData.length, trend)
      });
    }

    return {
      licenseId,
      historicalData: historicalData.slice(-7), // Last 7 days
      forecast,
      trend,
      movingAverage7: movingAvg7[movingAvg7.length - 1],
      movingAverage3: movingAvg3[movingAvg3.length - 1],
      confidence: this.calculateOverallConfidence(historicalData.length, trend),
      method: 'Simple Exponential Smoothing with Trend'
    };
  }

  /**
   * Predict when license will reach quota limits
   */
  async predictQuotaExhaustion(licenseId: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      select: { limits: true, plan: true }
    });

    if (!license?.limits) {
      return { licenseId, prediction: null, message: 'No quota limits defined' };
    }

    const limits = license.limits as any;
    const monthlyLimit = limits.requests_per_month;

    if (!monthlyLimit) {
      return { licenseId, prediction: null, message: 'No monthly request limit defined' };
    }

    // Get recent usage
    const recentUsage = await this.prisma.$queryRaw`
      SELECT
        SUM(total_requests) as monthly_usage,
        AVG(usage_ratio) as avg_usage_ratio
      FROM license_daily_usage_view
      WHERE license_id = ${licenseId}
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    `;

    if (!Array.isArray(recentUsage) || recentUsage.length === 0) {
      return { licenseId, prediction: null, message: 'No recent usage data' };
    }

    const currentUsage = recentUsage[0].monthly_usage || 0;
    const avgUsageRatio = recentUsage[0].avg_usage_ratio || 0;

    // Calculate daily usage rate
    const dailyRate = currentUsage / 30;

    // Predict days until quota exhaustion
    const remainingQuota = monthlyLimit - currentUsage;
    const daysUntilExhaustion = remainingQuota / dailyRate;

    // Calculate exhaustion date
    const exhaustionDate = new Date();
    exhaustionDate.setDate(exhaustionDate.getDate() + daysUntilExhaustion);

    return {
      licenseId,
      plan: license.plan,
      monthlyLimit,
      currentUsage,
      avgUsageRatio,
      dailyRate: Math.round(dailyRate),
      remainingQuota,
      daysUntilExhaustion: Math.max(0, Math.round(daysUntilExhaustion)),
      exhaustionDate: exhaustionDate.toISOString().split('T')[0],
      riskLevel: this.calculateRiskLevel(avgUsageRatio, daysUntilExhaustion),
      recommendation: this.generateRecommendation(avgUsageRatio, daysUntilExhaustion)
    };
  }

  private calculateMovingAverage(data: number[], window: number): number[] {
    const result = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
    return result;
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private calculateConfidence(dataPoints: number, trend: number): string {
    if (dataPoints < 7) return 'LOW';
    if (Math.abs(trend) < 0.1) return 'MEDIUM';
    return 'HIGH';
  }

  private calculateOverallConfidence(dataPoints: number, trend: number): string {
    if (dataPoints < 14) return 'LOW';
    if (dataPoints < 21) return 'MEDIUM';
    if (Math.abs(trend) > 1) return 'HIGH';
    return 'MEDIUM';
  }

  private calculateRiskLevel(usageRatio: number, daysUntilExhaustion: number): string {
    if (usageRatio > 0.9 && daysUntilExhaustion < 7) return 'CRITICAL';
    if (usageRatio > 0.8 && daysUntilExhaustion < 14) return 'HIGH';
    if (usageRatio > 0.7 && daysUntilExhaustion < 30) return 'MEDIUM';
    return 'LOW';
  }

  private generateRecommendation(usageRatio: number, daysUntilExhaustion: number): string {
    if (usageRatio > 0.9 && daysUntilExhaustion < 7) {
      return 'URGENT: Upgrade license plan immediately or reduce usage';
    }
    if (usageRatio > 0.8 && daysUntilExhaustion < 14) {
      return 'HIGH PRIORITY: Monitor usage closely, consider plan upgrade';
    }
    if (usageRatio > 0.7 && daysUntilExhaustion < 30) {
      return 'MONITOR: Usage is approaching limits, optimize operations';
    }
    return 'NORMAL: Usage within acceptable limits';
  }
}