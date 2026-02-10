import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../config/redis.service';
import { PrismaService } from '../config/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface TelegramAuthState {
  stateId: string;
  redirectUri?: string;
  timestamp: number;
  sessionId?: string;
}

export interface TelegramUserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

@Injectable()
export class TelegramOAuthService {
  private readonly TELEGRAM_AUTH_URL = 'https://telegram.org/js/telegram-widget.js';
  private readonly logger = new Logger(TelegramOAuthService.name);

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  /**
   * Generate OAuth state and return authorization URL
   */
  async generateAuthUrl(redirectUri?: string): Promise<{ authUrl: string; stateId: string }> {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new InternalServerErrorException('TELEGRAM_BOT_TOKEN is not configured');
    }
    const stateId = uuidv4();
    
    // Store state in Redis with 10 minute expiry
    const stateData: TelegramAuthState = {
      stateId,
      redirectUri,
      timestamp: Date.now(),
    };

    await this.redisService.set(
      `telegram_auth_state:${stateId}`,
      JSON.stringify(stateData),
      600, // 10 minutes
    );

    const origin = this.configService.get<string>('TELEGRAM_OAUTH_ORIGIN', 'http://localhost:3000');
    const returnTo = redirectUri ?? this.configService.get<string>('TELEGRAM_OAUTH_REDIRECT_URI') ?? '';
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${this.extractBotId(botToken)}&origin=${encodeURIComponent(origin)}&request_access=write&return_to=${encodeURIComponent(returnTo)}&state=${stateId}`;

    return { authUrl, stateId };
  }

  /**
   * Validate Telegram OAuth callback data
   */
  async validateCallback(data: TelegramUserInfo, stateId: string): Promise<any> {
    // Verify state
    const stateData = await this.getAndDeleteState(stateId);
    if (!stateData) {
      throw new InternalServerErrorException('Invalid or expired state');
    }

    // Validate Telegram data
    if (!this.validateTelegramData(data)) {
      throw new InternalServerErrorException('Invalid Telegram authentication data');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { telegramId: data.id },
    });

    if (!user) {
      user = await this.createTelegramUser(data);
    } else {
      user = await this.updateTelegramUser(user.id, data);
    }

    // Log successful authentication
    await this.logAuthEvent(user.id, 'TELEGRAM_OAUTH_SUCCESS', {
      stateId,
      redirectUri: stateData.redirectUri,
    });

    return user;
  }

  /**
   * Validate Telegram widget data using hash
   */
  private validateTelegramData(data: TelegramUserInfo): boolean {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      this.logger.error('TELEGRAM_BOT_TOKEN is not configured');
      return false;
    }
    const secret = crypto.createHash('sha256').update(botToken).digest();

    // Create a sorted list of fields (excluding hash)
    const { hash: providedHash, ...authData } = data;
    
    const dataCheckString = Object.keys(authData)
      .sort()
      .map((key) => `${key}=${(authData as Record<string, unknown>)[key]}`)
      .join('\n');

    const computedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
    
    return computedHash === providedHash;
  }

  /**
   * Extract bot ID from bot token
   */
  private extractBotId(botToken: string): string {
    return botToken.split(':')[0];
  }

  /**
   * Get and delete auth state from Redis
   */
  private async getAndDeleteState(stateId: string): Promise<TelegramAuthState | null> {
    const stateData = await this.redisService.get(`telegram_auth_state:${stateId}`);
    if (stateData) {
      await this.redisService.del(`telegram_auth_state:${stateId}`);
      return JSON.parse(stateData);
    }
    return null;
  }

  /**
   * Create new user from Telegram data
   */
  private async createTelegramUser(data: TelegramUserInfo) {
    return this.prisma.user.create({
      data: {
        telegramId: data.id,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.photo_url,
        language: 'en', // Default language
        isActive: true,
      },
    });
  }

  /**
   * Update existing user with Telegram data
   */
  private async updateTelegramUser(userId: string, data: TelegramUserInfo) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username || undefined,
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.photo_url,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Log authentication events
   */
  private async logAuthEvent(userId: string, event: string, metadata?: any) {
    await this.prisma.authAuditLog.create({
      data: {
        userId,
        event,
        metadata: metadata || {},
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });
  }
}