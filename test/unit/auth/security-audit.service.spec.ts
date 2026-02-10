import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAuditService } from '../../../src/auth/security-audit.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../src/config/prisma.service';
import { RedisService } from '../../../src/config/redis.service';
import { IpUtils } from '../../../src/auth/utils/ip-utils';
import { UserAgentParser } from '../../../src/auth/utils/user-agent-parser';
import type { SecurityEvent } from '../../../src/auth/security-audit.service';

describe('SecurityAuditService', () => {
  let service: SecurityAuditService;
  let mockConfigService: any;
  let mockPrismaService: any;
  let mockRedisService: any;
  let mockIpUtils: any;
  let mockUserAgentParser: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockPrismaService = {
      authAuditLog: {
        create: jest.fn(),
      },
    };

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockIpUtils = {
      getIpInfo: jest.fn(),
      calculateRiskScore: jest.fn(),
      getIpCountry: jest.fn(),
    };

    mockUserAgentParser = {
      parse: jest.fn(),
      isSuspicious: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityAuditService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<SecurityAuditService>(SecurityAuditService);

    // Mock static methods
    jest.spyOn(IpUtils, 'getIpInfo').mockImplementation(mockIpUtils.getIpInfo);
    jest.spyOn(IpUtils, 'calculateRiskScore').mockImplementation(mockIpUtils.calculateRiskScore);
    jest.spyOn(IpUtils, 'getIpCountry').mockImplementation(mockIpUtils.getIpCountry);
    jest.spyOn(UserAgentParser, 'parse').mockImplementation(mockUserAgentParser.parse);
    jest.spyOn(UserAgentParser, 'isSuspicious').mockImplementation(mockUserAgentParser.isSuspicious);

    // Safe defaults for tests that don't explicitly stub these
    mockIpUtils.getIpInfo.mockResolvedValue({ country: 'US' });
    mockIpUtils.calculateRiskScore.mockReturnValue({ score: 0, risk: 'LOW', reasons: [] });
    mockUserAgentParser.parse.mockReturnValue({ browser: 'Test', os: 'Test' });
    mockUserAgentParser.isSuspicious.mockReturnValue(false);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logAuthEvent', () => {
    it('should log authentication event', async () => {
      const mockEvent: SecurityEvent = {
        userId: 'user-1',
        event: 'LOGIN_SUCCESS',
        severity: 'LOW',
        details: { ipAddress: '127.0.0.1' },
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        sessionId: 'session-123',
        timestamp: new Date(),
      };

      mockPrismaService.authAuditLog.create.mockResolvedValue({});
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      await service.logAuthEvent(mockEvent);

      expect(mockPrismaService.authAuditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          event: 'LOGIN_SUCCESS',
          metadata: {
            severity: 'LOW',
            details: { ipAddress: '127.0.0.1' },
            sessionId: 'session-123',
          },
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
      });

      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should handle high severity events', async () => {
      const mockEvent: SecurityEvent = {
        userId: 'user-1',
        event: 'BRUTE_FORCE_DETECTED',
        severity: 'HIGH',
        details: { attempts: 10 },
        ipAddress: '127.0.0.1',
        timestamp: new Date(),
      };

      mockPrismaService.authAuditLog.create.mockResolvedValue({});
      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      await service.logAuthEvent(mockEvent);

      expect(mockPrismaService.authAuditLog.create).toHaveBeenCalled();
    });
  });

  describe('analyzeLoginPattern', () => {
    it('should analyze login pattern and return risk assessment', async () => {
      const mockIpInfo = { country: 'US', city: 'New York' };
      const mockParsedUA = { browser: 'Chrome', os: 'Windows' };
      const mockRiskScore = { score: 30, risk: 'LOW', reasons: [] };

      mockIpUtils.getIpInfo.mockResolvedValue(mockIpInfo);
      mockUserAgentParser.parse.mockReturnValue(mockParsedUA);
      mockIpUtils.calculateRiskScore.mockReturnValue(mockRiskScore);
      mockUserAgentParser.isSuspicious.mockReturnValue(false);
      mockRedisService.get.mockResolvedValue(JSON.stringify([]));

      const result = await service.analyzeLoginPattern('user-1', '127.0.0.1', 'test-agent', 'session-123');

      expect(result).toHaveProperty('risk');
      expect(result).toHaveProperty('alerts');
      expect(Array.isArray(result.alerts)).toBe(true);
    });

    it('should detect suspicious IP', async () => {
      const mockIpInfo = { country: 'RU', city: 'Moscow' };
      const mockRiskScore = { score: 80, risk: 'HIGH', reasons: ['High risk country'] };

      mockIpUtils.getIpInfo.mockResolvedValue(mockIpInfo);
      mockIpUtils.calculateRiskScore.mockReturnValue(mockRiskScore);
      mockRedisService.get.mockResolvedValue(JSON.stringify([]));

      const result = await service.analyzeLoginPattern('user-1', '192.168.1.1', 'test-agent', 'session-123');

      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].type).toBe('SUSPICIOUS_IP');
      expect(result.risk).toBe('HIGH');
    });

    it('should detect suspicious user agent', async () => {
      const mockParsedUA = { browser: 'Unknown', os: 'Unknown' };

      mockUserAgentParser.parse.mockReturnValue(mockParsedUA);
      mockUserAgentParser.isSuspicious.mockReturnValue(true);
      mockRedisService.get.mockResolvedValue(JSON.stringify([]));

      const result = await service.analyzeLoginPattern('user-1', '127.0.0.1', 'suspicious-agent', 'session-123');

      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].type).toBe('SUSPICIOUS_USER_AGENT');
    });

    it('should detect rapid location change', async () => {
      const mockPreviousEvents = [
        {
          userId: 'user-1',
          event: 'LOGIN_SUCCESS',
          ipAddress: '192.168.1.1',
          timestamp: new Date(),
        },
      ];

      mockIpUtils.getIpCountry.mockResolvedValueOnce('US').mockResolvedValueOnce('RU');
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockPreviousEvents));

      const result = await service.analyzeLoginPattern('user-1', '192.168.1.2', 'test-agent', 'session-123');

      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].type).toBe('RAPID_LOCATION_CHANGE');
    });
  });

  describe('detectFailedLoginAttempts', () => {
    it('should detect brute force attempts', async () => {
      mockRedisService.get.mockResolvedValue('6');

      const result = await service.detectFailedLoginAttempts('user-1', '127.0.0.1');

      expect(result.isBruteForce).toBe(true);
      expect(result.attempts).toBe(6);
      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].type).toBe('BRUTE_FORCE_DETECTED');
    });

    it('should return false for normal attempts', async () => {
      mockRedisService.get.mockResolvedValue('2');

      const result = await service.detectFailedLoginAttempts('user-1', '127.0.0.1');

      expect(result.isBruteForce).toBe(false);
      expect(result.attempts).toBe(2);
      expect(result.alerts).toHaveLength(0);
    });
  });

  describe('incrementFailedAttempts', () => {
    it('should increment failed attempts counter', async () => {
      mockRedisService.get
        .mockResolvedValueOnce('2') // failed_attempts key
        .mockResolvedValueOnce(JSON.stringify([])); // auth_events key (inside logAuthEvent)
      mockRedisService.set.mockResolvedValue(undefined);
      mockPrismaService.authAuditLog.create.mockResolvedValue({});

      await service.incrementFailedAttempts('user-1', '127.0.0.1');

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'failed_attempts:user-1:127.0.0.1',
        '3',
        900,
      );

      expect(mockPrismaService.authAuditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          event: 'LOGIN_FAILED',
          metadata: {
            severity: 'MEDIUM',
            details: { attempts: 3, ipAddress: '127.0.0.1' },
            sessionId: undefined,
          },
          ipAddress: '127.0.0.1',
          userAgent: undefined,
        },
      });
    });

    it('should handle first failed attempt', async () => {
      mockRedisService.get
        .mockResolvedValueOnce(null) // failed_attempts key
        .mockResolvedValueOnce(JSON.stringify([])); // auth_events key (inside logAuthEvent)
      mockRedisService.set.mockResolvedValue(undefined);
      mockPrismaService.authAuditLog.create.mockResolvedValue({});

      await service.incrementFailedAttempts('user-1', '127.0.0.1');

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'failed_attempts:user-1:127.0.0.1',
        '1',
        900,
      );
    });
  });

  describe('resetFailedAttempts', () => {
    it('should reset failed attempts counter', async () => {
      mockRedisService.del.mockResolvedValue(1);

      await service.resetFailedAttempts('user-1', '127.0.0.1');

      expect(mockRedisService.del).toHaveBeenCalledWith('failed_attempts:user-1:127.0.0.1');
    });
  });

  describe('getRecentAuthEvents', () => {
    it('should return recent auth events', async () => {
      const mockEvents = [
        {
          userId: 'user-1',
          event: 'LOGIN_SUCCESS',
          severity: 'LOW',
          details: {},
          timestamp: new Date(),
        },
        {
          userId: 'user-1',
          event: 'LOGIN_FAILED',
          severity: 'MEDIUM',
          details: {},
          timestamp: new Date(),
        },
      ];

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockEvents));

      const result = await service.getRecentAuthEvents('user-1');

      // Service returns last events in reverse order and timestamps are serialized via JSON
      expect(result).toEqual([
        expect.objectContaining({ event: 'LOGIN_FAILED', severity: 'MEDIUM' }),
        expect.objectContaining({ event: 'LOGIN_SUCCESS', severity: 'LOW' }),
      ]);
    });

    it('should return empty array if no events found', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const result = await service.getRecentAuthEvents('user-1');

      expect(result).toHaveLength(0);
    });

    it('should filter by event type', async () => {
      const mockEvents = [
        { userId: 'user-1', event: 'LOGIN_SUCCESS', severity: 'LOW', details: {}, timestamp: new Date() },
        { userId: 'user-1', event: 'LOGIN_FAILED', severity: 'MEDIUM', details: {}, timestamp: new Date() },
      ];

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockEvents));

      const result = await service.getRecentAuthEvents('user-1', 'LOGIN_SUCCESS');

      expect(result).toHaveLength(1);
      expect(result[0].event).toBe('LOGIN_SUCCESS');
    });
  });

  describe('getSecurityAlerts', () => {
    it('should return security alerts', async () => {
      const mockAlerts = [
        {
          type: 'BRUTE_FORCE_DETECTED',
          userId: 'user-1',
          message: 'Multiple failed login attempts',
          severity: 'CRITICAL',
          metadata: { attempts: 10 },
          createdAt: new Date(),
        },
      ];

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockAlerts));

      const result = await service.getSecurityAlerts('user-1');

      expect(result).toEqual([
        expect.objectContaining({
          message: 'Multiple failed login attempts',
          severity: 'CRITICAL',
        }),
      ]);
    });

    it('should return empty array if no alerts found', async () => {
      mockRedisService.get.mockResolvedValue(null);

      const result = await service.getSecurityAlerts('user-1');

      expect(result).toHaveLength(0);
    });
  });

  describe('detectLocationChange', () => {
    it('should detect significant location change', async () => {
      mockIpUtils.getIpCountry.mockResolvedValueOnce('US').mockResolvedValueOnce('RU');

      const result = await service['detectLocationChange'](['192.168.1.1'], '192.168.1.2');

      expect(result.isSignificant).toBe(true);
      expect(result.from).toBe('US');
      expect(result.to).toBe('RU');
    });

    it('should return false for same country', async () => {
      mockIpUtils.getIpCountry.mockResolvedValue('US');

      const result = await service['detectLocationChange'](['192.168.1.1'], '192.168.1.2');

      expect(result.isSignificant).toBe(false);
    });

    it('should return false for no previous IPs', async () => {
      const result = await service['detectLocationChange']([], '192.168.1.1');

      expect(result.isSignificant).toBe(false);
    });
  });

  describe('getConcurrentSessionLocations', () => {
    it('should return empty array (not implemented)', async () => {
      const result = await service['getConcurrentSessionLocations']('user-1', 'session-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('createSecurityAlert', () => {
    it('should create security alert', async () => {
      const mockAlert = {
        type: 'BRUTE_FORCE_DETECTED',
        userId: 'user-1',
        message: 'Multiple failed login attempts',
        severity: 'CRITICAL' as const,
        metadata: { attempts: 10 },
        createdAt: new Date(),
      };

      mockRedisService.get.mockResolvedValue(null);
      mockRedisService.set.mockResolvedValue(undefined);

      await service['createSecurityAlert'](mockAlert);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'security_alerts:user-1',
        JSON.stringify([mockAlert]),
        86400,
      );
    });

    it('should handle existing alerts', async () => {
      const existingAlerts = [
        { type: 'OLD_ALERT', userId: 'user-1', message: 'Old alert', severity: 'MEDIUM', metadata: {}, createdAt: new Date() },
      ];

      const newAlert = {
        type: 'NEW_ALERT',
        userId: 'user-1',
        message: 'New alert',
        severity: 'HIGH' as const,
        metadata: {},
        createdAt: new Date(),
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(existingAlerts));
      mockRedisService.set.mockResolvedValue(undefined);

      await service['createSecurityAlert'](newAlert);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'security_alerts:user-1',
        expect.any(String),
        86400,
      );
    });
  });

  describe('analyzeSecurityPattern', () => {
    it('should analyze security patterns and create alerts', async () => {
      const mockEvents: SecurityEvent[] = [
        { userId: 'user-1', event: 'LOGIN_FAILED', severity: 'HIGH', details: {}, timestamp: new Date() },
        { userId: 'user-1', event: 'LOGIN_FAILED', severity: 'HIGH', details: {}, timestamp: new Date() },
        { userId: 'user-1', event: 'LOGIN_FAILED', severity: 'HIGH', details: {}, timestamp: new Date() },
      ];

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockEvents));

      await service['analyzeSecurityPattern']('user-1', mockEvents);

      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should not create alerts for low severity events', async () => {
      const mockEvents: SecurityEvent[] = [
        { userId: 'user-1', event: 'LOGIN_SUCCESS', severity: 'LOW', details: {}, timestamp: new Date() },
      ];

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockEvents));

      await service['analyzeSecurityPattern']('user-1', mockEvents);

      expect(mockRedisService.set).not.toHaveBeenCalled();
    });
  });
});