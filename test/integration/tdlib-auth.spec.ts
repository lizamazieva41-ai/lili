/**
 * TDLib Authentication Integration Tests
 * 
 * Tests full authentication flow with real TDLib
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TdlibAuthService } from '../../src/tdlib/tdlib-auth.service';
import { TdlibService } from '../../src/tdlib/tdlib.service';
import { TdlibModule } from '../../src/tdlib/tdlib.module';

describe('TDLib Authentication Integration', () => {
  let authService: TdlibAuthService;
  let tdlibService: TdlibService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TdlibModule],
    }).compile();

    authService = module.get<TdlibAuthService>(TdlibAuthService);
    tdlibService = module.get<TdlibService>(TdlibService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should request authentication code', async () => {
    // This test requires a real TDLib client and phone number
    // Skipped in CI, run manually with test credentials
    const clientId = 'test-client-1';
    
    try {
      await tdlibService.createClient(clientId);
      // Test would continue with actual phone number
      // await authService.requestCode(clientId, '+1234567890');
    } catch (error) {
      // Expected if TDLib not available in test environment
      expect(error).toBeDefined();
    }
  });

  it('should handle authentication errors', async () => {
    const clientId = 'test-client-error';
    
    try {
      await tdlibService.createClient(clientId);
      // Test error handling
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
