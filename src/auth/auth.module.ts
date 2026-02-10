import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TelegramOAuthService } from './telegram-oauth.service';
import { SessionManagementService } from './session-management.service';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../config/database.module';
import { RedisModule } from '../config/redis.module';
import { CommonModule } from '../common/services/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TelegramStrategy } from './strategies/telegram.strategy';
import { EnhancedJwtAuthGuard } from './guards/enhanced-jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { SecurityAuditService } from './security-audit.service';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    RedisModule.forRoot(),
    CommonModule,
    PassportModule,
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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TelegramOAuthService,
    SessionManagementService,
    SecurityAuditService,
    JwtStrategy,
    TelegramStrategy,
    EnhancedJwtAuthGuard,
    ApiKeyAuthGuard,
    RateLimitGuard,
  ],
  exports: [
    UsersModule,
    AuthService,
    TelegramOAuthService,
    SessionManagementService,
    SecurityAuditService,
    EnhancedJwtAuthGuard,
    ApiKeyAuthGuard,
    RateLimitGuard,
  ],
})
export class AuthModule {}