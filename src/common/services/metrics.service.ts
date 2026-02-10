import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Gauge, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  // API Metrics
  private readonly requestCount: Counter<string>;
  private readonly requestDuration: Histogram<string>;
  private readonly errorCount: Counter<string>;

  // Queue Metrics
  private readonly jobsEnqueued: Counter<string>;
  private readonly jobsProcessed: Counter<string>;
  private readonly jobFailures: Counter<string>;
  private readonly queueDepth: Gauge<string>;

  // Business Metrics
  private readonly messagesSent: Counter<string>;
  private readonly messagesFailed: Counter<string>;
  private readonly campaignsCreated: Counter<string>;
  private readonly licenseUsage: Gauge<string>;
  private readonly activeUsers: Gauge<string>;
  private readonly activeCampaigns: Gauge<string>;
  private readonly activeAccounts: Gauge<string>;
  
  // Database Metrics
  private readonly dbQueryDuration: Histogram<string>;
  private readonly dbConnections: Gauge<string>;
  
  // Cache Metrics
  private readonly cacheHits: Counter<string>;
  private readonly cacheMisses: Counter<string>;
  private readonly cacheOperations: Counter<string>;

  // TDLib Metrics
  private readonly tdlibRequestsTotal: Counter<string>;
  private readonly tdlibRequestDuration: Histogram<string>;
  private readonly tdlibActiveClients: Gauge<string>;
  private readonly tdlibSessionsTotal: Gauge<string>;
  private readonly tdlibQueueDepth: Gauge<string>;
  private readonly tdlibErrorsTotal: Counter<string>;

  // Worker Metrics
  private readonly workerJobsProcessedTotal: Counter<string>;
  private readonly workerJobsFailedTotal: Counter<string>;
  private readonly workerQueueDepth: Gauge<string>;
  private readonly workerProcessingDuration: Histogram<string>;
  private readonly workerActiveJobs: Gauge<string>;

  constructor() {
    // Enable default metrics collection (CPU, memory, etc.)
    collectDefaultMetrics();

    // API Metrics
    this.requestCount = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.requestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    });

    this.errorCount = new Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Queue Metrics
    this.jobsEnqueued = new Counter({
      name: 'jobs_enqueued_total',
      help: 'Total number of jobs enqueued',
      labelNames: ['queue', 'job_type'],
    });

    this.jobsProcessed = new Counter({
      name: 'jobs_processed_total',
      help: 'Total number of jobs processed',
      labelNames: ['queue', 'job_type', 'status'],
    });

    this.jobFailures = new Counter({
      name: 'job_failures_total',
      help: 'Total number of job failures',
      labelNames: ['queue', 'job_type', 'error_type'],
    });

    this.queueDepth = new Gauge({
      name: 'queue_depth',
      help: 'Current depth of job queues',
      labelNames: ['queue'],
    });

    // Business Metrics
    this.messagesSent = new Counter({
      name: 'messages_sent_total',
      help: 'Total number of messages sent',
      labelNames: ['campaign_id', 'user_id'],
    });

    this.messagesFailed = new Counter({
      name: 'messages_failed_total',
      help: 'Total number of messages that failed to send',
      labelNames: ['campaign_id', 'user_id', 'error_type'],
    });

    this.campaignsCreated = new Counter({
      name: 'campaigns_created_total',
      help: 'Total number of campaigns created',
      labelNames: ['user_id', 'campaign_type'],
    });

    this.licenseUsage = new Gauge({
      name: 'license_usage_ratio',
      help: 'Current license usage ratio (0-1)',
      labelNames: ['license_id', 'user_id'],
    });

    this.activeUsers = new Gauge({
      name: 'active_users',
      help: 'Number of active users',
      labelNames: [],
    });

    this.activeCampaigns = new Gauge({
      name: 'active_campaigns',
      help: 'Number of active campaigns',
      labelNames: ['status'],
    });

    this.activeAccounts = new Gauge({
      name: 'active_telegram_accounts',
      help: 'Number of active Telegram accounts',
      labelNames: ['status'],
    });

    // Database Metrics
    this.dbQueryDuration = new Histogram({
      name: 'db_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.dbConnections = new Gauge({
      name: 'db_connections_active',
      help: 'Number of active database connections',
      labelNames: [],
    });

    // Cache Metrics
    this.cacheHits = new Counter({
      name: 'cache_hits_total',
      help: 'Total number of cache hits',
      labelNames: ['cache_type'],
    });

    this.cacheMisses = new Counter({
      name: 'cache_misses_total',
      help: 'Total number of cache misses',
      labelNames: ['cache_type'],
    });

    this.cacheOperations = new Counter({
      name: 'cache_operations_total',
      help: 'Total number of cache operations',
      labelNames: ['operation', 'cache_type'],
    });

    // TDLib Metrics
    this.tdlibRequestsTotal = new Counter({
      name: 'tdlib_requests_total',
      help: 'Total number of TDLib requests',
      labelNames: ['method', 'status'],
    });

    this.tdlibRequestDuration = new Histogram({
      name: 'tdlib_request_duration_seconds',
      help: 'Duration of TDLib requests in seconds',
      labelNames: ['method'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.tdlibActiveClients = new Gauge({
      name: 'tdlib_active_clients',
      help: 'Number of active TDLib clients',
      labelNames: [],
    });

    this.tdlibSessionsTotal = new Gauge({
      name: 'tdlib_sessions_total',
      help: 'Total number of TDLib sessions',
      labelNames: ['status'],
    });

    this.tdlibQueueDepth = new Gauge({
      name: 'tdlib_queue_depth',
      help: 'Current depth of TDLib-related queues',
      labelNames: ['queue'],
    });

    this.tdlibErrorsTotal = new Counter({
      name: 'tdlib_errors_total',
      help: 'Total number of TDLib errors',
      labelNames: ['error_type', 'error_code'],
    });

    // Worker Metrics
    this.workerJobsProcessedTotal = new Counter({
      name: 'worker_jobs_processed_total',
      help: 'Total number of jobs processed by worker',
      labelNames: ['queue', 'job_type', 'status'],
    });

    this.workerJobsFailedTotal = new Counter({
      name: 'worker_jobs_failed_total',
      help: 'Total number of jobs failed in worker',
      labelNames: ['queue', 'job_type', 'error_type'],
    });

    this.workerQueueDepth = new Gauge({
      name: 'worker_queue_depth',
      help: 'Current depth of worker queues',
      labelNames: ['queue'],
    });

    this.workerProcessingDuration = new Histogram({
      name: 'worker_processing_duration_seconds',
      help: 'Duration of job processing in worker',
      labelNames: ['queue', 'job_type'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
    });

    this.workerActiveJobs = new Gauge({
      name: 'worker_active_jobs',
      help: 'Number of currently active jobs in worker',
      labelNames: ['queue'],
    });
  }

  // API Metrics Methods
  incrementRequestCount(method: string, route: string, statusCode: number) {
    this.requestCount.inc({ method, route, status_code: statusCode.toString() });
  }

  recordRequestDuration(method: string, route: string, duration: number) {
    this.requestDuration.observe({ method, route }, duration / 1000); // Convert to seconds
  }

  incrementErrorCount(method: string, route: string, statusCode: number) {
    this.errorCount.inc({ method, route, status_code: statusCode.toString() });
  }

  // Queue Metrics Methods
  incrementJobsEnqueued(queue: string, jobType: string) {
    this.jobsEnqueued.inc({ queue, job_type: jobType });
  }

  incrementJobsProcessed(queue: string, jobType: string, status: string) {
    this.jobsProcessed.inc({ queue, job_type: jobType, status });
  }

  incrementJobFailures(queue: string, jobType: string, errorType: string) {
    this.jobFailures.inc({ queue, job_type: jobType, error_type: errorType });
  }

  setQueueDepth(queue: string, depth: number) {
    this.queueDepth.set({ queue }, depth);
  }

  // Business Metrics Methods
  incrementMessagesSent(campaignId?: string, userId?: string) {
    this.messagesSent.inc({
      campaign_id: campaignId || 'unknown',
      user_id: userId || 'unknown'
    });
  }

  incrementMessagesFailed(campaignId?: string, userId?: string, errorType?: string) {
    this.messagesFailed.inc({
      campaign_id: campaignId || 'unknown',
      user_id: userId || 'unknown',
      error_type: errorType || 'unknown'
    });
  }

  incrementCampaignsCreated(userId: string, campaignType?: string) {
    this.campaignsCreated.inc({
      user_id: userId,
      campaign_type: campaignType || 'unknown'
    });
  }

  setLicenseUsage(licenseId: string, userId: string, ratio: number) {
    this.licenseUsage.set({ license_id: licenseId, user_id: userId }, ratio);
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }

  setActiveCampaigns(status: string, count: number) {
    this.activeCampaigns.set({ status }, count);
  }

  setActiveAccounts(status: string, count: number) {
    this.activeAccounts.set({ status }, count);
  }

  // Database Metrics Methods
  recordDbQueryDuration(operation: string, table: string, duration: number) {
    this.dbQueryDuration.observe({ operation, table }, duration / 1000);
  }

  setDbConnections(count: number) {
    this.dbConnections.set(count);
  }

  // Cache Metrics Methods
  incrementCacheHits(cacheType: string = 'default') {
    this.cacheHits.inc({ cache_type: cacheType });
  }

  incrementCacheMisses(cacheType: string = 'default') {
    this.cacheMisses.inc({ cache_type: cacheType });
  }

  incrementCacheOperations(operation: string, cacheType: string = 'default') {
    this.cacheOperations.inc({ operation, cache_type: cacheType });
  }

  // TDLib Metrics Methods
  incrementTdlibRequests(method: string, status: string = 'success') {
    this.tdlibRequestsTotal.inc({ method, status });
  }

  recordTdlibRequestDuration(method: string, duration: number) {
    this.tdlibRequestDuration.observe({ method }, duration / 1000); // Convert to seconds
  }

  setTdlibActiveClients(count: number) {
    this.tdlibActiveClients.set(count);
  }

  setTdlibSessionsTotal(status: string, count: number) {
    this.tdlibSessionsTotal.set({ status }, count);
  }

  setTdlibQueueDepth(queue: string, depth: number) {
    this.tdlibQueueDepth.set({ queue }, depth);
  }

  incrementTdlibErrors(errorType: string, errorCode?: number) {
    this.tdlibErrorsTotal.inc({
      error_type: errorType,
      error_code: errorCode?.toString() || 'unknown',
    });
  }

  // Worker Metrics Methods
  incrementWorkerJobsProcessed(queue: string, jobType: string, status: string) {
    this.workerJobsProcessedTotal.inc({ queue, job_type: jobType, status });
  }

  incrementWorkerJobsFailed(queue: string, jobType: string, errorType: string) {
    this.workerJobsFailedTotal.inc({ queue, job_type: jobType, error_type: errorType });
  }

  setWorkerQueueDepth(queue: string, depth: number) {
    this.workerQueueDepth.set({ queue }, depth);
  }

  recordWorkerProcessingDuration(queue: string, jobType: string, duration: number) {
    this.workerProcessingDuration.observe({ queue, job_type: jobType }, duration / 1000); // Convert to seconds
  }

  setWorkerActiveJobs(queue: string, count: number) {
    this.workerActiveJobs.set({ queue }, count);
  }

  // Get metrics for /metrics endpoint
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  // Reset all metrics (useful for testing)
  async resetMetrics(): Promise<void> {
    register.resetMetrics();
    collectDefaultMetrics();
  }
}