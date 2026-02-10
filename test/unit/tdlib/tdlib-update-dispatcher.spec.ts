import { Test, TestingModule } from '@nestjs/testing';
import { TdlibUpdateDispatcher } from '../../../src/tdlib/tdlib-update-dispatcher.service';
import { TdlibSessionStore } from '../../../src/tdlib/tdlib-session.store';
import { CustomLoggerService } from '../../../src/common/services/logger.service';
import { TdlibMessageUpdateHandler } from '../../../src/tdlib/handlers/tdlib-message-update.handler';
import { TdlibAccountUpdateHandler } from '../../../src/tdlib/handlers/tdlib-account-update.handler';
import { TdlibChatUpdateHandler } from '../../../src/tdlib/handlers/tdlib-chat-update.handler';

describe('TdlibUpdateDispatcher', () => {
  let service: TdlibUpdateDispatcher;
  let mockSessionStore: any;
  let mockLogger: any;
  let mockMessageHandler: any;
  let mockAccountHandler: any;
  let mockChatHandler: any;

  beforeEach(async () => {
    mockSessionStore = {
      getSession: jest.fn(),
      saveSession: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockMessageHandler = {
      handle: jest.fn(),
    };

    mockAccountHandler = {
      handle: jest.fn(),
    };

    mockChatHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TdlibUpdateDispatcher,
        { provide: TdlibSessionStore, useValue: mockSessionStore },
        { provide: CustomLoggerService, useValue: mockLogger },
        { provide: TdlibMessageUpdateHandler, useValue: mockMessageHandler },
        { provide: TdlibAccountUpdateHandler, useValue: mockAccountHandler },
        { provide: TdlibChatUpdateHandler, useValue: mockChatHandler },
      ],
    }).compile();

    service = module.get<TdlibUpdateDispatcher>(TdlibUpdateDispatcher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dispatch', () => {
    it('should route message updates to message handler', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateNewMessage',
        message: { id: 1, chat_id: 123 },
      };

      await service.dispatch(clientId, update);

      expect(mockMessageHandler.handle).toHaveBeenCalledWith(clientId, update);
      expect(mockAccountHandler.handle).not.toHaveBeenCalled();
      expect(mockChatHandler.handle).not.toHaveBeenCalled();
    });

    it('should route account updates to account handler', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateUser',
        user: { id: 123, first_name: 'Test' },
      };

      await service.dispatch(clientId, update);

      expect(mockAccountHandler.handle).toHaveBeenCalledWith(clientId, update);
      expect(mockMessageHandler.handle).not.toHaveBeenCalled();
    });

    it('should route chat updates to chat handler', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateNewChat',
        chat: { id: 123, title: 'Test Chat' },
      };

      await service.dispatch(clientId, update);

      expect(mockChatHandler.handle).toHaveBeenCalledWith(clientId, update);
    });

    it('should handle connection state updates', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateConnectionState',
        state: { '@type': 'connectionStateReady' },
      };

      mockSessionStore.getSession.mockResolvedValue({
        clientId,
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await service.dispatch(clientId, update);

      expect(mockSessionStore.saveSession).toHaveBeenCalled();
    });

    it('should handle error updates', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'error',
        code: 401,
        message: 'Unauthorized',
      };

      await service.dispatch(clientId, update);

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle updates without @type gracefully', async () => {
      const clientId = 'client-123';
      const update = {};

      await service.dispatch(clientId, update);

      expect(mockLogger.warn).toHaveBeenCalled();
      expect(mockMessageHandler.handle).not.toHaveBeenCalled();
    });

    it('should handle handler errors gracefully', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateNewMessage',
        message: { id: 1 },
      };

      mockMessageHandler.handle.mockRejectedValue(new Error('Handler error'));

      await service.dispatch(clientId, update);

      expect(mockLogger.error).toHaveBeenCalled();
      // Should not throw
    });

    it('should handle unhandled update types', async () => {
      const clientId = 'client-123';
      const update = {
        '@type': 'updateUnknownType',
      };

      await service.dispatch(clientId, update);

      expect(mockLogger.debug).toHaveBeenCalled();
      expect(mockMessageHandler.handle).not.toHaveBeenCalled();
    });
  });
});
