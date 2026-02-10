import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: configService.get('NODE_ENV') === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🗄️  Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🗄️  Database disconnected');
  }

  // Transaction helper
  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.$transaction(callback);
  }

  // Batch operation helper
  async batch<T>(operations: Prisma.PrismaPromise<T>[]): Promise<T[]> {
    return this.$transaction(operations);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: Date; details: any }> {
    try {
      await this.$queryRaw`SELECT 1`;
      const stats = await this.getDatabaseStats();
      return {
        status: 'healthy',
        timestamp: new Date(),
        details: stats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        details: { error: (error as Error).message }
      };
    }
  }

  // Database statistics
  async getDatabaseStats(): Promise<any> {
    const [
      userCount,
      activeSessions,
      activeLicenses,
      activeProxies,
      pendingJobs,
      totalMessages
    ] = await Promise.all([
      this.user.count(),
      this.userSession.count({ where: { isActive: true } }),
      this.license.count({ where: { status: 'ACTIVE' } }),
      this.proxy.count({ where: { status: 'ACTIVE' } }),
      this.job.count({ where: { status: 'PENDING' } }),
      this.message.count()
    ]);

    return {
      users: userCount,
      activeSessions,
      activeLicenses,
      activeProxies,
      pendingJobs,
      totalMessages
    };
  }

  // Cleanup helper
  async cleanup(): Promise<{ deleted: { sessions: number; logs: number; expiredJobs: number } }> {
    const now = new Date();
    
    const [deletedSessions, deletedLogs, expiredJobs] = await Promise.all([
      // Clean expired sessions
      this.userSession.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: now } },
            { isActive: false, updatedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } }
          ]
        }
      }),
      
      // Clean old logs (older than 30 days)
      this.authAuditLog.deleteMany({
        where: {
          createdAt: { lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Clean expired jobs
      this.job.deleteMany({
        where: {
          status: 'FAILED',
          failedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    return {
      deleted: {
        sessions: deletedSessions.count,
        logs: deletedLogs.count,
        expiredJobs: expiredJobs.count
      }
    };
  }

  // Backup helper
  async backupData(): Promise<{ timestamp: string; tables: string[] }> {
    const timestamp = new Date().toISOString();
    const tables = [
      'users',
      'user_sessions',
      'licenses',
      'api_keys',
      'proxies',
      'jobs',
      'campaigns',
      'messages',
      'usage_logs'
    ];

    return {
      timestamp,
      tables
    };
  }
}