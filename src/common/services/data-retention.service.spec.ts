import { Test, TestingModule } from '@nestjs/testing';
import { DataRetentionService } from './data-retention.service';
import { PrismaService } from '../../config/prisma.service';

describe('DataRetentionService', () => {
  let service: DataRetentionService;
  let prisma: {
    messageLog: { deleteMany: jest.Mock; count: jest.Mock };
    authAuditLog: { deleteMany: jest.Mock; count: jest.Mock };
    usageLog: { deleteMany: jest.Mock; count: jest.Mock };
    jobExecution: { deleteMany: jest.Mock; count: jest.Mock };
    licenseMetrics: { deleteMany: jest.Mock; count: jest.Mock };
    jobMetric: { deleteMany: jest.Mock; count: jest.Mock };
    proxyMetric: { deleteMany: jest.Mock; count: jest.Mock };
    securityAlert: { deleteMany: jest.Mock };
    $executeRaw: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      messageLog: { deleteMany: jest.fn(), count: jest.fn() },
      authAuditLog: { deleteMany: jest.fn(), count: jest.fn() },
      usageLog: { deleteMany: jest.fn(), count: jest.fn() },
      jobExecution: { deleteMany: jest.fn(), count: jest.fn() },
      licenseMetrics: { deleteMany: jest.fn(), count: jest.fn() },
      jobMetric: { deleteMany: jest.fn(), count: jest.fn() },
      proxyMetric: { deleteMany: jest.fn(), count: jest.fn() },
      securityAlert: { deleteMany: jest.fn() },
      $executeRaw: jest.fn(),
    };

    prisma.messageLog.deleteMany.mockResolvedValue({ count: 1 });
    prisma.authAuditLog.deleteMany.mockResolvedValue({ count: 2 });
    prisma.usageLog.deleteMany.mockResolvedValue({ count: 3 });
    prisma.jobExecution.deleteMany.mockResolvedValue({ count: 4 });
    prisma.licenseMetrics.deleteMany.mockResolvedValue({ count: 5 });
    prisma.jobMetric.deleteMany.mockResolvedValue({ count: 6 });
    prisma.proxyMetric.deleteMany.mockResolvedValue({ count: 7 });
    prisma.securityAlert.deleteMany.mockResolvedValue({ count: 8 });

    prisma.messageLog.count.mockResolvedValue(10);
    prisma.authAuditLog.count.mockResolvedValue(20);
    prisma.usageLog.count.mockResolvedValue(30);
    prisma.jobExecution.count.mockResolvedValue(40);
    prisma.licenseMetrics.count.mockResolvedValue(1);
    prisma.jobMetric.count.mockResolvedValue(2);
    prisma.proxyMetric.count.mockResolvedValue(3);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataRetentionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(DataRetentionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cleanupExpiredData', () => {
    it('should run cleanup tasks and not throw', async () => {
      await expect(service.cleanupExpiredData()).resolves.toBeUndefined();

      expect(prisma.messageLog.deleteMany).toHaveBeenCalled();
      expect(prisma.authAuditLog.deleteMany).toHaveBeenCalled();
      expect(prisma.usageLog.deleteMany).toHaveBeenCalled();
      expect(prisma.jobExecution.deleteMany).toHaveBeenCalled();
      expect(prisma.licenseMetrics.deleteMany).toHaveBeenCalled();
      expect(prisma.jobMetric.deleteMany).toHaveBeenCalled();
      expect(prisma.proxyMetric.deleteMany).toHaveBeenCalled();
      expect(prisma.$executeRaw).toHaveBeenCalled();
      expect(prisma.securityAlert.deleteMany).toHaveBeenCalled();
    });

    it('should handle failures in individual tasks (Promise.allSettled)', async () => {
      prisma.messageLog.deleteMany.mockRejectedValueOnce(new Error('boom'));
      await expect(service.cleanupExpiredData()).resolves.toBeUndefined();
    });
  });

  describe('manualCleanup', () => {
    it('should call cleanupExpiredData', async () => {
      const spy = jest.spyOn(service, 'cleanupExpiredData').mockResolvedValue(undefined as any);
      await service.manualCleanup();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getRetentionStats', () => {
    it('should return counts and policies', async () => {
      const stats = await service.getRetentionStats();

      expect(stats).toHaveProperty('currentCounts');
      expect(stats.currentCounts).toMatchObject({
        debugLogs: 10,
        errorLogs: 10,
        authAuditLogs: 20,
        usageLogs: 30,
        jobExecutions: 40,
      });
      expect(stats).toHaveProperty('retentionPolicies');
      expect(stats).toHaveProperty('lastCleanup');
    });
  });
});

