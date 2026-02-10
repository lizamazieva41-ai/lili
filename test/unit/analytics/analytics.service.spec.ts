import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../../../src/analytics/analytics.service';
import { PrismaService } from '../../../src/config/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: {
    user: { count: jest.Mock };
    license: { count: jest.Mock };
    campaign: { count: jest.Mock };
    message: { count: jest.Mock };
    job: { count: jest.Mock };
    usageLog: { count: jest.Mock };
    authAuditLog: { count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { count: jest.fn().mockResolvedValue(1) },
      license: { count: jest.fn().mockResolvedValue(2) },
      campaign: { count: jest.fn().mockResolvedValue(3) },
      message: { count: jest.fn().mockResolvedValue(4) },
      job: { count: jest.fn().mockResolvedValue(5) },
      usageLog: { count: jest.fn().mockResolvedValue(6) },
      authAuditLog: { count: jest.fn().mockResolvedValue(7) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardOverview', () => {
    it('should return overview counts', async () => {
      const result = await service.getDashboardOverview();

      expect(result).toMatchObject({
        totalUsers: 1,
        totalLicenses: 2,
        totalCampaigns: 3,
        totalMessages: 4,
        activeJobs: 5,
      });
      expect(typeof result.timestamp).toBe('string');
      expect(prisma.job.count).toHaveBeenCalledWith({ where: { status: 'RUNNING' } });
    });
  });

  describe('getSystemHealth', () => {
    it('should return HEALTHY when errors <= 10', async () => {
      prisma.authAuditLog.count.mockResolvedValueOnce(10);

      const result = await service.getSystemHealth();

      expect(result.health).toBe('HEALTHY');
      expect(result).toHaveProperty('requestsLastHour');
      expect(result).toHaveProperty('errorsLastHour');
      expect(result).toHaveProperty('failedJobsLastHour');
    });

    it('should return WARNING when errors > 10', async () => {
      prisma.authAuditLog.count.mockResolvedValueOnce(11);

      const result = await service.getSystemHealth();

      expect(result.health).toBe('WARNING');
    });
  });
});

