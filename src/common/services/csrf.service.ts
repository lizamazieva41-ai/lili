import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../config/redis.service';
import { createHmac, randomBytes } from 'crypto';

/**
 * CSRF Token Service
 * 
 * Implements CSRF protection using double-submit cookie pattern:
 * - Generates cryptographically secure tokens
 * - Stores tokens in Redis with session binding
 * - Validates tokens on state-changing requests
 * - Supports token rotation for enhanced security
 */
@Injectable()
export class CsrfService {
  private readonly logger = new Logger(CsrfService.name);
  private readonly secret: string;
  private readonly tokenLength = 32;
  private readonly tokenTTL = 60 * 60; // 1 hour in seconds
  private readonly redisKeyPrefix = 'csrf:token:';

  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {
    // Get CSRF secret from config or generate warning
    this.secret = this.configService.get<string>('CSRF_SECRET') || 
                  this.configService.get<string>('JWT_SECRET') || 
                  'default-csrf-secret-change-in-production';
    
    if (!this.configService.get<string>('CSRF_SECRET')) {
      this.logger.warn('CSRF_SECRET not set, using JWT_SECRET or default. Set CSRF_SECRET in production!');
    }
  }

  /**
   * Generate a new CSRF token
   * 
   * @param sessionId - Session ID to bind token to
   * @returns Generated CSRF token
   */
  async generateToken(sessionId: string): Promise<string> {
    // Generate random token
    const randomToken = randomBytes(this.tokenLength).toString('hex');
    
    // Create HMAC signature
    const signature = this.createSignature(randomToken, sessionId);
    
    // Combine token and signature
    const token = `${randomToken}.${signature}`;
    
    // Store token in Redis with session binding
    const redisKey = `${this.redisKeyPrefix}${sessionId}`;
    await this.redisService.set(redisKey, token, this.tokenTTL);
    
    this.logger.debug(`CSRF token generated for session ${sessionId}`);
    
    return token;
  }

  /**
   * Validate CSRF token
   * 
   * @param token - CSRF token to validate
   * @param sessionId - Session ID the token should be bound to
   * @returns true if token is valid, false otherwise
   */
  async validateToken(token: string, sessionId: string): Promise<boolean> {
    if (!token || !sessionId) {
      this.logger.debug('CSRF validation failed: missing token or sessionId');
      return false;
    }

    // Split token and signature
    const parts = token.split('.');
    if (parts.length !== 2) {
      this.logger.debug('CSRF validation failed: invalid token format');
      return false;
    }

    const [randomToken, signature] = parts;

    // Verify signature
    const expectedSignature = this.createSignature(randomToken, sessionId);
    if (signature !== expectedSignature) {
      this.logger.debug('CSRF validation failed: signature mismatch');
      return false;
    }

    // Check if token exists in Redis (session binding)
    const redisKey = `${this.redisKeyPrefix}${sessionId}`;
    const storedToken = await this.redisService.get(redisKey);

    if (!storedToken) {
      this.logger.debug('CSRF validation failed: token not found in Redis');
      return false;
    }

    // Verify token matches stored token
    if (storedToken !== token) {
      this.logger.debug('CSRF validation failed: token mismatch');
      return false;
    }

    this.logger.debug(`CSRF token validated successfully for session ${sessionId}`);
    return true;
  }

  /**
   * Store CSRF token in session (for double-submit cookie pattern)
   * 
   * @param sessionId - Session ID
   * @param token - CSRF token to store
   */
  async storeTokenInSession(sessionId: string, token: string): Promise<void> {
    const redisKey = `${this.redisKeyPrefix}${sessionId}`;
    await this.redisService.set(redisKey, token, this.tokenTTL);
  }

  /**
   * Get CSRF token for session
   * 
   * @param sessionId - Session ID
   * @returns CSRF token if exists, null otherwise
   */
  async getTokenForSession(sessionId: string): Promise<string | null> {
    const redisKey = `${this.redisKeyPrefix}${sessionId}`;
    return await this.redisService.get(redisKey);
  }

  /**
   * Invalidate CSRF token for session
   * 
   * @param sessionId - Session ID
   */
  async invalidateToken(sessionId: string): Promise<void> {
    const redisKey = `${this.redisKeyPrefix}${sessionId}`;
    await this.redisService.del(redisKey);
    this.logger.debug(`CSRF token invalidated for session ${sessionId}`);
  }

  /**
   * Rotate CSRF token (generate new token and invalidate old one)
   * 
   * @param sessionId - Session ID
   * @returns New CSRF token
   */
  async rotateToken(sessionId: string): Promise<string> {
    await this.invalidateToken(sessionId);
    return await this.generateToken(sessionId);
  }

  /**
   * Create HMAC signature for token
   * 
   * @private
   * @param token - Random token
   * @param sessionId - Session ID
   * @returns HMAC signature
   */
  private createSignature(token: string, sessionId: string): string {
    const hmac = createHmac('sha256', this.secret);
    hmac.update(token);
    hmac.update(sessionId);
    return hmac.digest('hex');
  }
}
