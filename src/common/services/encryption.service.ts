import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service for encrypting/decrypting sensitive data like proxy passwords
 * Uses AES-256-GCM for authenticated encryption
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly encryptionKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    // Get encryption key from environment or generate a default (for development only)
    const keyString = this.configService.get<string>('ENCRYPTION_KEY');
    if (keyString) {
      this.encryptionKey = Buffer.from(keyString, 'hex');
    } else {
      // Default key for development - MUST be changed in production
      this.encryptionKey = crypto.scryptSync(
        this.configService.get<string>('ENCRYPTION_SALT', 'default-salt-change-in-production'),
        'salt',
        this.keyLength,
      );
    }

    if (this.encryptionKey.length !== this.keyLength) {
      throw new Error(`Encryption key must be ${this.keyLength} bytes`);
    }
  }

  /**
   * Encrypt a string value
   */
  encrypt(plaintext: string): string {
    if (!plaintext) {
      return plaintext;
    }

    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      // Return format: iv:tag:encrypted
      return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decrypt a string value
   */
  decrypt(ciphertext: string): string {
    if (!ciphertext) {
      return ciphertext;
    }

    // Check if already decrypted (plain text)
    if (!ciphertext.includes(':')) {
      // Assume it's plain text (for backward compatibility)
      return ciphertext;
    }

    try {
      const parts = ciphertext.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid ciphertext format');
      }

      const [ivHex, tagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      // If decryption fails, assume it's plain text (for backward compatibility)
      // In production, you might want to log this and handle it differently
      return ciphertext;
    }
  }

  /**
   * Check if a string is encrypted
   */
  isEncrypted(value: string): boolean {
    if (!value) {
      return false;
    }
    return value.includes(':') && value.split(':').length === 3;
  }

  /**
   * Decrypt with a specific key (for key rotation)
   */
  decryptWithKey(ciphertext: string, keyHex: string): string {
    if (!ciphertext) {
      return ciphertext;
    }

    // Check if already decrypted (plain text)
    if (!ciphertext.includes(':')) {
      return ciphertext;
    }

    try {
      const key = Buffer.from(keyHex, 'hex');
      if (key.length !== this.keyLength) {
        throw new Error(`Key must be ${this.keyLength} bytes`);
      }

      const parts = ciphertext.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid ciphertext format');
      }

      const [ivHex, tagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption with key failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Encrypt with a specific key (for key rotation)
   */
  encryptWithKey(plaintext: string, keyHex: string): string {
    if (!plaintext) {
      return plaintext;
    }

    try {
      const key = Buffer.from(keyHex, 'hex');
      if (key.length !== this.keyLength) {
        throw new Error(`Key must be ${this.keyLength} bytes`);
      }

      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption with key failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
