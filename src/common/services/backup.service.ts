import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = process.env.BACKUP_DIR || './backups';
  private readonly dbHost = process.env.DB_HOST || 'localhost';
  private readonly dbPort = process.env.DB_PORT || '5432';
  private readonly dbName = process.env.DB_NAME || 'telegram_platform';
  private readonly dbUser = process.env.DB_USER || 'postgres';

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Daily backup at 3 AM
  @Cron('0 3 * * *')
  async createDailyBackup() {
    this.logger.log('Starting daily database backup...');

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `telegram_platform_backup_${timestamp}.sql`;
      const filepath = path.join(this.backupDir, filename);

      // Create PostgreSQL dump
      const command = `pg_dump -h ${this.dbHost} -p ${this.dbPort} -U ${this.dbUser} -d ${this.dbName} -f ${filepath} --no-password --format=custom`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.DB_PASSWORD || 'password'
        }
      });

      // Verify backup file exists and has content
      const stats = fs.statSync(filepath);
      if (stats.size > 0) {
        this.logger.log(`Daily backup completed successfully: ${filename} (${stats.size} bytes)`);

        // Clean up old backups (keep last 30 days)
        await this.cleanupOldBackups(30);

        return { success: true, filename, size: stats.size };
      } else {
        throw new Error('Backup file is empty');
      }
    } catch (error) {
      this.logger.error('Daily backup failed:', error);
      throw error;
    }
  }

  // Weekly full backup on Sundays at 4 AM
  @Cron('0 4 * * 0')
  async createWeeklyBackup() {
    this.logger.log('Starting weekly full database backup...');

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `telegram_platform_weekly_backup_${timestamp}.sql`;
      const filepath = path.join(this.backupDir, filename);

      // Create full PostgreSQL dump with verbose output
      const command = `pg_dump -h ${this.dbHost} -p ${this.dbPort} -U ${this.dbUser} -d ${this.dbName} -f ${filepath} --no-password --format=custom --verbose`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.DB_PASSWORD || 'password'
        }
      });

      const stats = fs.statSync(filepath);
      this.logger.log(`Weekly backup completed successfully: ${filename} (${stats.size} bytes)`);

      // Clean up old weekly backups (keep last 12 weeks)
      await this.cleanupOldBackups(84, 'weekly');

      return { success: true, filename, size: stats.size };
    } catch (error) {
      this.logger.error('Weekly backup failed:', error);
      throw error;
    }
  }

  // Redis backup (RDB snapshot)
  @Cron('0 3 * * *')
  async backupRedis() {
    this.logger.log('Starting Redis backup...');

    try {
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = process.env.REDIS_PORT || '6379';

      // Trigger Redis BGSAVE
      const command = `redis-cli -h ${redisHost} -p ${redisPort} BGSAVE`;

      await execAsync(command);

      // Wait a moment for BGSAVE to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if dump.rdb was created/modified recently
      const dumpPath = process.env.REDIS_DUMP_PATH || '/var/lib/redis/dump.rdb';
      if (fs.existsSync(dumpPath)) {
        const stats = fs.statSync(dumpPath);
        const lastModified = new Date(stats.mtime);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        if (lastModified > fiveMinutesAgo) {
          // Copy dump.rdb to backup directory
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
          const backupPath = path.join(this.backupDir, `redis_dump_${timestamp}.rdb`);

          fs.copyFileSync(dumpPath, backupPath);
          const backupStats = fs.statSync(backupPath);

          this.logger.log(`Redis backup completed: ${backupPath} (${backupStats.size} bytes)`);

          // Clean up old Redis backups (keep last 7 days)
          await this.cleanupOldBackups(7, 'redis');

          return { success: true, filename: `redis_dump_${timestamp}.rdb`, size: backupStats.size };
        } else {
          this.logger.warn('Redis dump file was not recently modified');
          return { success: false, reason: 'Dump file not recent' };
        }
      } else {
        this.logger.warn('Redis dump file not found');
        return { success: false, reason: 'Dump file not found' };
      }
    } catch (error) {
      this.logger.error('Redis backup failed:', error);
      const err = error as any;
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  private async cleanupOldBackups(daysToKeep: number, prefix?: string) {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => {
          if (prefix) {
            return file.startsWith(prefix);
          }
          return file.endsWith('.sql') || file.endsWith('.rdb');
        })
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stats: fs.statSync(path.join(this.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let deletedCount = 0;
      for (const file of files.slice(daysToKeep)) { // Keep the most recent N files
        if (file.stats.mtime < cutoffDate) {
          fs.unlinkSync(file.path);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        this.logger.log(`Cleaned up ${deletedCount} old backup files`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old backups:', error);
    }
  }

  // Manual backup method
  async createManualBackup(type: 'full' | 'redis' = 'full') {
    this.logger.log(`Creating manual ${type} backup...`);

    if (type === 'redis') {
      return this.backupRedis();
    } else {
      return this.createDailyBackup();
    }
  }

  // Get backup statistics
  async getBackupStats() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.sql') || file.endsWith('.rdb'))
        .map(file => {
          const filepath = path.join(this.backupDir, file);
          const stats = fs.statSync(filepath);
          return {
            filename: file,
            size: stats.size,
            created: stats.mtime,
            type: file.includes('redis') ? 'redis' : 'postgresql'
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const lastBackup = files.length > 0 ? files[0].created : null;

      return {
        totalBackups: files.length,
        totalSize,
        lastBackup,
        recentBackups: files.slice(0, 10), // Last 10 backups
        backupDirectory: this.backupDir
      };
    } catch (error) {
      this.logger.error('Failed to get backup stats:', error);
      return {
        error: (error as any) instanceof Error ? (error as any).message : String(error),
        backupDirectory: this.backupDir
      };
    }
  }

  // Restore from backup (dangerous operation - use with caution)
  async restoreFromBackup(filename: string): Promise<{ success: boolean; message: string }> {
    try {
      const filepath = path.join(this.backupDir, filename);

      if (!fs.existsSync(filepath)) {
        return { success: false, message: `Backup file not found: ${filename}` };
      }

      // This is a dangerous operation - in production, this should require additional confirmation
      this.logger.warn(`Starting restore from backup: ${filename}`);

      const command = `pg_restore -h ${this.dbHost} -p ${this.dbPort} -U ${this.dbUser} -d ${this.dbName} --clean --if-exists ${filepath}`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.DB_PASSWORD || 'password'
        }
      });

      this.logger.log(`Successfully restored from backup: ${filename}`);
      return { success: true, message: `Restored from ${filename}` };

    } catch (error) {
      this.logger.error('Restore failed:', error);
      const err = error as any;
      return { success: false, message: `Restore failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  }
}