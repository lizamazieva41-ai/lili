import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SessionManagementService } from '../../../src/auth/session-management.service';
import { RedisService } from '../../../src/config/redis.service';
import { PrismaService } from '../../../src/config/prisma.service';

describe('SessionManagementService', () => {
  let service: SessionManagementService;
  let mockRedisService: any;
  let mockPrismaService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockPrismaService = {
      userSession: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
      sessionActivity: {
        create: jest.fn(),
      },
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionManagementService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SessionManagementService>(SessionManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create session and store in Redis', async () => {
      const userId = 'user-1';
      const token = 'access-token';
      const refreshToken = 'refresh-token';

      jest.spyOn(service as any, 'enforceSessionLimit').mockResolvedValue(undefined);

      const dbSession = {
        id: 'session-123',
        userId,
        token,
        refreshToken,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        isActive: true,
        expiresAt: new Date(Date.now() + 3600_000),
        createdAt: new Date(),
      };

      mockPrismaService.userSession.create.mockResolvedValue(dbSession);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.createSession(userId, token, refreshToken, {
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });

      expect(mockPrismaService.userSession.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: expect.any(String),
          userId,
          token,
          refreshToken,
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
          isActive: true,
          expiresAt: expect.any(Date),
        }),
      });

      expect(mockRedisService.set).toHaveBeenCalled();

      expect(result).toEqual(
        expect.objectContaining({
          sessionId: dbSession.id,
          userId,
          token,
          refreshToken,
          isActive: true,
        }),
      );
    });
  });
});
