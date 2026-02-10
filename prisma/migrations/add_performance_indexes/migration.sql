-- Add performance indexes for query optimization
-- This migration adds indexes for frequently queried columns

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_campaign_status ON messages("campaignId", status);
CREATE INDEX IF NOT EXISTS idx_messages_account_status ON messages("telegramAccountId", status);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages("sentAt") WHERE "sentAt" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages("createdAt");

-- Campaigns table indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_status ON campaigns("userId", status);
CREATE INDEX IF NOT EXISTS idx_campaigns_account_status ON campaigns("accountId", status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON campaigns("scheduledAt") WHERE "scheduledAt" IS NOT NULL;

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status_priority_created ON jobs(status, priority DESC, "createdAt");
CREATE INDEX IF NOT EXISTS idx_jobs_queue_status ON jobs(queue, status);
CREATE INDEX IF NOT EXISTS idx_jobs_user_created ON jobs("userId", "createdAt") WHERE "userId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs("scheduledAt") WHERE "scheduledAt" IS NOT NULL;

-- Telegram accounts table indexes
CREATE INDEX IF NOT EXISTS idx_telegram_accounts_user_status ON telegram_accounts("userId", status);
CREATE INDEX IF NOT EXISTS idx_telegram_accounts_status_active ON telegram_accounts(status, "lastActiveAt") WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_telegram_accounts_activity_score ON telegram_accounts("activityScore" DESC) WHERE "activityScore" > 0;

-- Licenses table indexes
CREATE INDEX IF NOT EXISTS idx_licenses_user_status ON licenses("userId", status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires_at ON licenses("expiresAt") WHERE "expiresAt" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_status_plan ON licenses(status, plan);

-- Usage logs table indexes
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created ON usage_logs("userId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_usage_logs_license_created ON usage_logs("licenseId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_usage_logs_action_created ON usage_logs(action, "createdAt");

-- Proxy table indexes
CREATE INDEX IF NOT EXISTS idx_proxies_status_health ON proxies(status, "healthScore" DESC);
CREATE INDEX IF NOT EXISTS idx_proxies_country_region ON proxies(country, region) WHERE country IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_proxies_last_checked ON proxies("lastChecked") WHERE "lastChecked" IS NOT NULL;

-- Webhooks table indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_active ON webhooks("userId", "isActive");
CREATE INDEX IF NOT EXISTS idx_webhooks_last_triggered ON webhooks("lastTriggeredAt") WHERE "lastTriggeredAt" IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_messages_campaign_status_created ON messages("campaignId", status, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type_status_priority ON jobs(type, status, priority DESC);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_telegram_accounts_active ON telegram_accounts("userId") WHERE status = 'ACTIVE' AND "isArchived" = false;
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns("userId") WHERE status IN ('RUNNING', 'SCHEDULED');

-- Analyze tables after index creation
ANALYZE messages;
ANALYZE campaigns;
ANALYZE jobs;
ANALYZE telegram_accounts;
ANALYZE licenses;
ANALYZE usage_logs;
ANALYZE proxies;
ANALYZE webhooks;
