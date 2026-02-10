import { Test, TestingModule } from '@nestjs/testing';
import { MessageProcessor } from '../../../src/jobs/message.processor';
import { QueueService } from '../../../src/config/queue.service';
import { TdlibService } from '../../../src/tdlib/tdlib.service';
import { TdlibSessionStore } from '../../../src/tdlib/tdlib-session.store';
import { PrismaService } from '../../../src/config/prisma.service';
import { CustomLoggerService } from '../../../src/common/services/logger.service';
import { MessageStatus } from '@prisma/client';

describe('MessageProcessor', () => {
  let processor: MessageProcessor;
  let mockQueueService: any;
  let mockTdlibService: any;
  let mockSessionStore: any;
  let mockPrismaService: any;
  let mockLogger: any;

  beforeEach(async () => {
    mockQueueService = {
      createWorker: jest.fn(),
      addJob: jest.fn(),
    };

    mockTdlibService = {
      sendMessage: jest.fn(),
      receive: jest.fn(),
    };

    mockSessionStore = {
      getSessionsByAccountId: jest.fn(),
    };

    mockPrismaService = {
      message: {
        findMany: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageProcessor,
        { provide: QueueService, useValue: mockQueueService },
        { provide: TdlibService, useValue: mockTdlibService },
        { provide: TdlibSessionStore, useValue: mockSessionStore },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    processor = module.get<MessageProcessor>(MessageProcessor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create worker for messages queue', () => {
      processor.onModuleInit();

      expect(mockQueueService.createWorker).toHaveBeenCalledWith(
        'messages',
        expect.any(Function),
        expect.objectContaining({
          concurrency: 10,
          limiter: expect.any(Object),
        }),
      );
    });
  });

  describe('message processing', () => {
    let processJob: any;

    beforeEach(() => {
      mockQueueService.createWorker.mockImplementation((queue, handler) => {
        processJob = handler;
      });
      processor.onModuleInit();
    });

    it('should process message send job successfully', async () => {
      const jobData = {
        messageId: 'msg-123',
        accountId: 'account-456',
        recipient: '123456789',
        content: 'Test message',
        metadata: {},
      };

      const session = {
        clientId: 'client-789',
        accountId: 'account-456',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSessionStore.getSessionsByAccountId.mockResolvedValue([session]);
      mockTdlibService.sendMessage.mockResolvedValue(undefined);
      mockTdlibService.receive.mockReturnValue({
        '@type': 'message',
        id: 100,
        date: Math.floor(Date.now() / 1000),
      });
      mockPrismaService.message.findUnique.mockResolvedValue({
        id: 'msg-123',
        metadata: {},
      });

      const result = await processJob({
        name: 'MESSAGE_SEND',
        data: jobData,
        attemptsMade: 0,
      });

      expect(mockTdlibService.sendMessage).toHaveBeenCalled();
      expect(mockPrismaService.message.update).toHaveBeenCalled();
      expect(result.status).toBe('sent');
    });

    it('should update message status to SENDING', async () => {
      const jobData = {
        messageId: 'msg-123',
        accountId: 'account-456',
        recipient: '123456789',
        content: 'Test',
      };

      const session = {
        clientId: 'client-789',
        accountId: 'account-456',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSessionStore.getSessionsByAccountId.mockResolvedValue([session]);
      mockTdlibService.sendMessage.mockResolvedValue(undefined);
      mockTdlibService.receive.mockReturnValue({
        '@type': 'message',
        id: 100,
      });

      await processJob({
        name: 'MESSAGE_SEND',
        data: jobData,
        attemptsMade: 0,
      });

      expect(mockPrismaService.message.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'msg-123' },
          data: expect.objectContaining({
            status: MessageStatus.SENDING,
          }),
        }),
      );
    });

    it('should throw error when no active session found', async () => {
      const jobData = {
        messageId: 'msg-123',
        accountId: 'account-456',
        recipient: '123456789',
        content: 'Test',
      };

      mockSessionStore.getSessionsByAccountId.mockResolvedValue([]);

      await expect(
        processJob({
          name: 'MESSAGE_SEND',
          data: jobData,
          attemptsMade: 0,
        }),
      ).rejects.toThrow('No active session found');
    });

    it('should handle TDLib errors', async () => {
      const jobData = {
        messageId: 'msg-123',
        accountId: 'account-456',
        recipient: '123456789',
        content: 'Test',
      };

      const session = {
        clientId: 'client-789',
        accountId: 'account-456',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSessionStore.getSessionsByAccountId.mockResolvedValue([session]);
      mockTdlibService.sendMessage.mockResolvedValue(undefined);
      mockTdlibService.receive.mockReturnValue({
        '@type': 'error',
        code: 400,
        message: 'Bad request',
      });
      mockPrismaService.message.findUnique.mockResolvedValue({
        id: 'msg-123',
        metadata: {},
      });

      const result = await processJob({
        name: 'MESSAGE_SEND',
        data: jobData,
        attemptsMade: 0,
      });

      expect(result.status).toBe('failed');
      expect(mockPrismaService.message.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: MessageStatus.FAILED,
          }),
        }),
      );
    });

    it('should ignore non-MESSAGE_SEND jobs', async () => {
      const result = await processJob({
        name: 'OTHER_JOB',
        data: {},
        attemptsMade: 0,
      });

      expect(result).toBeUndefined();
      expect(mockTdlibService.sendMessage).not.toHaveBeenCalled();
    });
  });
});
