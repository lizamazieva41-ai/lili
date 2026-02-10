import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TdlibService } from '../../../src/tdlib/tdlib.service';
import { CustomLoggerService } from '../../../src/common/services/logger.service';
import { MetricsService } from '../../../src/common/services/metrics.service';
import {
  TdlibNotReadyException,
  TdlibClientNotFoundException,
  TdlibLibraryLoadException,
  TdlibSendFailedException,
  TdlibInvalidArgumentException,
} from '../../../src/tdlib/exceptions/tdlib.exceptions';

describe('TdlibService', () => {
  let service: TdlibService;
  let mockConfigService: any;
  let mockLogger: any;
  let mockMetrics: any;
  let mockAddon: any;

  beforeEach(async () => {
    mockAddon = {
      createClient: jest.fn(),
      destroyClient: jest.fn(),
      send: jest.fn(),
      receive: jest.fn(),
      execute: jest.fn(),
      getLibraryInfo: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          TDLIB_ENABLED: true,
          TDLIB_ADDON_PATH: '/path/to/addon',
        };
        return config[key] ?? defaultValue;
      }),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockMetrics = {
      setTdlibActiveClients: jest.fn(),
      incrementTdlibRequests: jest.fn(),
      recordTdlibRequestDuration: jest.fn(),
      incrementTdlibErrors: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TdlibService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CustomLoggerService, useValue: mockLogger },
        { provide: MetricsService, useValue: mockMetrics },
      ],
    }).compile();

    service = module.get<TdlibService>(TdlibService);
    
    // Mock the addon loading
    (service as any).addon = mockAddon;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isReady', () => {
    it('should return true when addon is loaded', () => {
      (service as any).addon = mockAddon;
      expect(service.isReady()).toBe(true);
    });

    it('should return false when addon is not loaded', () => {
      (service as any).addon = null;
      expect(service.isReady()).toBe(false);
    });
  });

  describe('getLibraryInfo', () => {
    it('should return library info when available', () => {
      const mockInfo = {
        initialized: true,
        handle: 123,
        hasCreate: true,
        hasSend: true,
        hasReceive: true,
        hasExecute: true,
        hasDestroy: true,
        clientCount: 5,
      };
      mockAddon.getLibraryInfo.mockReturnValue(mockInfo);

      const result = service.getLibraryInfo();
      expect(result).toEqual(mockInfo);
    });

    it('should return null when getLibraryInfo is not available', () => {
      mockAddon.getLibraryInfo = undefined;
      expect(service.getLibraryInfo()).toBeNull();
    });
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const mockClientId = 'client-123';
      mockAddon.createClient.mockResolvedValue(mockClientId);

      const result = await service.createClient({ phoneNumber: '+1234567890' });

      expect(result.id).toBe(mockClientId);
      expect(mockAddon.createClient).toHaveBeenCalled();
      expect(mockMetrics.setTdlibActiveClients).toHaveBeenCalled();
      expect(mockMetrics.incrementTdlibRequests).toHaveBeenCalledWith('createClient', 'success');
    });

    it('should throw TdlibNotReadyException when addon is not ready', async () => {
      (service as any).addon = null;

      await expect(service.createClient()).rejects.toThrow(TdlibNotReadyException);
    });

    it('should throw error when client creation fails', async () => {
      mockAddon.createClient.mockRejectedValue(new Error('Creation failed'));

      await expect(service.createClient()).rejects.toThrow(TdlibLibraryLoadException);
    });

    it('should throw error when invalid clientId is returned', async () => {
      mockAddon.createClient.mockResolvedValue(null);

      await expect(service.createClient()).rejects.toThrow();
    });
  });

  describe('destroyClient', () => {
    it('should destroy a client successfully', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });

      service.destroyClient(clientId);

      expect(mockAddon.destroyClient).toHaveBeenCalledWith(clientId);
      expect((service as any).clients.has(clientId)).toBe(false);
      expect(mockMetrics.setTdlibActiveClients).toHaveBeenCalled();
    });

    it('should handle non-existent client gracefully', () => {
      const clientId = 'non-existent';
      
      service.destroyClient(clientId);

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle destroy failure', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.destroyClient.mockImplementation(() => {
        throw new Error('Destroy failed');
      });

      expect(() => service.destroyClient(clientId)).toThrow(TdlibClientNotFoundException);
      expect((service as any).clients.has(clientId)).toBe(false); // Should still remove from map
    });
  });

  describe('send', () => {
    it('should send request successfully', () => {
      const clientId = 'client-123';
      const request = { '@type': 'getMe' };
      (service as any).clients.set(clientId, { id: clientId });

      service.send(clientId, request);

      expect(mockAddon.send).toHaveBeenCalledWith(clientId, JSON.stringify(request));
      expect(mockMetrics.incrementTdlibRequests).toHaveBeenCalledWith('getMe', 'success');
      expect(mockMetrics.recordTdlibRequestDuration).toHaveBeenCalled();
    });

    it('should throw TdlibNotReadyException when addon is not ready', () => {
      (service as any).addon = null;
      const clientId = 'client-123';

      expect(() => service.send(clientId, {})).toThrow(TdlibNotReadyException);
    });

    it('should throw TdlibClientNotFoundException for non-existent client', () => {
      const clientId = 'non-existent';

      expect(() => service.send(clientId, {})).toThrow(TdlibClientNotFoundException);
    });

    it('should handle send errors', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.send.mockImplementation(() => {
        throw new Error('Send failed');
      });

      expect(() => service.send(clientId, {})).toThrow(TdlibSendFailedException);
      expect(mockMetrics.incrementTdlibErrors).toHaveBeenCalled();
    });
  });

  describe('receive', () => {
    it('should receive update successfully', () => {
      const clientId = 'client-123';
      const mockUpdate = { '@type': 'updateNewMessage', message: {} };
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.receive.mockReturnValue(JSON.stringify(mockUpdate));

      const result = service.receive(clientId);

      expect(result).toEqual(mockUpdate);
      expect(mockAddon.receive).toHaveBeenCalledWith(clientId, 1.0);
    });

    it('should return null when no update available', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.receive.mockReturnValue(null);

      const result = service.receive(clientId);

      expect(result).toBeNull();
    });

    it('should throw TdlibInvalidArgumentException for invalid timeout', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });

      expect(() => service.receive(clientId, -1)).toThrow(TdlibInvalidArgumentException);
      expect(() => service.receive(clientId, 301)).toThrow(TdlibInvalidArgumentException);
    });

    it('should handle JSON parse errors gracefully', () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.receive.mockReturnValue('invalid json');

      const result = service.receive(clientId);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('execute', () => {
    it('should execute request successfully', () => {
      const request = { '@type': 'getOption', name: 'version' };
      const mockResult = { '@type': 'optionValueString', value: '1.8.0' };
      mockAddon.execute.mockReturnValue(JSON.stringify(mockResult));

      const result = service.execute(request);

      expect(result).toEqual(mockResult);
      expect(mockAddon.execute).toHaveBeenCalledWith(JSON.stringify(request));
    });

    it('should return null when no result', () => {
      mockAddon.execute.mockReturnValue(null);

      const result = service.execute({});

      expect(result).toBeNull();
    });

    it('should throw TdlibNotReadyException when addon is not ready', () => {
      (service as any).addon = null;

      expect(() => service.execute({})).toThrow(TdlibNotReadyException);
    });
  });

  describe('setProxy', () => {
    it('should set proxy successfully', async () => {
      const clientId = 'client-123';
      const proxyConfig = {
        type: 'socks5' as const,
        server: '127.0.0.1',
        port: 1080,
        username: 'user',
        password: 'pass',
      };
      (service as any).clients.set(clientId, { id: clientId });

      await service.setProxy(clientId, proxyConfig);

      expect(mockAddon.send).toHaveBeenCalled();
      const sendCall = mockAddon.send.mock.calls[0];
      expect(sendCall[0]).toBe(clientId);
      const sentRequest = JSON.parse(sendCall[1]);
      expect(sentRequest['@type']).toBe('addProxy');
      expect(sentRequest.server).toBe(proxyConfig.server);
      expect(sentRequest.port).toBe(proxyConfig.port);
    });

    it('should throw TdlibClientNotFoundException for non-existent client', async () => {
      const proxyConfig = {
        type: 'socks5' as const,
        server: '127.0.0.1',
        port: 1080,
      };

      await expect(service.setProxy('non-existent', proxyConfig)).rejects.toThrow(
        TdlibClientNotFoundException,
      );
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const clientId = 'client-123';
      const chatId = 123456789;
      const message = 'Hello, World!';
      (service as any).clients.set(clientId, { id: clientId });

      await service.sendMessage(clientId, chatId, message);

      expect(mockAddon.send).toHaveBeenCalled();
      const sendCall = mockAddon.send.mock.calls[0];
      const sentRequest = JSON.parse(sendCall[1]);
      expect(sentRequest['@type']).toBe('sendMessage');
      expect(sentRequest.chat_id).toBe(chatId);
    });

    it('should handle message options', async () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });

      await service.sendMessage(clientId, 123456789, 'Test', {
        disableNotification: true,
        replyToMessageId: 100,
      });

      const sendCall = mockAddon.send.mock.calls[0];
      const sentRequest = JSON.parse(sendCall[1]);
      expect(sentRequest.disable_notification).toBe(true);
      expect(sentRequest.reply_to_message_id).toBe(100);
    });
  });

  describe('getMe', () => {
    it('should get account info successfully', async () => {
      const clientId = 'client-123';
      const mockUser = {
        '@type': 'user',
        id: 123456789,
        first_name: 'Test',
        username: 'testuser',
      };
      (service as any).clients.set(clientId, { id: clientId });

      // Mock receive to return user after getMe
      let receiveCallCount = 0;
      mockAddon.receive.mockImplementation(() => {
        receiveCallCount++;
        if (receiveCallCount === 1) {
          return JSON.stringify(mockUser);
        }
        return null;
      });

      const result = await service.getMe(clientId);

      expect(result).toEqual(mockUser);
      expect(mockAddon.send).toHaveBeenCalled();
    });

    it('should throw timeout error when no response', async () => {
      const clientId = 'client-123';
      (service as any).clients.set(clientId, { id: clientId });
      mockAddon.receive.mockReturnValue(null);

      await expect(service.getMe(clientId)).rejects.toThrow('Timeout waiting for getMe response');
    });
  });

  describe('getChats', () => {
    it('should get chats successfully', async () => {
      const clientId = 'client-123';
      const mockChat = {
        '@type': 'chat',
        id: 123456789,
        title: 'Test Chat',
      };
      (service as any).clients.set(clientId, { id: clientId });

      let receiveCallCount = 0;
      mockAddon.receive.mockImplementation(() => {
        receiveCallCount++;
        if (receiveCallCount <= 2) {
          return JSON.stringify(mockChat);
        }
        return null;
      });

      const result = await service.getChats(clientId, 10, 0);

      expect(result.length).toBeGreaterThan(0);
      expect(mockAddon.send).toHaveBeenCalled();
    });
  });

  describe('searchContacts', () => {
    it('should search contacts successfully', async () => {
      const clientId = 'client-123';
      const mockUsers = {
        '@type': 'users',
        user_ids: [123, 456],
      };
      (service as any).clients.set(clientId, { id: clientId });

      mockAddon.receive.mockReturnValue(JSON.stringify(mockUsers));

      const result = await service.searchContacts(clientId, 'test');

      expect(mockAddon.send).toHaveBeenCalled();
      // Note: The current implementation returns user_ids array, not full user objects
    });
  });

  describe('getClientCount', () => {
    it('should return correct client count', () => {
      (service as any).clients.set('client-1', { id: 'client-1' });
      (service as any).clients.set('client-2', { id: 'client-2' });

      expect(service.getClientCount()).toBe(2);
    });
  });

  describe('getAllClientIds', () => {
    it('should return all client IDs', () => {
      (service as any).clients.set('client-1', { id: 'client-1' });
      (service as any).clients.set('client-2', { id: 'client-2' });

      const ids = service.getAllClientIds();
      expect(ids).toContain('client-1');
      expect(ids).toContain('client-2');
      expect(ids.length).toBe(2);
    });
  });
});
