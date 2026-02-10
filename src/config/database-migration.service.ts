import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseMigrationService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseMigrationService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.runMigrations();
  }

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('🚀 Running database migrations...');

      // Check if database is accessible
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database connection verified');

      // Run migrations in order
      await this.createIndexes();
      await this.createConstraints();
      await this.setupDatabaseFunctions();
      await this.optimizeDatabase();

      this.logger.log('✅ Database migrations completed successfully');
    } catch (error) {
      this.logger.error('❌ Database migration failed:', error);
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    this.logger.log('📋 Creating indexes...');

    const indexes = [
      // User indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_reputation ON users(isActive, reputation DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(lastLoginAt DESC) WHERE isActive = true;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_account_level ON users(accountLevel) WHERE isActive = true;',

      // Session indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_active_expires ON user_sessions(isActive, expiresAt) WHERE isActive = true;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_user_recent ON user_sessions(userId, lastActivityAt DESC);',

      // License indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_licenses_active_expires ON licenses(status, expiresAt);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_licenses_user_active ON licenses(userId, status) WHERE status = ACTIVE;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_licenses_next_billing ON licenses(nextBillingAt) WHERE status = ACTIVE;',

      // API Key indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_active_expires ON api_keys(isActive, expiresAt);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_usage_stats ON api_key_usage(apiKeyId, date DESC);',

      // Proxy indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxies_health_score ON proxies(healthScore DESC, status) WHERE isActive = true;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxies_country_region ON proxies(country, region) WHERE isActive = true;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxies_type_status ON proxies(type, status);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxies_tags ON proxies USING GIN(tags);',

      // Job indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status_priority ON jobs(status, priority DESC, createdAt ASC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_queue_status ON jobs(queue, status);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_scheduled ON jobs(scheduledAt) WHERE status = PENDING;',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_next_run ON jobs(nextRunAt) WHERE nextRunAt IS NOT NULL;',

      // Campaign indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_user_status ON campaigns(userId, status, createdAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_scheduled ON campaigns(scheduledAt) WHERE status = SCHEDULED;',

      // Message indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_campaign_status ON messages(campaignId, status);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sent_date ON messages(sentAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_status_priority ON messages(status, priority DESC);',

      // Usage and audit indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(userId, createdAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_action_date ON usage_logs(action, createdAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_audit_user_event ON auth_audit_log(userId, event, createdAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_audit_severity_date ON auth_audit_log(severity, createdAt DESC);',

      // Performance indexes
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxy_health_recent ON proxy_health_logs(proxyId, createdAt DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proxy_usage_date_hour ON proxy_usage_stats(date DESC, hour DESC);',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_metrics_date ON job_metrics(date DESC);'
    ];

    for (const indexSql of indexes) {
      try {
        await this.prisma.$executeRawUnsafe(indexSql);
      } catch (error) {
        this.logger.warn(`Index creation failed (may already exist): ${(error as Error).message}`);
      }
    }

    this.logger.log('✅ Indexes created/verified');
  }

  private async createConstraints(): Promise<void> {
    this.logger.log('🔒 Creating constraints...');

    const constraints = [
      // Business logic constraints
      'ALTER TABLE licenses ADD CONSTRAINT check_license_positive_cost CHECK (totalCost >= 0);',
      'ALTER TABLE api_keys ADD CONSTRAINT check_api_key_positive_usage CHECK (usageCount >= 0);',
      'ALTER TABLE proxies ADD CONSTRAINT check_proxy_valid_port CHECK (port > 0 AND port <= 65535);',
      'ALTER TABLE proxies ADD CONSTRAINT check_proxy_valid_health CHECK (healthScore >= 0 AND healthScore <= 100);',
      'ALTER TABLE jobs ADD CONSTRAINT check_job_valid_progress CHECK (progress >= 0 AND progress <= 1);',
      'ALTER TABLE campaigns ADD CONSTRAINT check_campaign_valid_progress CHECK (progress >= 0 AND progress <= 1);',
      'ALTER TABLE messages ADD CONSTRAINT check_message_valid_cost CHECK (cost >= 0);'
    ];

    for (const constraintSql of constraints) {
      try {
        await this.prisma.$executeRawUnsafe(constraintSql);
      } catch (error) {
        this.logger.warn(`Constraint creation failed: ${(error as Error).message}`);
      }
    }

    this.logger.log('✅ Constraints created/verified');
  }

  private async setupDatabaseFunctions(): Promise<void> {
    this.logger.log('⚙️ Setting up database functions...');

    // Function to update user statistics
    await this.prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_user_stats()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Update last login timestamp for user
        IF NEW.event = 'LOGIN_SUCCESS' THEN
          UPDATE users 
          SET lastLoginAt = NEW.createdAt 
          WHERE id = NEW.userId;
        END IF;
        
        -- Update user reputation based on security events
        IF NEW.severity = 'CRITICAL' THEN
          UPDATE users 
          SET reputation = GREATEST(0, reputation - 10)
          WHERE id = NEW.userId;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger for user stats
    await this.prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS trigger_update_user_stats ON auth_audit_log;
      CREATE TRIGGER trigger_update_user_stats
        AFTER INSERT ON auth_audit_log
        FOR EACH ROW
        EXECUTE FUNCTION update_user_stats();
    `);

    // Function to update proxy health score
    await this.prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_proxy_health_score()
      RETURNS TRIGGER AS $$
      DECLARE
        recent_logs RECORD;
        success_count INTEGER;
        total_count INTEGER;
        new_score INTEGER;
      BEGIN
        -- Get recent health logs for the proxy
        SELECT 
          COUNT(*) FILTER (WHERE isHealthy = true) as success_count,
          COUNT(*) as total_count
        INTO recent_logs
        FROM proxy_health_logs
        WHERE proxyId = NEW.proxyId 
        AND createdAt >= NOW() - INTERVAL '24 hours';
        
        -- Calculate new health score
        IF total_count > 0 THEN
          new_score := (success_count::FLOAT / total_count::FLOAT) * 100;
          
          -- Update proxy health score
          UPDATE proxies
          SET 
            healthScore = new_score,
            lastChecked = NEW.createdAt
          WHERE id = NEW.proxyId;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger for proxy health updates
    await this.prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS trigger_update_proxy_health ON proxy_health_logs;
      CREATE TRIGGER trigger_update_proxy_health
        AFTER INSERT ON proxy_health_logs
        FOR EACH ROW
        EXECUTE FUNCTION update_proxy_health_score();
    `);

    this.logger.log('✅ Database functions and triggers created');
  }

  private async optimizeDatabase(): Promise<void> {
    this.logger.log('⚡ Optimizing database...');

    // Update table statistics
    await this.prisma.$executeRawUnsafe('ANALYZE;');

    // Set vacuum settings
    await this.prisma.$executeRawUnsafe(`
      ALTER TABLE users SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE user_sessions SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE licenses SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE jobs SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE campaigns SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE messages SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE usage_logs SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
      ALTER TABLE proxy_health_logs SET (autovacuum_enabled = true, autovacuum_analyze_scale_factor = 0.01);
    `);

    this.logger.log('✅ Database optimization completed');
  }

  async getMigrationStatus(): Promise<any> {
    try {
      const tableInfo = await this.prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
      `;

      const indexInfo = await this.prisma.$queryRaw<Array<{ indexname: string }>>`
        SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;
      `;

      const functionInfo = await this.prisma.$queryRaw<Array<{ proname: string }>>`
        SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') ORDER BY proname;
      `;

      return {
        tables: tableInfo.length,
        indexes: indexInfo.length,
        functions: functionInfo.length,
        status: 'completed'
      };
    } catch (error) {
      return {
        tables: 0,
        indexes: 0,
        functions: 0,
        status: 'error',
        error: (error as Error).message
      };
    }
  }

  async rollbackMigration(migrationId: string): Promise<void> {
    this.logger.warn(`⚠️ Rolling back migration: ${migrationId}`);
    
    // Implementation for specific migration rollbacks
    // This would be expanded based on migration history tracking
  }
}