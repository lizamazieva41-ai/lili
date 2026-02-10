import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAnalyticsService } from '../../../src/analytics/security-analytics.service';
import { PrismaService } from '../../../src/config/prisma.service';

describe('SecurityAnalyticsService', () => {
  let service: SecurityAnalyticsService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ ok: true }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityAnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SecurityAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAuthFailures should query view', async () => {
    const result = await service.getAuthFailures();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getSecurityEvents should query view', async () => {
    const result = await service.getSecurityEvents();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getSecurityOverview should query summary', async () => {
    const result = await service.getSecurityOverview();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getTopFailingIPs should accept limit param', async () => {
    const result = await service.getTopFailingIPs(3);
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getSecurityAnomalyScore should query anomalies', async () => {
    const result = await service.getSecurityAnomalyScore();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getRecentSecurityAlerts should query recent alerts', async () => {
    const result = await service.getRecentSecurityAlerts();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });
});

