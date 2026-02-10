import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LicensesModule } from './licenses/licenses.module';
import { ProxiesModule } from './proxies/proxies.module';
import { JobsModule } from './jobs/jobs.module';
import { AccountsModule } from './accounts/accounts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { MessagesModule } from './messages/messages.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { TdlibModule } from './tdlib/tdlib.module';

// Analytics
import { AnalyticsModule } from './analytics/analytics.module';

// Database
import { DatabaseModule } from './config/database.module';

// Queue
import { QueueModule } from './config/queue.module';

// Common
import { CommonModule } from './common/services/logger.module';

// Health
import { HealthModule } from './config/health.module';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Middleware
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { ApiVersionMiddleware } from './common/middleware/api-version.middleware';
// Environment validation
import { validate } from './config/env.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
    }),
    
    // Scheduling (for cron jobs like key rotation)
    ScheduleModule.forRoot(),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    
    // Database
    DatabaseModule,
    
    // Queue
    QueueModule,

    // Common
    CommonModule,

    // Core modules
    AuthModule,
    UsersModule,
    LicensesModule,
    ProxiesModule,
    JobsModule,
    AccountsModule,
    CampaignsModule,
    MessagesModule,
    WebhooksModule,
    TdlibModule,

    // Analytics
    AnalyticsModule,

    // Health
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SecurityMiddleware,
    ApiVersionMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware, ApiVersionMiddleware).forRoutes('*');
  }
}