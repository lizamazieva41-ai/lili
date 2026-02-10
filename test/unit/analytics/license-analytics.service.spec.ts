import { Test, TestingModule } from '@nestjs/testing';
import { LicenseAnalyticsService } from '../../../src/analytics/license-analytics.service';
import { PrismaService } from '../../../src/config/prisma.service';

describe('LicenseAnalyticsService', () => {
  let service: LicenseAnalyticsService;
  let prisma: { $queryRawUnsafe: jest.Mock; $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRawUnsafe: jest.fn().mockResolvedValue([{ ok: true }]),
      $queryRaw: jest.fn().mockResolvedValue([{ ok: true }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LicenseAnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(LicenseAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getDailyUsage without userId should query global view', async () => {
    const result = await service.getDailyUsage();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
  });

  it('getDailyUsage with userId should pass param', async () => {
    const result = await service.getDailyUsage('user-1');
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
  });

  it('getPlanAggregation should query view', async () => {
    const result = await service.getPlanAggregation();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getUsageForecast should accept licenseId param', async () => {
    const result = await service.getUsageForecast('lic-1');
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getTopUsageLicenses should accept limit param', async () => {
    const result = await service.getTopUsageLicenses(5);
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });
});

