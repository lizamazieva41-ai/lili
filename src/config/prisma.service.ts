import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connectionStartTime: number = 0;

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: configService.get<string>('NODE_ENV') === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
    });

    // Connection pool configuration
    // Prisma uses connection pooling via the connection string
    // To set pool size, add ?connection_limit=50 to DATABASE_URL
    // Example: postgresql://user:pass@host:5432/db?connection_limit=50&pool_timeout=20

    // Setup query logging in development
    if (configService.get<string>('NODE_ENV') === 'development') {
      this.$on('query' as never, (e: any) => {
        const queryTime = e.duration;
        if (queryTime > 100) {
          // Log slow queries (>100ms)
          this.logger.warn(`Slow query detected (${queryTime}ms): ${e.query}`);
        }
      });

      this.$on('warn' as never, (e: any) => {
        this.logger.warn(`Prisma warning: ${e.message}`);
      });
    }

    this.$on('error' as never, (e: any) => {
      this.logger.error(`Prisma error: ${e.message}`, e);
    });
  }

  async onModuleInit() {
    if (this.configService.get<string>('NODE_ENV') === 'test') {
      this.logger.log('Skipping database connection in test environment');
      return;
    }
    this.connectionStartTime = Date.now();
    try {
      await this.$connect();
      const connectionTime = Date.now() - this.connectionStartTime;
      this.logger.log(`✅ Database connected successfully (${connectionTime}ms)`);
      
      // Log connection pool info
      await this.logConnectionInfo();
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.configService.get<string>('NODE_ENV') === 'test') {
      return;
    }
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error('Error closing database connection', error);
    }
  }

  /**
   * Get connection pool statistics
   */
  async getConnectionStats(): Promise<{
    connected: boolean;
    uptime: number;
    queryCount?: number;
  }> {
    try {
      // Execute a simple query to check connection
      await this.$queryRaw`SELECT 1`;
      
      return {
        connected: true,
        uptime: Date.now() - this.connectionStartTime,
      };
    } catch (error) {
      return {
        connected: false,
        uptime: Date.now() - this.connectionStartTime,
      };
    }
  }

  /**
   * Log connection information
   */
  private async logConnectionInfo() {
    try {
      // Get database version
      const result = await this.$queryRaw<Array<{ version: string }>>`
        SELECT version()
      `;
      
      if (result && result.length > 0) {
        this.logger.log(`Database version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
      }

      // Check connection pool settings from URL
      const dbUrl = this.configService.get<string>('DATABASE_URL') || '';
      const urlParams = new URLSearchParams(dbUrl.split('?')[1] || '');
      const connectionLimit = urlParams.get('connection_limit') || '10 (default)';
      const poolTimeout = urlParams.get('pool_timeout') || '10 (default)';
      
      this.logger.log(`Connection pool limit: ${connectionLimit}`);
      this.logger.log(`Pool timeout: ${poolTimeout}s`);
      
      if (!dbUrl.includes('connection_limit')) {
        this.logger.warn(
          '⚠️  Connection pool limit not set in DATABASE_URL. ' +
          'Add ?connection_limit=50 to optimize performance. ' +
          'Example: postgresql://user:pass@host:5432/db?connection_limit=50&pool_timeout=20'
        );
      }
    } catch (error) {
      this.logger.warn('Could not retrieve database connection info', error);
    }
  }

  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<{ status: string; responseTime: number }> {
    const startTime = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('Database health check failed', error);
      return {
        status: 'unhealthy',
        responseTime,
      };
    }
  }
}