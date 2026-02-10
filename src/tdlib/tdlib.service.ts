import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../common/services/logger.service';
import { MetricsService } from '../common/services/metrics.service';
import * as path from 'path';
import {
  TdlibNotReadyException,
  TdlibClientNotFoundException,
  TdlibLibraryLoadException,
  TdlibSendFailedException,
  TdlibInvalidArgumentException,
} from './exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from './types';
import { TdlibRequestValidator, TdlibResponseValidator } from './validation';
import { TdlibRateLimiterService } from './services/tdlib-rate-limiter.service';

// Thin abstraction over the native addon. Provides basic wrappers
// around td_json_client_* for higher-level services.

interface TdlibClientHandle {
  id: string;
}

interface TdlibLibraryInfo {
  initialized: boolean;
  handle: number;
  hasCreate: boolean;
  hasSend: boolean;
  hasReceive: boolean;
  hasExecute: boolean;
  hasDestroy: boolean;
  clientCount: number;
}

interface ProxyConfig {
  type: 'http' | 'socks5' | 'socks4';
  server: string;
  port: number;
  username?: string;
  password?: string;
  secret?: string; // For MTProto proxy
}

interface SendMessageOptions {
  replyToMessageId?: number;
  disableNotification?: boolean;
  scheduleDate?: number;
}

@Injectable()
export class TdlibService implements OnModuleInit, OnModuleDestroy {
  private addon: any | null = null;
  private readonly clients = new Map<string, TdlibClientHandle>();
  private initializationPromise: Promise<void> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
    @Inject(MetricsService)
    private readonly metrics: MetricsService,
    private readonly requestValidator: TdlibRequestValidator,
    private readonly responseValidator: TdlibResponseValidator,
    private readonly rateLimiter?: TdlibRateLimiterService,
  ) {}

  async onModuleInit() {
    const enabled = this.configService.get<boolean>('TDLIB_ENABLED', true);
    if (!enabled) {
      this.logger.warn('TDLib integration disabled via TDLIB_ENABLED=false');
      return;
    }

    try {
      const addonPath =
        this.configService.get<string>('TDLIB_ADDON_PATH') ||
        path.join(process.cwd(), 'native', 'tdlib', 'build', 'Release', 'tdlib.node');

      // Verify addon file exists
      if (!require('fs').existsSync(addonPath)) {
        const errorMsg = `TDLib addon not found at ${addonPath}. ` +
          `Please build the native addon: npm run build:tdlib-addon`;
        this.logger.error(errorMsg);
        throw new TdlibLibraryLoadException(errorMsg);
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.addon = require(addonPath);
      this.logger.log(`TDLib addon loaded from ${addonPath}`);

      // Validate library can be loaded by checking library info
      if (this.addon && typeof this.addon.getLibraryInfo === 'function') {
        try {
          const info = this.addon.getLibraryInfo() as TdlibLibraryInfo;
          
          // Check if library is actually loaded
          if (!info.initialized) {
            const libPath = this.configService.get<string>('TDLIB_LIBRARY_PATH') || 
              'default path (../../vendor/tdlib/lib/libtdjson.so)';
            const errorMsg = `TDLib library not initialized. ` +
              `Library path: ${libPath}. ` +
              `Please ensure libtdjson.so is available. ` +
              `Set TDLIB_LIBRARY_PATH environment variable or build TDLib: bash scripts/build-tdlib.sh`;
            this.logger.error(errorMsg);
            throw new TdlibLibraryLoadException(errorMsg);
          }

          this.logger.log('TDLib library validated and ready', {
            initialized: info.initialized,
            clientCount: info.clientCount,
            functionsAvailable: {
              create: info.hasCreate,
              send: info.hasSend,
              receive: info.hasReceive,
              execute: info.hasExecute,
              destroy: info.hasDestroy,
            },
          });
        } catch (infoError) {
          // If getLibraryInfo fails, the library might not be loaded
          const errorMsg = `TDLib library validation failed: ${infoError instanceof Error ? infoError.message : String(infoError)}. ` +
            `Please ensure libtdjson.so is available and TDLIB_LIBRARY_PATH is set correctly.`;
          this.logger.error(errorMsg);
          throw new TdlibLibraryLoadException(errorMsg);
        }
      } else {
        // Addon loaded but doesn't have expected functions
        const errorMsg = `TDLib addon loaded but missing required functions. ` +
          `Please rebuild the native addon: npm run build:tdlib-addon`;
        this.logger.error(errorMsg);
        throw new TdlibLibraryLoadException(errorMsg);
      }
    } catch (error) {
      if (error instanceof TdlibLibraryLoadException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      const detailedError = `Failed to load TDLib addon: ${errorMessage}. ` +
        `Please verify: ` +
        `1. Native addon is built: npm run build:tdlib-addon ` +
        `2. TDLib library exists: bash scripts/ensure-tdlib-artifact.sh ` +
        `3. TDLIB_LIBRARY_PATH is set correctly (if using custom path)`;
      
      this.logger.error(detailedError, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });
      this.addon = null;
      throw new TdlibLibraryLoadException(detailedError);
    }
  }

  onModuleDestroy() {
    this.logger.log('Destroying TDLib clients...', { count: this.clients.size });
    for (const client of this.clients.values()) {
      try {
        this.destroyClient(client.id);
      } catch (error) {
        this.logger.error('Error destroying client during shutdown', {
          clientId: client.id,
          error,
        });
      }
    }
    this.clients.clear();
  }

  isReady(): boolean {
    return !!this.addon && typeof this.addon.createClient === 'function';
  }

  getLibraryInfo(): TdlibLibraryInfo | null {
    if (!this.addon || typeof this.addon.getLibraryInfo !== 'function') {
      return null;
    }
    return this.addon.getLibraryInfo() as TdlibLibraryInfo;
  }

  async createClient(context?: Record<string, any>): Promise<TdlibClientHandle> {
    if (!this.isReady()) {
      throw new TdlibNotReadyException();
    }

    try {
      // createClient returns a Promise in the new implementation
      const clientId: string = await this.addon.createClient(() => {
        // Callback for compatibility, but Promise is preferred
      });

      if (!clientId || typeof clientId !== 'string') {
        throw new Error('Failed to create TDLib client: invalid clientId returned');
      }

      const handle: TdlibClientHandle = { id: clientId };
      this.clients.set(clientId, handle);
      this.metrics.setTdlibActiveClients(this.clients.size);
      this.metrics.incrementTdlibRequests('createClient', 'success');
      this.logger.debug('TDLib client created', { clientId, context });
      return handle;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to create TDLib client', {
        error: errorMessage,
        context,
      });
      throw new TdlibLibraryLoadException(`Client creation failed: ${errorMessage}`);
    }
  }

  destroyClient(clientId: string): void {
    if (!this.addon || typeof this.addon.destroyClient !== 'function') {
      this.logger.warn('Cannot destroy client: addon not available', { clientId });
      return;
    }

    if (!this.clients.has(clientId)) {
      this.logger.warn('Attempted to destroy non-existent client', { clientId });
      return;
    }

    try {
      this.addon.destroyClient(clientId);
      this.clients.delete(clientId);
      this.metrics.setTdlibActiveClients(this.clients.size);
      this.logger.debug('TDLib client destroyed', { clientId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to destroy TDLib client', {
        clientId,
        error: errorMessage,
      });
      // Still remove from map to prevent memory leak
      this.clients.delete(clientId);
      throw new TdlibClientNotFoundException(clientId);
    }
  }

  send(clientId: string, request: TdlibRequest): void {
    const startTime = Date.now();
    const method = request['@type'] || 'unknown';

    if (!this.addon || typeof this.addon.send !== 'function') {
      this.metrics.incrementTdlibRequests(method, 'error');
      this.metrics.incrementTdlibErrors('send_failed', 0);
      throw new TdlibNotReadyException('Send function not available');
    }

    if (!this.clients.has(clientId)) {
      this.metrics.incrementTdlibRequests(method, 'error');
      this.metrics.incrementTdlibErrors('client_not_found', 404);
      throw new TdlibClientNotFoundException(clientId);
    }

    // Check rate limit (optional, fail open if not available)
    if (this.rateLimiter) {
      try {
        const rateLimitResult = await this.rateLimiter.checkClientMethodRateLimit(
          clientId,
          method,
          { requestsPerSecond: 10 },
        );
        if (!rateLimitResult.allowed) {
          this.metrics.incrementTdlibErrors('rate_limit_exceeded', 429);
          throw new TdlibSendFailedException(
            `Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`,
          );
        }
      } catch (rateLimitError) {
        // If rate limiter fails, log but don't block (fail open)
        this.logger.warn('Rate limit check failed, allowing request', {
          error: rateLimitError instanceof Error ? rateLimitError.message : String(rateLimitError),
        });
      }
    }

    // Validate request before sending
    try {
      this.requestValidator.validate(request);
    } catch (validationError) {
      const errorMessage = validationError instanceof Error ? validationError.message : String(validationError);
      this.metrics.incrementTdlibRequests(method, 'error');
      this.metrics.incrementTdlibErrors('validation_failed', 0);
      this.logger.error('TDLib request validation failed', {
        clientId,
        request,
        error: errorMessage,
      });
      throw new TdlibInvalidArgumentException(`Request validation failed: ${errorMessage}`);
    }

    try {
      const json = JSON.stringify(request);
      this.addon.send(clientId, json);
      const duration = Date.now() - startTime;
      this.metrics.recordTdlibRequestDuration(method, duration);
      this.metrics.incrementTdlibRequests(method, 'success');
      this.logger.debug('TDLib request sent', { clientId, requestType: method });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const duration = Date.now() - startTime;
      this.metrics.recordTdlibRequestDuration(method, duration);
      this.metrics.incrementTdlibRequests(method, 'error');
      this.metrics.incrementTdlibErrors('send_exception', 0);
      this.logger.error('Failed to send TDLib request', {
        clientId,
        request,
        error: errorMessage,
      });
      throw new TdlibSendFailedException(errorMessage);
    }
  }

  receive(clientId: string, timeoutSeconds = 1.0): TdlibResponse | null {
    if (!this.addon || typeof this.addon.receive !== 'function') {
      throw new TdlibNotReadyException('Receive function not available');
    }

    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    if (timeoutSeconds < 0 || timeoutSeconds > 300) {
      throw new TdlibInvalidArgumentException(
        'Timeout must be between 0 and 300 seconds',
      );
    }

    try {
      const raw: string | null = this.addon.receive(clientId, timeoutSeconds);
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw) as unknown;
        
        // Validate response
        if (this.responseValidator.validate(parsed)) {
          this.logger.debug('TDLib update received', {
            clientId,
            updateType: (parsed as Record<string, unknown>)['@type'],
          });
          return parsed as TdlibResponse;
        }
        
        return null;
      } catch (parseError) {
        this.logger.error('Failed to parse TDLib JSON update', {
          clientId,
          error: parseError,
          raw: raw.substring(0, 200), // Log first 200 chars
        });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to receive TDLib update', {
        clientId,
        timeoutSeconds,
        error: errorMessage,
      });
      // Don't throw, return null to allow retry
      return null;
    }
  }

  execute(request: TdlibRequest): TdlibResponse | null {
    if (!this.addon || typeof this.addon.execute !== 'function') {
      throw new TdlibNotReadyException('Execute function not available');
    }

    // Validate request
    try {
      this.requestValidator.validate(request);
    } catch (validationError) {
      const errorMessage = validationError instanceof Error ? validationError.message : String(validationError);
      throw new TdlibInvalidArgumentException(`Request validation failed: ${errorMessage}`);
    }

    try {
      const json = JSON.stringify(request);
      const raw: string | null = this.addon.execute(json);
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw) as unknown;
        
        // Validate response
        if (this.responseValidator.validate(parsed)) {
          return parsed as TdlibResponse;
        }
        
        return null;
      } catch (parseError) {
        this.logger.error('Failed to parse TDLib execute result', {
          request,
          error: parseError,
          raw: raw.substring(0, 200),
        });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to execute TDLib request', {
        request,
        error: errorMessage,
      });
      throw new TdlibSendFailedException(errorMessage);
    }
  }

  /**
   * Set proxy for a client
   */
  async setProxy(clientId: string, proxyConfig: ProxyConfig): Promise<void> {
    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const proxyTypeMap = {
      http: 'proxyTypeHttp',
      socks5: 'proxyTypeSocks5',
      socks4: 'proxyTypeSocks4',
    };

    const proxyType = proxyTypeMap[proxyConfig.type] || 'proxyTypeSocks5';

    const request: TdlibRequest = {
      '@type': 'addProxy',
      server: proxyConfig.server,
      port: proxyConfig.port,
      enable: true,
      type: {
        '@type': proxyType,
      },
    } as TdlibRequest;

    if (proxyConfig.username && proxyConfig.password) {
      request.type.username = proxyConfig.username;
      request.type.password = proxyConfig.password;
    }

    if (proxyConfig.secret && proxyConfig.type === 'socks5') {
      request.type.secret = proxyConfig.secret;
    }

    this.send(clientId, request);
    this.logger.log('Proxy configured', { clientId, proxyType: proxyConfig.type });
  }

  /**
   * Send a message to a chat or user
   */
  async sendMessage(
    clientId: string,
    chatId: number | string,
    message: string,
    options: SendMessageOptions = {},
  ): Promise<void> {
    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'sendMessage',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      input_message_content: {
        '@type': 'inputMessageText',
        text: {
          '@type': 'formattedText',
          text: message,
        },
      },
    } as TdlibRequest;

    if (options.replyToMessageId) {
      request.reply_to_message_id = options.replyToMessageId;
    }

    if (options.disableNotification !== undefined) {
      request.disable_notification = options.disableNotification;
    }

    if (options.scheduleDate) {
      request.scheduling_state = {
        '@type': 'messageSchedulingStateSendAtDate',
        send_date: options.scheduleDate,
      };
    }

    this.send(clientId, request);
    this.logger.debug('Message send requested', {
      clientId,
      chatId,
      hasOptions: Object.keys(options).length > 0,
    });
  }

  /**
   * Get account information (getMe)
   */
  async getMe(clientId: string): Promise<TdlibResponse> {
    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    this.send(clientId, {
      '@type': 'getMe',
    } as TdlibRequest);

    // Wait for response
    const deadline = Date.now() + 5000; // 5 second timeout
    while (Date.now() < deadline) {
      const update = this.receive(clientId, 1.0);
      if (update) {
        if (update['@type'] === 'user') {
          return update;
        }
        if (update['@type'] === 'error') {
          const error = update as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMe response');
  }

  /**
   * Get chats list
   */
  async getChats(
    clientId: string,
    limit = 100,
    offset = 0,
  ): Promise<TdlibResponse[]> {
    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    this.send(clientId, {
      '@type': 'getChats',
      chat_list: {
        '@type': 'chatListMain',
      },
      limit,
      offset_order: offset,
      offset_chat_id: 0,
    } as TdlibRequest);

    // Collect chat updates
    const chats: TdlibResponse[] = [];
    const deadline = Date.now() + 10000; // 10 second timeout

    while (Date.now() < deadline && chats.length < limit) {
      const update = this.receive(clientId, 1.0);
      if (update) {
        if (update['@type'] === 'chat') {
          chats.push(update);
        } else if (update['@type'] === 'updateChatLastMessage') {
          // Chat list update, continue collecting
          continue;
        } else if (update['@type'] === 'error') {
          break;
        }
      }
    }

    return chats;
  }

  /**
   * Search contacts
   */
  async searchContacts(clientId: string, query: string, limit = 20): Promise<TdlibResponse[]> {
    if (!this.clients.has(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    this.send(clientId, {
      '@type': 'searchContacts',
      query,
      limit,
    } as TdlibRequest);

    const contacts: TdlibResponse[] = [];
    const deadline = Date.now() + 5000;

    while (Date.now() < deadline && contacts.length < limit) {
      const update = this.receive(clientId, 1.0);
      if (update) {
        if (update['@type'] === 'users') {
          const usersResponse = update as Record<string, unknown>;
          const userIds = (usersResponse.user_ids as unknown[]) || [];
          contacts.push(...userIds.map(id => ({ '@type': 'user', id } as TdlibResponse)));
          break;
        }
        if (update['@type'] === 'error') {
          break;
        }
      }
    }

    return contacts;
  }

  getClientCount(): number {
    return this.clients.size;
  }

  getAllClientIds(): string[] {
    return Array.from(this.clients.keys());
  }
}
