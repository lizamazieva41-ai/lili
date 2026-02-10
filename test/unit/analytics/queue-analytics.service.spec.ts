import { Test, TestingModule } from '@nestjs/testing';
import { QueueAnalyticsService } from '../../../src/analytics/queue-analytics.service';
import { PrismaService } from '../../../src/config/prisma.service';

describe('QueueAnalyticsService', () => {
  let service: QueueAnalyticsService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ ok: true }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueAnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(QueueAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getQueueStats should query view', async () => {
    const result = await service.getQueueStats();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getJobFailureAnalysis should query view', async () => {
    const result = await service.getJobFailureAnalysis();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getQueuePerformance should query aggregation', async () => {
    const result = await service.getQueuePerformance();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getJobTypePerformance should query aggregation', async () => {
    const result = await service.getJobTypePerformance();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('getQueueCongestionPrediction should query aggregation', async () => {
    const result = await service.getQueueCongestionPrediction();
    expect(result).toEqual([{ ok: true }]);
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });
});

