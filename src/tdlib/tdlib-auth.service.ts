import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../config/redis.service';
import { TdlibService } from './tdlib.service';
import { TdlibSessionStore, TdlibSession } from './tdlib-session.store';
import { CustomLoggerService } from '../common/services/logger.service';
import {
  TdlibNotReadyException,
  TdlibClientNotFoundException,
} from './exceptions/tdlib.exceptions';
import { AccountsService } from '../accounts/accounts.service';
import { PrismaService } from '../config/prisma.service';
import { EncryptionService } from '../common/services/encryption.service';
import { AccountStatus } from '@prisma/client';

export interface TdlibAuthContext {
  phoneNumber: string;
  clientId: string;
  userId?: string;
}

interface AuthStateInfo {
  state: string;
  details?: any;
}

@Injectable()
export class TdlibAuthService {
  private readonly logger = new Logger(TdlibAuthService.name);
  private readonly phoneCodeTtlSeconds: number;
  private readonly authWaitTimeoutMs: number;
  private readonly maxAuthAttempts: number;
  private readonly authAttemptWindowMs: number;

  // Rate limiting keys
  private readonly rateLimitKeyPrefix = 'tdlib:auth:ratelimit:';

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly tdlibService: TdlibService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly customLogger: CustomLoggerService,
    @Inject(forwardRef(() => AccountsService))
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.phoneCodeTtlSeconds = this.configService.get<number>(
      'TDLIB_PHONE_CODE_TTL_SECONDS',
      300,
    );
    this.authWaitTimeoutMs =
      this.configService.get<number>('TDLIB_AUTH_WAIT_TIMEOUT_MS', 60_000) ||
      60_000;
    this.maxAuthAttempts =
      this.configService.get<number>('TDLIB_MAX_AUTH_ATTEMPTS', 5) || 5;
    this.authAttemptWindowMs =
      this.configService.get<number>(
        'TDLIB_AUTH_ATTEMPT_WINDOW_MS',
        3600_000,
      ) || 3600_000; // 1 hour
  }

  /**
   * Request authentication code for phone number
   */
  async requestCode(phoneNumber: string, userId: string): Promise<TdlibAuthContext> {
    // Rate limiting check
    await this.checkRateLimit(phoneNumber);

    // Check if there's an existing pending auth for this phone
    const existingKey = this.buildPhoneCodeKey(phoneNumber);
    const existing = await this.redisService.get(existingKey);
    if (existing) {
      const parsed = JSON.parse(existing) as { clientId: string; expiresAt: number };
      if (parsed.expiresAt > Date.now()) {
        // Return existing clientId if still valid
        return { phoneNumber, clientId: parsed.clientId };
      }
    }

    // Create new TDLib client
    const client = await this.tdlibService.createClient({ phoneNumber, userId });
    const clientId = client.id;

    // Setup proxy if account has one assigned
    try {
      await this.setupProxyForClient(userId, phoneNumber, clientId);
    } catch (error) {
      this.logger.warn('Failed to setup proxy for client', {
        phoneNumber,
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue without proxy - client will work without it
    }

    // Store auth context in Redis with TTL
    const expiresAt = Date.now() + this.phoneCodeTtlSeconds * 1000;
    const key = this.buildPhoneCodeKey(phoneNumber);
    await this.redisService.set(
      key,
      JSON.stringify({ clientId, expiresAt }),
      this.phoneCodeTtlSeconds,
    );

    // Send authentication request to TDLib
    this.tdlibService.send(clientId, {
      '@type': 'setAuthenticationPhoneNumber',
      phone_number: phoneNumber,
      settings: {
        '@type': 'phoneNumberAuthenticationSettings',
        allow_flash_call: false,
        is_current_phone_number: false,
        allow_sms_retriever_api: false,
      },
    });

    // Wait for authorization state transition
    const state = await this.waitForAuthorizationState(clientId, [
      'authorizationStateWaitCode',
      'authorizationStateWaitPhoneNumber',
      'authorizationStateReady', // Already authorized
    ]);

    if (state === 'authorizationStateReady') {
      // Already authorized, create session immediately
      let accountId: string | undefined;
      try {
        accountId = await this.linkAccountWithSession(phoneNumber, userId, clientId);
      } catch (error) {
        this.logger.warn('Failed to link account in requestCode', {
          phoneNumber,
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }

      const session: TdlibSession = {
        clientId,
        userId,
        accountId,
        phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await this.sessionStore.saveSession(session);
      await this.redisService.del(key);
    }

    this.logger.log('Authentication code requested', { phoneNumber, clientId, state, userId });
    return { phoneNumber, clientId, userId };
  }

  /**
   * Resend authentication code
   */
  async resendCode(phoneNumber: string): Promise<TdlibAuthContext> {
    const key = this.buildPhoneCodeKey(phoneNumber);
    const raw = await this.redisService.get(key);
    if (!raw) {
      throw new Error('AUTH_CODE_EXPIRED_OR_NOT_FOUND');
    }

    const parsed = JSON.parse(raw) as { clientId: string };
    const clientId = parsed.clientId;

    // Resend code request
    this.tdlibService.send(clientId, {
      '@type': 'resendAuthenticationCode',
    });

    // Wait for new code
    await this.waitForAuthorizationState(clientId, ['authorizationStateWaitCode']);

    this.logger.log('Authentication code resent', { phoneNumber, clientId });
    return { phoneNumber, clientId };
  }

  /**
   * Confirm authentication code
   */
  async confirmCode(phoneNumber: string, code: string, userId: string): Promise<TdlibSession> {
    const key = this.buildPhoneCodeKey(phoneNumber);
    const raw = await this.redisService.get(key);
    if (!raw) {
      throw new Error('AUTH_CODE_EXPIRED_OR_NOT_FOUND');
    }

    const parsed = JSON.parse(raw) as { clientId: string };
    const clientId = parsed.clientId;

    // Send code confirmation
    this.tdlibService.send(clientId, {
      '@type': 'checkAuthenticationCode',
      code,
    });

    // Wait for authorization state
    const state = await this.waitForAuthorizationState(clientId, [
      'authorizationStateReady',
      'authorizationStateWaitPassword',
      'authorizationStateWaitRegistration', // New user registration
    ]);

    if (state === 'authorizationStateWaitPassword') {
      // 2FA required, session will be created after password confirmation
      const session: TdlibSession = {
        clientId,
        userId,
        phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await this.sessionStore.saveSession(session);
      // Don't delete key yet, password still needed
      return session;
    }

    if (state === 'authorizationStateWaitRegistration') {
      throw new Error('REGISTRATION_REQUIRED');
    }

    // Authorization complete - link with account in DB
    let accountId: string | undefined;
    try {
      accountId = await this.linkAccountWithSession(phoneNumber, userId, clientId);
    } catch (error) {
      this.logger.warn('Failed to link account with session', {
        phoneNumber,
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue without account linking - session will still work
    }

    const session: TdlibSession = {
      clientId,
      userId,
      accountId,
      phoneNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.sessionStore.saveSession(session);
    await this.redisService.del(key);

    this.logger.log('Authentication code confirmed', { phoneNumber, clientId, userId, accountId });
    return session;
  }

  /**
   * Confirm 2FA password
   */
  async confirmPassword(clientId: string, password: string): Promise<TdlibSession> {
    const existing = await this.sessionStore.getSession(clientId);
    if (!existing) {
      throw new Error('SESSION_NOT_FOUND');
    }

    // Send password confirmation
    this.tdlibService.send(clientId, {
      '@type': 'checkAuthenticationPassword',
      password,
    });

    // Wait for ready state
    const state = await this.waitForAuthorizationState(clientId, [
      'authorizationStateReady',
    ]);

    if (state !== 'authorizationStateReady') {
      throw new Error('PASSWORD_AUTHENTICATION_FAILED');
    }

    // Link account if not already linked
    if (!existing.accountId && existing.userId) {
      try {
        const accountId = await this.linkAccountWithSession(
          existing.phoneNumber,
          existing.userId,
          clientId,
        );
        existing.accountId = accountId;
      } catch (error) {
        this.logger.warn('Failed to link account after password confirmation', {
          clientId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Update session
    existing.updatedAt = new Date().toISOString();
    await this.sessionStore.saveSession(existing);

    // Clean up auth key if exists
    const authKey = this.buildPhoneCodeKey(existing.phoneNumber);
    await this.redisService.del(authKey);

    this.logger.log('Password confirmed', { clientId, accountId: existing.accountId });
    return existing;
  }

  /**
   * Cancel ongoing authentication
   */
  async cancelAuth(phoneNumber: string): Promise<void> {
    const key = this.buildPhoneCodeKey(phoneNumber);
    const raw = await this.redisService.get(key);
    if (raw) {
      const parsed = JSON.parse(raw) as { clientId: string };
      try {
        // Try to close the client
        this.tdlibService.destroyClient(parsed.clientId);
      } catch (error) {
        this.logger.warn('Failed to destroy client during auth cancellation', {
          phoneNumber,
          error,
        });
      }
      await this.redisService.del(key);
    }
  }

  /**
   * Poll TDLib for authorizationState updates until one of the expected states
   * is reached or timeout occurs.
   */
  private async waitForAuthorizationState(
    clientId: string,
    expectedStates: string[],
  ): Promise<string | null> {
    const deadline = Date.now() + this.authWaitTimeoutMs;
    const pollInterval = 100; // 100ms between polls

    while (Date.now() < deadline) {
      try {
        const update = this.tdlibService.receive(clientId, 1.0);
        if (!update) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          continue;
        }

        // Handle updateAuthorizationState
        if (update['@type'] === 'updateAuthorizationState') {
          const authState = update.authorization_state;
          const stateType = authState?.['@type'] as string | undefined;
          
          if (stateType) {
            this.logger.debug('Authorization state update', {
              clientId,
              state: stateType,
              expectedStates,
            });

            if (expectedStates.includes(stateType)) {
              return stateType;
            }

            // Handle error states
            if (stateType === 'authorizationStateClosed') {
              throw new Error('AUTHORIZATION_CLOSED');
            }
          }
        }

        // Handle other relevant updates
        if (update['@type'] === 'error') {
          const errorCode = update.code;
          const errorMessage = update.message || 'Unknown error';
          this.logger.warn('TDLib error during auth', {
            clientId,
            errorCode,
            errorMessage,
          });
          
          // Some errors are recoverable, others are not
          if (errorCode === 400 || errorCode === 401) {
            throw new Error(`AUTH_ERROR_${errorCode}: ${errorMessage}`);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      } catch (error) {
        if (error instanceof Error && error.message.includes('AUTH_ERROR')) {
          throw error;
        }
        // Log but continue polling for other errors
        this.logger.warn('Error while waiting for auth state', {
          clientId,
          error: error instanceof Error ? error.message : String(error),
        });
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    this.logger.warn('Timeout waiting for authorization state', {
      clientId,
      expectedStates,
    });
    return null;
  }

  /**
   * Check rate limit for authentication requests
   */
  private async checkRateLimit(phoneNumber: string): Promise<void> {
    const key = `${this.rateLimitKeyPrefix}${phoneNumber}`;
    const attemptsRaw = await this.redisService.get(key);
    
    if (attemptsRaw) {
      const attempts = parseInt(attemptsRaw, 10);
      if (attempts >= this.maxAuthAttempts) {
        throw new Error(
          `Rate limit exceeded. Maximum ${this.maxAuthAttempts} attempts per hour.`,
        );
      }
    }

    // Increment attempt counter
    const current = attemptsRaw ? parseInt(attemptsRaw, 10) : 0;
    const ttlSeconds = Math.floor(this.authAttemptWindowMs / 1000);
    await this.redisService.set(
      key,
      String(current + 1),
      ttlSeconds,
    );
  }

  /**
   * Setup proxy for TDLib client based on account proxy assignment
   */
  private async setupProxyForClient(
    userId: string,
    phoneNumber: string,
    clientId: string,
  ): Promise<void> {
    // Find account by phone number
    const account = await this.prisma.telegramAccount.findFirst({
      where: {
        phone: phoneNumber,
        userId,
      },
      include: {
        proxyAssignments: {
          where: { isActive: true },
          include: {
            proxy: true,
          },
          take: 1,
        },
      },
    });

    if (!account || account.proxyAssignments.length === 0) {
      // No proxy assigned, skip
      return;
    }

    const assignment = account.proxyAssignments[0];
    const proxy = assignment.proxy;

    // Convert Proxy model to TDLib proxy config
    const proxyConfig = this.convertProxyToTdlibConfig(proxy);
    if (!proxyConfig) {
      this.logger.warn('Failed to convert proxy to TDLib config', {
        proxyId: proxy.id,
        proxyType: proxy.type,
      });
      return;
    }

    // Set proxy in TDLib
    await this.tdlibService.setProxy(clientId, proxyConfig);
    this.logger.log('Proxy configured for TDLib client', {
      clientId,
      proxyId: proxy.id,
      proxyType: proxy.type,
    });
  }

  /**
   * Convert Proxy model to TDLib proxy configuration
   */
  private convertProxyToTdlibConfig(proxy: any): {
    type: 'http' | 'socks5' | 'socks4';
    server: string;
    port: number;
    username?: string;
    password?: string;
  } | null {
    // Map ProxyType to TDLib proxy type
    const typeMap: Record<string, 'http' | 'socks5' | 'socks4'> = {
      HTTP: 'http',
      HTTPS: 'http',
      SOCKS4: 'socks4',
      SOCKS4A: 'socks4',
      SOCKS5: 'socks5',
      SOCKS5_WITH_UDP: 'socks5',
    };

    const tdlibType = typeMap[proxy.type];
    if (!tdlibType) {
      return null;
    }

    const config: any = {
      type: tdlibType,
      server: proxy.host,
      port: proxy.port,
    };

    // Add credentials if available
    // Note: In production, you'd need to decrypt the password
    if (proxy.username) {
      config.username = proxy.username;
    }
    if (proxy.password) {
      // Decrypt password if encrypted (backward compatible with plain text)
      config.password = this.encryptionService.decrypt(proxy.password);
    }

    return config;
  }

  /**
   * Link or create TelegramAccount in DB and associate with session
   */
  private async linkAccountWithSession(
    phoneNumber: string,
    userId: string,
    clientId: string,
  ): Promise<string> {
    // Check if account already exists
    let account = await this.prisma.telegramAccount.findFirst({
      where: {
        phone: phoneNumber,
        userId,
      },
    });

    if (!account) {
      // Create new account
      account = await this.prisma.telegramAccount.create({
        data: {
          phone: phoneNumber,
          userId,
          status: AccountStatus.ACTIVE,
          createdBy: userId,
        },
      });
      this.logger.log('Created new TelegramAccount', { accountId: account.id, phoneNumber });
    } else {
      // Update existing account to ACTIVE
      if (account.status !== AccountStatus.ACTIVE) {
        account = await this.prisma.telegramAccount.update({
          where: { id: account.id },
          data: { status: AccountStatus.ACTIVE },
        });
        this.logger.log('Updated account status to ACTIVE', { accountId: account.id });
      }
    }

    // Create or update AccountSession record
    await this.prisma.accountSession.upsert({
      where: {
        accountId: account.id,
      },
      create: {
        accountId: account.id,
        sessionData: {
          clientId,
          phoneNumber,
          userId,
        },
        isActive: true,
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      update: {
        sessionData: {
          clientId,
          phoneNumber,
          userId,
        },
        isActive: true,
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Setup proxy if account has one assigned
    try {
      await this.setupProxyForClient(userId, phoneNumber, clientId);
    } catch (error) {
      this.logger.warn('Failed to setup proxy after account linking', {
        accountId: account.id,
        clientId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return account.id;
  }

  private buildPhoneCodeKey(phoneNumber: string): string {
    return `tdlib:auth:phone:${phoneNumber}`;
  }
}
