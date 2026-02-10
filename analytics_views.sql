-- Create analytics views for Phase 2
-- License Daily Usage View
CREATE OR REPLACE VIEW license_daily_usage_view AS
SELECT
  l.id as license_id,
  l."userId",
  l.plan,
  DATE(ul.created_at) as date,
  COUNT(DISTINCT ul.id) as total_requests,
  COUNT(DISTINCT CASE WHEN ul.action = 'MESSAGE_SENT' THEN ul.id END) as messages_sent,
  COUNT(DISTINCT CASE WHEN ul.action = 'CAMPAIGN_CREATED' THEN ul.id END) as campaigns_created,
  COALESCE(SUM(ul.cost), 0) as total_cost,
  CASE
    WHEN l.limits->>'requests_per_month' IS NOT NULL
    THEN ROUND(
      (COUNT(DISTINCT ul.id) * 30.0 / NULLIF(EXTRACT(DAY FROM NOW() - MIN(DATE(ul.created_at))), 0)) /
      (l.limits->>'requests_per_month')::numeric * 100, 2
    )
    ELSE 0
  END as usage_ratio
FROM licenses l
LEFT JOIN usage_logs ul ON l.id = ul."licenseId"
WHERE ul."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY l.id, l."userId", l.plan, DATE(ul.created_at), l.limits;

-- License Plan Aggregation View
CREATE OR REPLACE VIEW license_plan_agg_view AS
SELECT
  plan,
  COUNT(*) as tenant_count,
  SUM(total_requests) as total_usage_requests,
  AVG(usage_ratio) as avg_usage_ratio,
  SUM(total_cost) as total_revenue,
  COUNT(CASE WHEN usage_ratio > 80 THEN 1 END) as high_usage_tenants
FROM license_daily_usage_view
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY plan;

-- Campaign Stats View
CREATE OR REPLACE VIEW campaign_stats_view AS
SELECT
  c.id as campaign_id,
  c."userId",
  c.name,
  c.status,
  COUNT(m.id) as messages_total,
  COUNT(CASE WHEN m.status = 'DELIVERED' THEN 1 END) as delivered,
  COUNT(CASE WHEN m.status = 'READ' THEN 1 END) as read,
  COUNT(CASE WHEN m.status = 'FAILED' THEN 1 END) as failed,
  ROUND(
    CASE
      WHEN COUNT(m.id) > 0
      THEN (COUNT(CASE WHEN m.status IN ('DELIVERED', 'READ') THEN 1 END) * 100.0 / COUNT(m.id))
      ELSE 0
    END, 2
  ) as success_rate,
  ROUND(
    CASE
      WHEN COUNT(m.id) > 0
      THEN (COUNT(CASE WHEN m.status = 'FAILED' THEN 1 END) * 100.0 / COUNT(m.id))
      ELSE 0
    END, 2
  ) as error_rate,
  AVG(EXTRACT(EPOCH FROM (m."deliveredAt" - m."sentAt"))) as avg_delivery_time_seconds
FROM campaigns c
LEFT JOIN messages m ON c.id = m."campaignId"
GROUP BY c.id, c."userId", c.name, c.status;

-- Message Status Time View
CREATE OR REPLACE VIEW message_status_time_view AS
SELECT
  m.id,
  m."campaignId",
  m."userId",
  m."sentAt",
  m."deliveredAt",
  m."readAt",
  EXTRACT(EPOCH FROM (m."deliveredAt" - m."sentAt")) as sent_to_delivered_seconds,
  EXTRACT(EPOCH FROM (m."readAt" - m."deliveredAt")) as delivered_to_read_seconds,
  EXTRACT(EPOCH FROM (m."readAt" - m."sentAt")) as total_response_time_seconds
FROM messages m
WHERE m."sentAt" IS NOT NULL;

-- Queue Realtime Stats View
CREATE OR REPLACE VIEW queue_realtime_stats_view AS
SELECT
  q.name as queue_name,
  COUNT(j.id) as pending_jobs,
  COUNT(CASE WHEN j.status = 'RUNNING' THEN 1 END) as active_jobs,
  COUNT(CASE WHEN j.status = 'COMPLETED' AND j."updatedAt" >= CURRENT_DATE THEN 1 END) as completed_today,
  COUNT(CASE WHEN j.status = 'FAILED' AND j."updatedAt" >= CURRENT_DATE THEN 1 END) as failed_today,
  AVG(EXTRACT(EPOCH FROM (j."updatedAt" - j."createdAt"))) as avg_processing_time_seconds,
  MAX(EXTRACT(EPOCH FROM (j."updatedAt" - j."createdAt"))) as max_processing_time_seconds
FROM queues q
LEFT JOIN jobs j ON q.name = j.queue
GROUP BY q.name;

-- Job Type Failure View
CREATE OR REPLACE VIEW job_type_failure_view AS
SELECT
  j.type as job_type,
  COUNT(*) as total_jobs,
  COUNT(CASE WHEN j.status = 'FAILED' THEN 1 END) as failed_jobs,
  ROUND(
    CASE
      WHEN COUNT(*) > 0
      THEN (COUNT(CASE WHEN j.status = 'FAILED' THEN 1 END) * 100.0 / COUNT(*))
      ELSE 0
    END, 2
  ) as failure_rate,
  AVG(EXTRACT(EPOCH FROM (j."updatedAt" - j."createdAt"))) as avg_duration_seconds,
  MAX(EXTRACT(EPOCH FROM (j."updatedAt" - j."createdAt"))) as max_duration_seconds
FROM jobs j
WHERE j."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY j.type;

-- Auth Failures View
CREATE OR REPLACE VIEW auth_failures_view AS
SELECT
  DATE(al."createdAt") as date,
  al."ipAddress",
  al."userAgent",
  COUNT(*) as failure_count,
  array_agg(DISTINCT al."userId") as affected_users,
  MAX(al."createdAt") as last_failure
FROM auth_audit_log al
WHERE al.event = 'LOGIN_FAILED'
  AND al."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(al."createdAt"), al."ipAddress", al."userAgent"
ORDER BY failure_count DESC;

-- Security Events Daily View
CREATE OR REPLACE VIEW security_events_daily_view AS
SELECT
  DATE(al."createdAt") as date,
  al.severity,
  COUNT(*) as event_count,
  COUNT(DISTINCT al."userId") as affected_users,
  array_agg(DISTINCT al.event) as event_types
FROM auth_audit_log al
WHERE al.severity IN ('HIGH', 'CRITICAL')
  AND al."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(al."createdAt"), al.severity
ORDER BY date DESC, al.severity;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_license_daily_usage_date ON license_daily_usage_view(date);
CREATE INDEX IF NOT EXISTS idx_license_daily_usage_license ON license_daily_usage_view(license_id);
CREATE INDEX IF NOT EXISTS idx_campaign_stats_campaign ON campaign_stats_view(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_stats_user ON campaign_stats_view(user_id);
CREATE INDEX IF NOT EXISTS idx_message_status_time_campaign ON message_status_time_view(campaign_id);
CREATE INDEX IF NOT EXISTS idx_queue_stats_queue ON queue_realtime_stats_view(queue_name);
CREATE INDEX IF NOT EXISTS idx_job_failure_type ON job_type_failure_view(job_type);
CREATE INDEX IF NOT EXISTS idx_auth_failures_date ON auth_failures_view(date);
CREATE INDEX IF NOT EXISTS idx_security_events_date ON security_events_daily_view(date);