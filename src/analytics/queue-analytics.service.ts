import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class QueueAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getQueueStats() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM queue_realtime_stats_view ORDER BY queue_name
    `;
    return result;
  }

  async getJobFailureAnalysis() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM job_type_failure_view ORDER BY failure_rate DESC
    `;
    return result;
  }

  async getQueuePerformance() {
    const result = await this.prisma.$queryRaw`
      SELECT
        q.name as queue_name,
        COUNT(j.id) as total_jobs,
        COUNT(CASE WHEN j.status = 'COMPLETED' THEN 1 END) as completed_jobs,
        COUNT(CASE WHEN j.status = 'FAILED' THEN 1 END) as failed_jobs,
        COUNT(CASE WHEN j.status = 'RUNNING' THEN 1 END) as running_jobs,
        ROUND(
          CASE
            WHEN COUNT(j.id) > 0
            THEN (COUNT(CASE WHEN j.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(j.id))
            ELSE 0
          END, 2
        ) as success_rate,
        AVG(EXTRACT(EPOCH FROM (j.updated_at - j.created_at))) as avg_processing_time
      FROM queues q
      LEFT JOIN jobs j ON q.name = j.queue
      WHERE j.created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY q.name
      ORDER BY total_jobs DESC
    `;
    return result;
  }

  async getJobTypePerformance() {
    const result = await this.prisma.$queryRaw`
      SELECT
        type,
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed,
        ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as avg_duration_seconds,
        ROUND(STDDEV(EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as duration_stddev
      FROM jobs
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY type
      ORDER BY total_jobs DESC
    `;
    return result;
  }

  async getQueueCongestionPrediction() {
    // Simple prediction based on recent trends
    const result = await this.prisma.$queryRaw`
      SELECT
        queue,
        COUNT(*) as jobs_last_hour,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failures_last_hour,
        ROUND(
          CASE
            WHEN COUNT(*) > 0
            THEN (COUNT(CASE WHEN status = 'FAILED' THEN 1 END) * 100.0 / COUNT(*))
            ELSE 0
          END, 2
        ) as failure_rate_percent,
        CASE
          WHEN COUNT(*) > 50 THEN 'HIGH_LOAD'
          WHEN COUNT(CASE WHEN status = 'FAILED' THEN 1 END) > 5 THEN 'HIGH_FAILURE'
          ELSE 'NORMAL'
        END as congestion_level
      FROM jobs
      WHERE created_at >= NOW() - INTERVAL '1 hour'
      GROUP BY queue
      ORDER BY jobs_last_hour DESC
    `;
    return result;
  }
}