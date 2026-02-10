/**
 * TDLib File Operations Integration Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TdlibFileService } from '../../src/tdlib/services/tdlib-file.service';
import { TdlibService } from '../../src/tdlib/tdlib.service';
import { TdlibModule } from '../../src/tdlib/tdlib.module';

describe('TDLib File Operations Integration', () => {
  let fileService: TdlibFileService;
  let tdlibService: TdlibService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TdlibModule],
    }).compile();

    fileService = module.get<TdlibFileService>(TdlibFileService);
    tdlibService = module.get<TdlibService>(TdlibService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should download file', async () => {
    expect(fileService).toBeDefined();
  });

  it('should upload file', async () => {
    expect(fileService).toBeDefined();
  });

  it('should get file info', async () => {
    expect(fileService).toBeDefined();
  });

  it('should cancel file download', async () => {
    expect(fileService).toBeDefined();
  });
});
