import { Injectable, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../config/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { EncryptionService } from '../common/services/encryption.service';
import { TdlibService } from '../tdlib/tdlib.service';
import { TdlibSessionStore } from '../tdlib/tdlib-session.store';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import { Proxy, ProxyType, ProxyStatus } from '@prisma/client';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxiesService {
  private readonly logger = new Logger(ProxiesService.name);
  private readonly proxyTestTimeout: number;
  private readonly proxyTestEndpoint: string;
  private readonly proxyTestRetries: number;
  private readonly proxyTestRetryDelay: number;

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
    @Inject(forwardRef(() => TdlibService))
    private readonly tdlibService: TdlibService,
    @Inject(forwardRef(() => TdlibSessionStore))
    private readonly tdlibSessionStore: TdlibSessionStore,
  ) {
    // Load proxy test configuration with safe defaults
    this.proxyTestTimeout = this.configService.get<number>('PROXY_TEST_TIMEOUT_MS', 10000); // 10 seconds default
    this.proxyTestEndpoint = this.configService.get<string>(
      'PROXY_TEST_ENDPOINT',
      'https://httpbin.org/ip', // Simple endpoint that returns IP
    );
    this.proxyTestRetries = this.configService.get<number>('PROXY_TEST_RETRIES', 2); // Retry up to 2 times
    this.proxyTestRetryDelay = this.configService.get<number>('PROXY_TEST_RETRY_DELAY_MS', 1000); // 1 second delay
  }

  /**
   * Get all proxies with filtering and pagination
   */
  async findAll(filters: {
    status?: string;
    type?: string;
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<{ proxies: Proxy[]; pagination: any }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (filters.status) {
        where.status = filters.status.toUpperCase();
      }

      if (filters.type) {
        where.type = filters.type.toUpperCase();
      }

      if (filters.country) {
        where.country = filters.country;
      }

      const [proxies, total] = await Promise.all([
        this.prisma.proxy.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.proxy.count({ where }),
      ]);

      return {
        proxies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding proxies: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get proxy by ID
   */
  async findOne(id: string): Promise<Proxy> {
    try {
      return this.cacheService.getProxy(id, async () => {
        const proxy = await this.prisma.proxy.findUnique({
          where: { id },
        });

        if (!proxy) {
          throw new NotFoundException(`Proxy not found: ${id}`);
        }

        return proxy;
      });
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error finding proxy ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Create new proxy
   */
  async create(createProxyDto: CreateProxyDto, userId?: string): Promise<Proxy> {
    try {
      // Check if proxy with same host:port already exists
      const existing = await this.prisma.proxy.findFirst({
        where: {
          host: createProxyDto.host,
          port: createProxyDto.port,
        },
      });

      if (existing) {
        throw new BadRequestException(`Proxy with host ${createProxyDto.host}:${createProxyDto.port} already exists`);
      }

      const proxy = await this.prisma.proxy.create({
        data: {
          name: createProxyDto.name,
          type: createProxyDto.type as ProxyType,
          host: createProxyDto.host,
          port: createProxyDto.port,
          username: createProxyDto.username,
          password: createProxyDto.password
            ? this.encryptionService.encrypt(createProxyDto.password)
            : null,
          country: createProxyDto.country || 'Unknown',
          region: createProxyDto.region || 'Unknown',
          status: ProxyStatus.INACTIVE, // Start as inactive until tested
          isActive: true, // Can be enabled/disabled separately from status
          tags: createProxyDto.tags || [],
          notes: createProxyDto.notes,
          createdBy: userId,
        },
      });

      // Cache the newly created proxy
      await this.cacheService.set(`proxy:${proxy.id}`, proxy, 600);

      this.logger.log(`Proxy created: ${proxy.id} (${proxy.host}:${proxy.port})`);
      return proxy;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error creating proxy: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Update proxy
   */
  async update(id: string, updateProxyDto: UpdateProxyDto): Promise<Proxy> {
    try {
      const existing = await this.findOne(id);

      const updateData: any = {
        ...updateProxyDto,
        updatedAt: new Date(),
      };

      // Encrypt password if provided
      if (updateProxyDto.password !== undefined) {
        updateData.password = updateProxyDto.password
          ? this.encryptionService.encrypt(updateProxyDto.password)
          : null;
      }

      const proxy = await this.prisma.proxy.update({
        where: { id },
        data: updateData,
      });

      // Invalidate cache for this proxy
      await this.cacheService.invalidateProxy(id);

      this.logger.log(`Proxy updated: ${id}`);
      return proxy;
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error updating proxy ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Delete proxy
   */
  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);

      await this.prisma.proxy.delete({
        where: { id },
      });

      this.logger.log(`Proxy deleted: ${id}`);
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error deleting proxy ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Test proxy connectivity and health using a real HTTP check.
   * Supports HTTP, HTTPS, SOCKS4, and SOCKS5 proxies.
   */
  async testProxy(id: string): Promise<{
    status: string;
    responseTime: number;
    isWorking: boolean;
    testedAt: Date;
    error?: string;
    detectedIp?: string;
  }> {
    try {
      const proxy = await this.findOne(id);
      const startTime = Date.now();
      let isWorking = false;
      let responseTime: number | null = null;
      let error: string | undefined;
      let detectedIp: string | undefined;

      // Retry logic for flaky proxies
      let lastError: Error | null = null;
      for (let attempt = 0; attempt <= this.proxyTestRetries; attempt++) {
        try {
          if (attempt > 0) {
            this.logger.debug(`Retrying proxy test for ${id} (attempt ${attempt + 1}/${this.proxyTestRetries + 1})`);
            await new Promise((resolve) => setTimeout(resolve, this.proxyTestRetryDelay));
          }

          const result = await this.performProxyTest(proxy);
          isWorking = result.success;
          responseTime = result.responseTime;
          detectedIp = result.detectedIp;
          error = result.error;

          if (isWorking) {
            break; // Success, exit retry loop
          } else {
            lastError = result.error ? new Error(result.error) : new Error('Proxy test failed');
          }
        } catch (testError: any) {
          lastError = testError instanceof Error ? testError : new Error(String(testError));
          this.logger.warn(`Proxy test attempt ${attempt + 1} failed for ${id}: ${lastError.message}`);
        }
      }

      // If all retries failed, use the last error
      if (!isWorking && lastError) {
        error = lastError.message || 'Proxy test failed after retries';
        responseTime = Date.now() - startTime;
      }

      // Update proxy health metrics
      const updatedProxy = await this.prisma.proxy.update({
        where: { id },
        data: {
          status: isWorking ? ProxyStatus.ACTIVE : ProxyStatus.ERROR,
          healthScore: isWorking
            ? Math.min(100, Math.max(proxy.healthScore || 50, 80))
            : Math.max(0, Math.min(proxy.healthScore || 50, 20)),
          responseTime: responseTime || proxy.responseTime,
          lastChecked: new Date(),
        },
      });

      // Log health check
      await this.prisma.proxyHealthLog.create({
        data: {
          proxyId: id,
          testType: 'CONNECTIVITY',
          isHealthy: isWorking,
          responseTime,
          error,
          createdAt: new Date(),
        },
      });

      this.logger.log(
        `Proxy ${id} (${proxy.host}:${proxy.port}) test completed: ${isWorking ? 'HEALTHY' : 'UNHEALTHY'} ` +
          `(${responseTime}ms${detectedIp ? `, IP: ${detectedIp}` : ''})`,
      );

      return {
        status: isWorking ? 'healthy' : 'unhealthy',
        responseTime: responseTime || 0,
        isWorking,
        testedAt: new Date(),
        error,
        detectedIp,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error testing proxy ${id}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Perform actual proxy test by making HTTP request through the proxy.
   * Returns success status, response time, detected IP, and error message.
   */
  private async performProxyTest(proxy: Proxy): Promise<{
    success: boolean;
    responseTime: number;
    detectedIp?: string;
    error?: string;
  }> {
    const startTime = Date.now();
    let agent: HttpsProxyAgent | SocksProxyAgent | undefined;

    try {
      // Build proxy URL based on type
      let proxyUrl: string;
      if (proxy.username && proxy.password) {
        proxyUrl = `${proxy.type.toLowerCase()}://${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password)}@${proxy.host}:${proxy.port}`;
      } else {
        proxyUrl = `${proxy.type.toLowerCase()}://${proxy.host}:${proxy.port}`;
      }

      // Create appropriate agent based on proxy type
      if (proxy.type === ProxyType.HTTP || proxy.type === ProxyType.HTTPS) {
        agent = new HttpsProxyAgent(proxyUrl, {
          timeout: this.proxyTestTimeout,
          rejectUnauthorized: false, // Allow self-signed certificates for testing
        });
      } else if (
        proxy.type === ProxyType.SOCKS4 ||
        proxy.type === ProxyType.SOCKS4A ||
        proxy.type === ProxyType.SOCKS5 ||
        proxy.type === ProxyType.SOCKS5_WITH_UDP
      ) {
        agent = new SocksProxyAgent(proxyUrl, {
          timeout: this.proxyTestTimeout,
        });
      } else {
        throw new Error(`Unsupported proxy type: ${proxy.type}`);
      }

      // Create axios instance with proxy agent
      const axiosConfig: AxiosRequestConfig = {
        httpAgent: agent,
        httpsAgent: agent,
        timeout: this.proxyTestTimeout,
        validateStatus: (status) => status < 500, // Accept 2xx, 3xx, 4xx responses
        headers: {
          'User-Agent': 'TelegramPlatformBackend/1.0.0 ProxyTester',
        },
      };

      // Make test request
      const response = await axios.get(this.proxyTestEndpoint, axiosConfig);
      const responseTime = Date.now() - startTime;

      // Extract detected IP from response (httpbin.org/ip returns {origin: "ip"})
      let detectedIp: string | undefined;
      if (response.data && typeof response.data === 'object') {
        detectedIp = response.data.origin || response.data.ip || response.data.query;
      }

      // Consider successful if we got a response (even if status is not 200)
      const success = response.status < 500 && responseTime < this.proxyTestTimeout;

      return {
        success,
        responseTime,
        detectedIp,
        error: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (testError: any) {
      const responseTime = Date.now() - startTime;
      let errorMessage = 'Proxy test failed';

      if (testError.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused - proxy server may be down';
      } else if (testError.code === 'ETIMEDOUT' || testError.code === 'ECONNRESET') {
        errorMessage = `Connection timeout after ${responseTime}ms`;
      } else if (testError.code === 'ENOTFOUND') {
        errorMessage = `Proxy host not found: ${proxy.host}`;
      } else if (testError.code === 'EPROTO' || testError.code === 'CERT_HAS_EXPIRED') {
        errorMessage = 'SSL/TLS handshake failed';
      } else if (testError.response) {
        errorMessage = `HTTP ${testError.response.status}: ${testError.response.statusText}`;
      } else if (testError.message) {
        errorMessage = testError.message;
      }

      return {
        success: false,
        responseTime,
        error: errorMessage,
      };
    } finally {
      // Cleanup: close agent connections if possible
      if (agent && 'destroy' in agent) {
        try {
          (agent as any).destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }

  /**
   * Get proxy statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    error: number;
    byCountry: Record<string, number>;
    byType: Record<string, number>;
    averageHealthScore: number;
    averageResponseTime: number;
  }> {
    try {
      const [total, active, inactive, error, allProxies] = await Promise.all([
        this.prisma.proxy.count(),
        this.prisma.proxy.count({ where: { status: ProxyStatus.ACTIVE } }),
        this.prisma.proxy.count({ where: { status: ProxyStatus.INACTIVE } }),
        this.prisma.proxy.count({ where: { status: ProxyStatus.ERROR } }),
        this.prisma.proxy.findMany({
          select: {
            country: true,
            type: true,
            healthScore: true,
            responseTime: true,
          },
        }),
      ]);

      // Calculate statistics
      const byCountry: Record<string, number> = {};
      const byType: Record<string, number> = {};
      let totalHealthScore = 0;
      let totalResponseTime = 0;
      let responseTimeCount = 0;

      allProxies.forEach((proxy) => {
        // Count by country
        const country = proxy.country || 'Unknown';
        byCountry[country] = (byCountry[country] || 0) + 1;

        // Count by type
        const type = proxy.type || 'Unknown';
        byType[type] = (byType[type] || 0) + 1;

        // Calculate averages
        totalHealthScore += proxy.healthScore;
        if (proxy.responseTime) {
          totalResponseTime += proxy.responseTime;
          responseTimeCount++;
        }
      });

      return {
        total,
        active,
        inactive,
        error,
        byCountry,
        byType,
        averageHealthScore: total > 0 ? totalHealthScore / total : 0,
        averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error getting proxy stats: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Rotate proxies for accounts
   */
  async rotateProxies(accountIds?: string[]): Promise<{
    rotated: number;
    failed: number;
    details: Array<{ accountId: string; oldProxyId?: string; newProxyId?: string; error?: string }>;
  }> {
    try {
      const details: Array<{ accountId: string; oldProxyId?: string; newProxyId?: string; error?: string }> = [];
      let rotated = 0;
      let failed = 0;

      // Get accounts that need proxy rotation
      const where: any = {};
      if (accountIds && accountIds.length > 0) {
        where.id = { in: accountIds };
      }

      const accounts = await this.prisma.telegramAccount.findMany({
        where,
        include: {
          proxyAssignments: {
            where: { isActive: true },
            include: { proxy: true },
          },
        },
      });

      for (const account of accounts) {
        const currentProxy = account.proxyAssignments[0]?.proxy;
        let newProxy: Proxy | null = null;
        let error: string | undefined;

        try {
          // Find a different healthy proxy
          const availableProxies = await this.prisma.proxy.findMany({
            where: {
              status: ProxyStatus.ACTIVE,
              isActive: true,
              healthScore: { gte: 70 },
              id: currentProxy ? { not: currentProxy.id } : undefined,
            },
            orderBy: { healthScore: 'desc' },
            take: 1,
          });

          if (availableProxies.length > 0) {
            newProxy = availableProxies[0];

            // Deactivate current assignment
            if (currentProxy) {
              await this.prisma.accountProxyAssignment.updateMany({
                where: {
                  accountId: account.id,
                  proxyId: currentProxy.id,
                  isActive: true,
                },
                data: {
                  isActive: false,
                },
              });
            }

            // Create new assignment
            await this.prisma.accountProxyAssignment.create({
              data: {
                accountId: account.id,
                proxyId: newProxy.id,
                isActive: true,
              },
            });

            // Update TDLib client with new proxy
            try {
              await this.updateTdlibClientProxy(account.id, newProxy);
            } catch (tdlibError) {
              this.logger.warn('Failed to update TDLib client proxy after rotation', {
                accountId: account.id,
                proxyId: newProxy.id,
                error: tdlibError instanceof Error ? tdlibError.message : String(tdlibError),
              });
              // Continue - proxy assignment is updated even if TDLib update fails
            }

            rotated++;
          } else {
            error = 'No available healthy proxy found';
            failed++;
          }
        } catch (err: any) {
          error = err.message || 'Failed to rotate proxy';
          failed++;
        }

        details.push({
          accountId: account.id,
          oldProxyId: currentProxy?.id,
          newProxyId: newProxy?.id,
          error,
        });
      }

      return {
        rotated,
        failed,
        details,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(
        `Error rotating proxies: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Update TDLib client proxy for an account
   */
  private async updateTdlibClientProxy(accountId: string, proxy: Proxy): Promise<void> {
    // Get active sessions for this account
    const sessions = await this.tdlibSessionStore.getSessionsByAccountId(accountId);
    const activeSession = sessions.find((s) => !s.revokedAt);

    if (!activeSession) {
      this.logger.debug('No active TDLib session found for account', { accountId });
      return;
    }

    // Convert proxy to TDLib config format
    const proxyConfig = this.convertProxyToTdlibConfig(proxy);
    if (!proxyConfig) {
      throw new Error(`Failed to convert proxy ${proxy.id} to TDLib config`);
    }

    // Update proxy in TDLib
    await this.tdlibService.setProxy(activeSession.clientId, proxyConfig);
    this.logger.log('TDLib client proxy updated after rotation', {
      accountId,
      clientId: activeSession.clientId,
      proxyId: proxy.id,
    });
  }

  /**
   * Convert Proxy model to TDLib proxy configuration
   */
  private convertProxyToTdlibConfig(proxy: Proxy): {
    type: 'http' | 'socks5' | 'socks4';
    server: string;
    port: number;
    username?: string;
    password?: string;
    secret?: string;
  } | null {
    let proxyType: 'http' | 'socks5' | 'socks4';
    switch (proxy.type) {
      case ProxyType.HTTP:
        proxyType = 'http';
        break;
      case ProxyType.SOCKS5:
        proxyType = 'socks5';
        break;
      case ProxyType.SOCKS4:
        proxyType = 'socks4';
        break;
      default:
        this.logger.warn('Unsupported proxy type', { proxyId: proxy.id, type: proxy.type });
        return null;
    }

    const config: any = {
      type: proxyType,
      server: proxy.host,
      port: proxy.port,
    };

    if (proxy.username) {
      config.username = proxy.username;
    }

    if (proxy.password) {
      // Decrypt password if encrypted
      try {
        config.password = this.encryptionService.decrypt(proxy.password);
      } catch (error) {
        // If decryption fails, assume it's plaintext
        config.password = proxy.password;
      }
    }

    return config;
  }
}
