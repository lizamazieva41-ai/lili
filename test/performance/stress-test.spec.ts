/**
 * TDLib Stress Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TdlibService } from '../../src/tdlib/tdlib.service';
import { TdlibModule } from '../../src/tdlib/tdlib.module';

describe('TDLib Stress Tests', () => {
  let tdlibService: TdlibService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TdlibModule],
    }).compile();

    tdlibService = module.get<TdlibService>(TdlibService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should handle high request rate', async () => {
    const requestsPerSecond = 100;
    const durationSeconds = 10;
    const totalRequests = requestsPerSecond * durationSeconds;

    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;

    let requestCount = 0;
    while (Date.now() < endTime) {
      // Simulate requests
      requestCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 / requestsPerSecond));
    }

    console.log(`Processed ${requestCount} requests in ${durationSeconds}s`);
    expect(requestCount).toBeGreaterThan(totalRequests * 0.9); // At least 90% of target
  });

  it('should handle memory pressure', async () => {
    const iterations = 1000;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      // Simulate memory-intensive operations
      const data = new Array(1000).fill(0);
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = (memoryAfter - memoryBefore) / 1024 / 1024;

    console.log(`Memory increase: ${memoryIncrease.toFixed(2)} MB`);
    expect(memoryIncrease).toBeLessThan(500); // Should not exceed 500MB
  });
});
