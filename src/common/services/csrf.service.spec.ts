import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CsrfService } from './csrf.service';
import { RedisService } from '../../config/redis.service';

describe('CsrfService', () => {
  let service: CsrfService;
  let mockRedisService: jest.Mocked<RedisService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockRedisService = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(1),
    } as any;

    mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret-key'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsrfService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CsrfService>(CsrfService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid CSRF token', async () => {
      const sessionId = 'test-session-id';
      const token = await service.generateToken(sessionId);

      expect(token).toBeDefined();
      expect(token).toContain('.');
      expect(token.split('.')).toHaveLength(2);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `csrf:token:${sessionId}`,
        token,
        3600,
      );
    });

    it('should generate different tokens for different sessions', async () => {
      const token1 = await service.generateToken('session-1');
      const token2 = await service.generateToken('session-2');

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens on each call', async () => {
      const sessionId = 'test-session-id';
      const token1 = await service.generateToken(sessionId);
      const token2 = await service.generateToken(sessionId);

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    it('should validate a correct token', async () => {
      const sessionId = 'test-session-id';
      const token = await service.generateToken(sessionId);
      
      // Mock Redis to return the stored token
      mockRedisService.get.mockResolvedValue(token);

      const isValid = await service.validateToken(token, sessionId);

      expect(isValid).toBe(true);
      expect(mockRedisService.get).toHaveBeenCalledWith(`csrf:token:${sessionId}`);
    });

    it('should reject invalid token format', async () => {
      const isValid = await service.validateToken('invalid-token', 'session-id');

      expect(isValid).toBe(false);
    });

    it('should reject token with invalid signature', async () => {
      const sessionId = 'test-session-id';
      const token = await service.generateToken(sessionId);
      const invalidToken = token.split('.')[0] + '.invalid-signature';

      mockRedisService.get.mockResolvedValue(token);

      const isValid = await service.validateToken(invalidToken, sessionId);

      expect(isValid).toBe(false);
    });

    it('should reject token not found in Redis', async () => {
      const sessionId = 'test-session-id';
      const token = await service.generateToken(sessionId);

      mockRedisService.get.mockResolvedValue(null);

      const isValid = await service.validateToken(token, sessionId);

      expect(isValid).toBe(false);
    });

    it('should reject token for different session', async () => {
      const sessionId1 = 'session-1';
      const sessionId2 = 'session-2';
      const token = await service.generateToken(sessionId1);

      mockRedisService.get.mockResolvedValue(token);

      const isValid = await service.validateToken(token, sessionId2);

      expect(isValid).toBe(false);
    });

    it('should reject empty token', async () => {
      const isValid = await service.validateToken('', 'session-id');

      expect(isValid).toBe(false);
    });

    it('should reject empty sessionId', async () => {
      const token = await service.generateToken('session-id');
      const isValid = await service.validateToken(token, '');

      expect(isValid).toBe(false);
    });
  });

  describe('storeTokenInSession', () => {
    it('should store token in Redis', async () => {
      const sessionId = 'test-session-id';
      const token = 'test-token';

      await service.storeTokenInSession(sessionId, token);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `csrf:token:${sessionId}`,
        token,
        3600,
      );
    });
  });

  describe('getTokenForSession', () => {
    it('should retrieve token from Redis', async () => {
      const sessionId = 'test-session-id';
      const token = 'test-token';

      mockRedisService.get.mockResolvedValue(token);

      const result = await service.getTokenForSession(sessionId);

      expect(result).toBe(token);
      expect(mockRedisService.get).toHaveBeenCalledWith(`csrf:token:${sessionId}`);
    });

    it('should return null if token not found', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const result = await service.getTokenForSession('non-existent-session');

      expect(result).toBeNull();
    });
  });

  describe('invalidateToken', () => {
    it('should delete token from Redis', async () => {
      const sessionId = 'test-session-id';

      await service.invalidateToken(sessionId);

      expect(mockRedisService.del).toHaveBeenCalledWith(`csrf:token:${sessionId}`);
    });
  });

  describe('rotateToken', () => {
    it('should generate new token and invalidate old one', async () => {
      const sessionId = 'test-session-id';
      const oldToken = await service.generateToken(sessionId);

      mockRedisService.get.mockResolvedValue(oldToken);

      const newToken = await service.rotateToken(sessionId);

      expect(newToken).toBeDefined();
      expect(newToken).not.toBe(oldToken);
      expect(mockRedisService.del).toHaveBeenCalledWith(`csrf:token:${sessionId}`);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `csrf:token:${sessionId}`,
        newToken,
        3600,
      );
    });
  });
});
