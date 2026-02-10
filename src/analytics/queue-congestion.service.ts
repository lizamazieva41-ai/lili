import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class QueueCongestionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Analyze queue congestion patterns and predict overload
   */
  async analyzeQueueCongestion(queueName?: string) {
    const queues = queueName ? [queueName] : await this.getAllQueueNames();

    const results = await Promise.all(
      queues.map(queue => this.analyzeSingleQueue(queue))
    );

    return {
      analysis: results,
      summary: this.generateCongestionSummary(results),
      timestamp: new Date().toISOString()
    };
  }

  private async analyzeSingleQueue(queueName: string) {
    // Get recent queue metrics (last 24 hours)
    const queueMetrics = await this.prisma.$queryRaw`
      SELECT
        date,
        hour,
        requests,
        successful_requests,
        failed_requests,
        avg_response_time,
        peak_connections
      FROM proxy_usage_stats
      WHERE date >= CURRENT_DATE - INTERVAL '1 day'
      ORDER BY date DESC, hour DESC
      LIMIT 24
    `;

    // Get current queue depth from view
    const currentStats = await this.prisma.$queryRaw`
      SELECT * FROM queue_realtime_stats_view WHERE queue_name = ${queueName}
    `;

    const currentDepth = Array.isArray(currentStats) && currentStats.length > 0
      ? currentStats[0].pending_jobs || 0
      : 0;

    // Calculate congestion metrics
    const congestionMetrics = this.calculateCongestionMetrics(queueMetrics as any[], currentDepth);

    // Predict future congestion
    const prediction = this.predictCongestion(congestionMetrics);

    return {
      queueName,
      currentDepth,
      congestionMetrics,
      prediction,
      riskLevel: this.assessRiskLevel(congestionMetrics, prediction),
      recommendations: this.generateRecommendations(congestionMetrics, prediction)
    };
  }

  private calculateCongestionMetrics(metrics: any[], currentDepth: number) {
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return {
        avgRequestsPerHour: 0,
        avgFailureRate: 0,
        avgResponseTime: 0,
        peakRequests: 0,
        trend: 'stable',
        volatility: 0
      };
    }

    const requests = metrics.map(m => m.requests || 0);
    const failures = metrics.map(m => m.failed_requests || 0);
    const responseTimes = metrics.filter(m => m.avg_response_time).map(m => m.avg_response_time);

    const avgRequestsPerHour = requests.reduce((a, b) => a + b, 0) / requests.length;
    const avgFailureRate = failures.length > 0
      ? (failures.reduce((a, b) => a + b, 0) / requests.reduce((a, b) => a + b, 0)) * 100
      : 0;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const peakRequests = Math.max(...requests);

    // Calculate trend (simple linear regression slope)
    const trend = this.calculateTrend(requests);

    // Calculate volatility (coefficient of variation)
    const mean = avgRequestsPerHour;
    const variance = requests.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / requests.length;
    const volatility = mean > 0 ? Math.sqrt(variance) / mean : 0;

    return {
      avgRequestsPerHour: Math.round(avgRequestsPerHour),
      avgFailureRate: Math.round(avgFailureRate * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      peakRequests,
      currentDepth,
      trend: trend > 0.5 ? 'increasing' : trend < -0.5 ? 'decreasing' : 'stable',
      volatility: Math.round(volatility * 100) / 100,
      dataPoints: metrics.length
    };
  }

  private predictCongestion(metrics: any) {
    const { avgRequestsPerHour, trend, volatility, currentDepth } = metrics;

    // Simple prediction based on trend and current load
    const predictedLoad1Hour = Math.max(0, avgRequestsPerHour + (trend * 10));
    const predictedLoad4Hours = Math.max(0, avgRequestsPerHour + (trend * 40));

    // Calculate risk scores
    const currentRisk = this.calculateLoadRisk(currentDepth, avgRequestsPerHour);
    const predictedRisk1H = this.calculateLoadRisk(predictedLoad1Hour * 1.2, predictedLoad1Hour);
    const predictedRisk4H = this.calculateLoadRisk(predictedLoad4Hours * 1.2, predictedLoad4Hours);

    return {
      nextHour: {
        predictedLoad: Math.round(predictedLoad1Hour),
        riskScore: predictedRisk1H,
        riskLevel: this.riskScoreToLevel(predictedRisk1H)
      },
      next4Hours: {
        predictedLoad: Math.round(predictedLoad4Hours),
        riskScore: predictedRisk4H,
        riskLevel: this.riskScoreToLevel(predictedRisk4H)
      },
      confidence: volatility < 0.3 ? 'HIGH' : volatility < 0.6 ? 'MEDIUM' : 'LOW'
    };
  }

  private calculateLoadRisk(depth: number, throughput: number): number {
    // Risk score from 0-100 based on queue depth and throughput
    const depthRisk = Math.min(100, (depth / 100) * 50); // 50% weight for depth
    const throughputRisk = Math.min(100, (throughput / 1000) * 50); // 50% weight for throughput

    return Math.round(depthRisk + throughputRisk);
  }

  private riskScoreToLevel(score: number): string {
    if (score >= 70) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  private assessRiskLevel(metrics: any, prediction: any): string {
    const currentRisk = this.calculateLoadRisk(metrics.currentDepth, metrics.avgRequestsPerHour);
    const maxPredictedRisk = Math.max(prediction.nextHour.riskScore, prediction.next4Hours.riskScore);

    return this.riskScoreToLevel(Math.max(currentRisk, maxPredictedRisk));
  }

  private generateRecommendations(metrics: any, prediction: any): string[] {
    const recommendations = [];

    if (metrics.currentDepth > 500) {
      recommendations.push('URGENT: Scale up queue workers immediately');
    }

    if (prediction.nextHour.riskLevel === 'CRITICAL') {
      recommendations.push('Scale workers proactively within next hour');
    }

    if (metrics.avgFailureRate > 10) {
      recommendations.push('Investigate and fix job failure causes');
    }

    if (metrics.trend === 'increasing' && metrics.volatility > 0.5) {
      recommendations.push('Implement load balancing to reduce volatility');
    }

    if (recommendations.length === 0) {
      recommendations.push('Queue performance is within normal parameters');
    }

    return recommendations;
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;

    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private async getAllQueueNames(): Promise<string[]> {
    const queues = await this.prisma.queue.findMany({
      select: { name: true }
    });
    return queues.map(q => q.name);
  }

  private generateCongestionSummary(results: any[]): any {
    const totalQueues = results.length;
    const criticalQueues = results.filter(r => r.riskLevel === 'CRITICAL').length;
    const highRiskQueues = results.filter(r => r.riskLevel === 'HIGH').length;
    const avgRiskScore = results.reduce((sum, r) => {
      const currentRisk = this.calculateLoadRisk(r.currentDepth, r.congestionMetrics.avgRequestsPerHour);
      return sum + currentRisk;
    }, 0) / totalQueues;

    return {
      totalQueues,
      criticalQueues,
      highRiskQueues,
      averageRiskScore: Math.round(avgRiskScore),
      overallHealth: avgRiskScore > 60 ? 'CRITICAL' : avgRiskScore > 40 ? 'WARNING' : 'HEALTHY'
    };
  }
}