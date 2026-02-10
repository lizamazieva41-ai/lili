import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { LicenseAnalyticsService } from './license-analytics.service';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { QueueAnalyticsService } from './queue-analytics.service';
import { SecurityAnalyticsService } from './security-analytics.service';

@ApiTags('Analytics')
@Controller('api/analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly licenseAnalytics: LicenseAnalyticsService,
    private readonly campaignAnalytics: CampaignAnalyticsService,
    private readonly queueAnalytics: QueueAnalyticsService,
    private readonly securityAnalytics: SecurityAnalyticsService,
  ) {}

  // Dashboard Overview
  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview metrics' })
  @ApiResponse({ status: 200, description: 'Overview metrics returned' })
  async getOverview() {
    return this.analyticsService.getDashboardOverview();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health metrics' })
  @ApiResponse({ status: 200, description: 'System health returned' })
  async getHealth() {
    return this.analyticsService.getSystemHealth();
  }

  // License Analytics
  @Get('licenses/daily-usage')
  @ApiOperation({ summary: 'Get daily license usage' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Daily usage returned' })
  async getLicenseDailyUsage(@Query('userId') userId?: string) {
    return this.licenseAnalytics.getDailyUsage(userId);
  }

  @Get('licenses/plan-aggregation')
  @ApiOperation({ summary: 'Get license plan aggregation' })
  @ApiResponse({ status: 200, description: 'Plan aggregation returned' })
  async getLicensePlanAggregation() {
    return this.licenseAnalytics.getPlanAggregation();
  }

  @Get('licenses/forecast/:licenseId')
  @ApiOperation({ summary: 'Get license usage forecast' })
  @ApiResponse({ status: 200, description: 'Forecast returned' })
  async getLicenseForecast(@Param('licenseId') licenseId: string) {
    return this.licenseAnalytics.getUsageForecast(licenseId);
  }

  @Get('licenses/top-usage')
  @ApiOperation({ summary: 'Get top license usage' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items to return', example: 10 })
  @ApiResponse({ status: 200, description: 'Top usage licenses returned' })
  async getTopUsageLicenses(@Query('limit') limit?: string) {
    return this.licenseAnalytics.getTopUsageLicenses(parseInt(limit ?? '10') || 10);
  }

  // Campaign Analytics
  @Get('campaigns/stats')
  @ApiOperation({ summary: 'Get campaign statistics' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Campaign stats returned' })
  async getCampaignStats(@Query('userId') userId?: string) {
    return this.campaignAnalytics.getCampaignStats(userId);
  }

  @Get('campaigns/latency')
  @ApiOperation({ summary: 'Get campaign message latency' })
  @ApiResponse({ status: 200, description: 'Latency metrics returned' })
  async getMessageLatency() {
    return this.campaignAnalytics.getMessageLatency();
  }

  @Get('campaigns/:campaignId/performance')
  @ApiOperation({ summary: 'Get performance of a specific campaign' })
  @ApiResponse({ status: 200, description: 'Campaign performance returned' })
  async getCampaignPerformance(@Param('campaignId') campaignId: string) {
    return this.campaignAnalytics.getCampaignPerformance(campaignId);
  }

  @Get('campaigns/top-performing')
  @ApiOperation({ summary: 'Get top performing campaigns' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of campaigns to return', example: 10 })
  @ApiResponse({ status: 200, description: 'Top performing campaigns returned' })
  async getTopPerformingCampaigns(@Query('limit') limit?: string) {
    return this.campaignAnalytics.getTopPerformingCampaigns(parseInt(limit ?? '10') || 10);
  }

  @Get('campaigns/funnel')
  @ApiOperation({ summary: 'Get campaign funnel data' })
  @ApiResponse({ status: 200, description: 'Campaign funnel returned' })
  async getCampaignFunnel() {
    return this.campaignAnalytics.getCampaignFunnel();
  }

  // Queue Analytics
  @Get('queues/stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  @ApiResponse({ status: 200, description: 'Queue stats returned' })
  async getQueueStats() {
    return this.queueAnalytics.getQueueStats();
  }

  @Get('queues/failures')
  @ApiOperation({ summary: 'Get queue failure analysis' })
  @ApiResponse({ status: 200, description: 'Failure analysis returned' })
  async getJobFailureAnalysis() {
    return this.queueAnalytics.getJobFailureAnalysis();
  }

  @Get('queues/performance')
  @ApiOperation({ summary: 'Get queue performance metrics' })
  @ApiResponse({ status: 200, description: 'Queue performance returned' })
  async getQueuePerformance() {
    return this.queueAnalytics.getQueuePerformance();
  }

  @Get('queues/job-types')
  @ApiOperation({ summary: 'Get job type performance' })
  @ApiResponse({ status: 200, description: 'Job type performance returned' })
  async getJobTypePerformance() {
    return this.queueAnalytics.getJobTypePerformance();
  }

  @Get('queues/congestion')
  @ApiOperation({ summary: 'Predict queue congestion' })
  @ApiResponse({ status: 200, description: 'Queue congestion prediction returned' })
  async getQueueCongestionPrediction() {
    return this.queueAnalytics.getQueueCongestionPrediction();
  }

  // Security Analytics
  @Get('security/failures')
  @ApiOperation({ summary: 'Get authentication failures' })
  @ApiResponse({ status: 200, description: 'Authentication failures returned' })
  async getAuthFailures() {
    return this.securityAnalytics.getAuthFailures();
  }

  @Get('security/events')
  @ApiOperation({ summary: 'Get security events' })
  @ApiResponse({ status: 200, description: 'Security events returned' })
  async getSecurityEvents() {
    return this.securityAnalytics.getSecurityEvents();
  }

  @Get('security/overview')
  @ApiOperation({ summary: 'Get security overview' })
  @ApiResponse({ status: 200, description: 'Security overview returned' })
  async getSecurityOverview() {
    return this.securityAnalytics.getSecurityOverview();
  }

  @Get('security/suspicious-ips')
  @ApiOperation({ summary: 'Get top failing IPs' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of IPs to return', example: 10 })
  @ApiResponse({ status: 200, description: 'Top failing IPs returned' })
  async getTopFailingIPs(@Query('limit') limit?: string) {
    return this.securityAnalytics.getTopFailingIPs(parseInt(limit ?? '10') || 10);
  }

  @Get('security/anomalies')
  @ApiOperation({ summary: 'Get security anomaly score' })
  @ApiResponse({ status: 200, description: 'Anomaly score returned' })
  async getSecurityAnomalyScore() {
    return this.securityAnalytics.getSecurityAnomalyScore();
  }

  @Get('security/alerts')
  @ApiOperation({ summary: 'Get recent security alerts' })
  @ApiResponse({ status: 200, description: 'Security alerts returned' })
  async getRecentSecurityAlerts() {
    return this.securityAnalytics.getRecentSecurityAlerts();
  }
}