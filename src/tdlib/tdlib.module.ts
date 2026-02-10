import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../config/redis.module';
import { CommonModule } from '../common/services/logger.module';
import { DatabaseModule } from '../config/database.module';
import { AuthModule } from '../auth/auth.module';
import { TdlibService } from './tdlib.service';
import { TdlibAuthService } from './tdlib-auth.service';
import { TdlibController } from './tdlib.controller';
import { TdlibSessionStore } from './tdlib-session.store';
import { AccountsModule } from '../accounts/accounts.module';
import { TdlibUpdatePollingService } from './tdlib-update-polling.service';
import { TdlibUpdateDispatcher } from './tdlib-update-dispatcher.service';
import { TdlibSessionCleanupService } from './tdlib-session-cleanup.service';
import { TdlibMessageUpdateHandler } from './handlers/tdlib-message-update.handler';
import { TdlibAccountUpdateHandler } from './handlers/tdlib-account-update.handler';
import { TdlibChatUpdateHandler } from './handlers/tdlib-chat-update.handler';
import { TdlibRequestValidator } from './validation/tdlib-request.validator';
import { TdlibResponseValidator } from './validation/tdlib-response.validator';
import { TdlibMessageService } from './services/tdlib-message.service';
import { TdlibFileService } from './services/tdlib-file.service';
import { TdlibChatService } from './services/tdlib-chat.service';
import { TdlibRetryService } from './services/tdlib-retry.service';
import { TdlibCircuitBreakerService } from './services/tdlib-circuit-breaker.service';
import { TdlibHealthService } from './services/tdlib-health.service';
import { TdlibUserService } from './services/tdlib-user.service';
import { TdlibChannelService } from './services/tdlib-channel.service';
import { TdlibRateLimiterService } from './services/tdlib-rate-limiter.service';
import { TdlibCacheService } from './services/tdlib-cache.service';
import { TdlibConnectionPoolService } from './services/tdlib-connection-pool.service';
import { TdlibBatchService } from './services/tdlib-batch.service';
import { TdlibAuditService } from './services/tdlib-audit.service';
import { TdlibRateLimitGuard } from './guards/tdlib-rate-limit.guard';
import { TdlibAuthGuard } from './guards/tdlib-auth.guard';
import { TdlibPermissionGuard } from './guards/tdlib-permission.guard';
import { TdlibLoggingInterceptor } from './interceptors/tdlib-logging.interceptor';
import { TdlibMessageController } from './controllers/tdlib-message.controller';
import { TdlibFileController } from './controllers/tdlib-file.controller';
import { TdlibChatController } from './controllers/tdlib-chat.controller';
import { TdlibHealthController } from './controllers/tdlib-health.controller';
import { TdlibUserController } from './controllers/tdlib-user.controller';
import { TdlibChannelController } from './controllers/tdlib-channel.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot(),
    CommonModule,
    DatabaseModule,
    forwardRef(() => AccountsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [
    TdlibController,
    TdlibMessageController,
    TdlibFileController,
    TdlibChatController,
    TdlibHealthController,
    TdlibUserController,
    TdlibChannelController,
  ],
  providers: [
    TdlibService,
    TdlibAuthService,
    TdlibSessionStore,
    TdlibUpdatePollingService,
    TdlibUpdateDispatcher,
    TdlibSessionCleanupService,
    TdlibMessageUpdateHandler,
    TdlibAccountUpdateHandler,
    TdlibChatUpdateHandler,
    TdlibRequestValidator,
    TdlibResponseValidator,
    TdlibMessageService,
    TdlibFileService,
    TdlibChatService,
    TdlibRetryService,
    TdlibCircuitBreakerService,
    TdlibHealthService,
    TdlibUserService,
    TdlibChannelService,
    TdlibRateLimiterService,
    TdlibCacheService,
    TdlibConnectionPoolService,
    TdlibBatchService,
    TdlibAuditService,
    TdlibRateLimitGuard,
    TdlibAuthGuard,
    TdlibPermissionGuard,
    TdlibLoggingInterceptor,
  ],
  exports: [
    TdlibService,
    TdlibAuthService,
    TdlibSessionStore,
    TdlibUpdatePollingService,
    TdlibUpdateDispatcher,
  ],
})
export class TdlibModule {}

