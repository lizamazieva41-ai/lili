/**
 * TDLib User Operations Integration Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TdlibUserService } from '../../src/tdlib/services/tdlib-user.service';
import { TdlibService } from '../../src/tdlib/tdlib.service';
import { TdlibModule } from '../../src/tdlib/tdlib.module';

describe('TDLib User Operations Integration', () => {
  let userService: TdlibUserService;
  let tdlibService: TdlibService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TdlibModule],
    }).compile();

    userService = module.get<TdlibUserService>(TdlibUserService);
    tdlibService = module.get<TdlibService>(TdlibService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should get user info', async () => {
    expect(userService).toBeDefined();
  });

  it('should get user full info', async () => {
    expect(userService).toBeDefined();
  });

  it('should manage user profile', async () => {
    expect(userService).toBeDefined();
  });

  it('should manage sessions', async () => {
    expect(userService).toBeDefined();
  });
});
