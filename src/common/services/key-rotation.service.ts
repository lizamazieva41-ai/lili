import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EncryptionService } from './encryption.service';
import { PrismaService } from '../../config/prisma.service';

/**
 * Service for managing encryption key rotation
 * 
 * Key rotation strategy:
 * 1. Support multiple keys (current + previous) for graceful migration
 * 2. Re-encrypt data with new key during rotation
 * 3. Schedule automatic rotation (e.g., every 90 days)
 * 4. Manual rotation via API endpoint
 */
@Injectable()
export class KeyRotationService {
  private readonly logger = new Logger(KeyRotationService.name);
  private readonly rotationEnabled: boolean;
  private readonly rotationIntervalDays: number;
  private readonly encryptionService: EncryptionService;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    encryptionService: EncryptionService,
  ) {
    this.encryptionService = encryptionService;
    this.rotationEnabled = this.configService.get<boolean>('ENCRYPTION_KEY_ROTATION_ENABLED', false);
    this.rotationIntervalDays = this.configService.get<number>('ENCRYPTION_KEY_ROTATION_INTERVAL_DAYS', 90);
  }

  /**
   * Check if key rotation is needed
   */
  async checkRotationNeeded(): Promise<boolean> {
    if (!this.rotationEnabled) {
      return false;
    }

    const lastRotation = await this.getLastRotationDate();
    if (!lastRotation) {
      // First time, no rotation needed yet
      return false;
    }

    const daysSinceRotation = Math.floor(
      (Date.now() - lastRotation.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysSinceRotation >= this.rotationIntervalDays;
  }

  /**
   * Rotate encryption key
   * This will re-encrypt all encrypted data with the new key
   */
  async rotateKey(newKey?: string): Promise<void> {
    if (!this.rotationEnabled) {
      this.logger.warn('Key rotation is disabled');
      return;
    }

    this.logger.log('Starting key rotation...');

    // Generate new key if not provided
    const newEncryptionKey = newKey || this.generateNewKey();
    
    // Store previous key for migration period
    const previousKey = this.configService.get<string>('ENCRYPTION_KEY');
    
    if (!previousKey) {
      throw new Error('Current encryption key not found');
    }

    try {
      // Re-encrypt proxy passwords
      await this.rotateProxyPasswords(previousKey, newEncryptionKey);

      // Re-encrypt session data
      await this.rotateSessionData(previousKey, newEncryptionKey);

      // Update last rotation date
      await this.setLastRotationDate(new Date());

      this.logger.log('Key rotation completed successfully');
      this.logger.warn('⚠️  IMPORTANT: Update ENCRYPTION_KEY environment variable with new key');
      this.logger.warn(`New key: ${newEncryptionKey}`);

      // In production, you might want to:
      // 1. Store new key in secure key management service
      // 2. Update environment variable via deployment system
      // 3. Restart application to use new key
    } catch (error) {
      this.logger.error('Key rotation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Re-encrypt proxy passwords with new key
   */
  private async rotateProxyPasswords(oldKey: string, newKey: string): Promise<void> {
    this.logger.log('Re-encrypting proxy passwords...');

    const proxies = await this.prisma.proxy.findMany({
      where: {
        password: { not: null },
      },
    });

    let rotated = 0;
    let failed = 0;

    for (const proxy of proxies) {
      try {
        if (!proxy.password) {
          continue;
        }

        // Skip if not encrypted (plain text, backward compatibility)
        if (!this.encryptionService.isEncrypted(proxy.password)) {
          // Encrypt plain text with new key
          const encrypted = this.encryptionService.encryptWithKey(proxy.password, newKey);
          await this.prisma.proxy.update({
            where: { id: proxy.id },
            data: { password: encrypted },
          });
          rotated++;
          continue;
        }

        // Decrypt with old key
        const decrypted = this.encryptionService.decryptWithKey(proxy.password, oldKey);

        // Encrypt with new key
        const reEncrypted = this.encryptionService.encryptWithKey(decrypted, newKey);

        // Update in database
        await this.prisma.proxy.update({
          where: { id: proxy.id },
          data: { password: reEncrypted },
        });

        rotated++;
      } catch (error) {
        this.logger.warn(`Failed to rotate proxy ${proxy.id}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        failed++;
      }
    }

    this.logger.log(`Re-encrypted ${rotated} proxy passwords${failed > 0 ? `, ${failed} failed` : ''}`);
  }

  /**
   * Re-encrypt session data with new key
   */
  private async rotateSessionData(oldKey: string, newKey: string): Promise<void> {
    this.logger.log('Re-encrypting session data...');

    // Session data is primarily in Redis, but we can update DB backups
    const sessions = await this.prisma.accountSession.findMany({
      where: {
        isActive: true,
      },
    });

    let rotated = 0;
    let failed = 0;

    for (const session of sessions) {
      try {
        const sessionData = session.sessionData as any;
        if (!sessionData?.encrypted) {
          continue;
        }

        // Skip if not encrypted
        if (!this.encryptionService.isEncrypted(sessionData.encrypted)) {
          // Encrypt plain text with new key
          const encrypted = this.encryptionService.encryptWithKey(JSON.stringify(sessionData), newKey);
          await this.prisma.accountSession.update({
            where: { id: session.id },
            data: { sessionData: { encrypted } },
          });
          rotated++;
          continue;
        }

        // Decrypt with old key
        const decrypted = this.encryptionService.decryptWithKey(sessionData.encrypted, oldKey);

        // Encrypt with new key
        const reEncrypted = this.encryptionService.encryptWithKey(decrypted, newKey);

        // Update in database
        await this.prisma.accountSession.update({
          where: { id: session.id },
          data: { sessionData: { encrypted: reEncrypted } },
        });

        rotated++;
      } catch (error) {
        this.logger.warn(`Failed to rotate session ${session.id}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        failed++;
      }
    }

    this.logger.log(`Re-encrypted ${rotated} session backups${failed > 0 ? `, ${failed} failed` : ''}`);
    this.logger.warn('Note: Redis sessions will be re-encrypted on next access');
  }

  /**
   * Get last rotation date from environment or return null
   * In production, consider storing in a key management service or database
   */
  private async getLastRotationDate(): Promise<Date | null> {
    // Check environment variable first
    const lastRotationEnv = this.configService.get<string>('ENCRYPTION_KEY_LAST_ROTATION');
    if (lastRotationEnv) {
      try {
        return new Date(lastRotationEnv);
      } catch {
        // Invalid date format, continue
      }
    }

    // Could also check a file or database table if needed
    // For now, return null (first rotation)
    return null;
  }

  /**
   * Set last rotation date
   * In production, store in key management service or database
   */
  private async setLastRotationDate(date: Date): Promise<void> {
    // Log the rotation date - in production, store in:
    // 1. Key management service (AWS KMS, HashiCorp Vault, etc.)
    // 2. Database table
    // 3. Environment variable (for this session)
    this.logger.log('Encryption key rotation date', {
      date: date.toISOString(),
      note: 'Store this date in ENCRYPTION_KEY_LAST_ROTATION or key management service',
    });

    // Set environment variable for current process
    process.env.ENCRYPTION_KEY_LAST_ROTATION = date.toISOString();
  }

  /**
   * Generate a new encryption key
   */
  private generateNewKey(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Scheduled check for key rotation (runs daily)
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduledRotationCheck(): Promise<void> {
    if (!this.rotationEnabled) {
      return;
    }

    const needsRotation = await this.checkRotationNeeded();
    if (needsRotation) {
      this.logger.warn('Key rotation needed - manual rotation required');
      // In production, you might want to:
      // 1. Send alert to administrators
      // 2. Auto-rotate if configured
      // 3. Create rotation job
    }
  }
}
