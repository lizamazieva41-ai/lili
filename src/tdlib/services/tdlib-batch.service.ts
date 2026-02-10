/**
 * TDLib Batch Operations Service
 * 
 * Batch message sending, file operations, request batching, and response aggregation
 */

import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibService } from '../tdlib.service';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

export interface BatchRequest {
  request: TdlibRequest;
  clientId: string;
}

export interface BatchResult {
  success: boolean;
  response?: TdlibResponse;
  error?: TdlibError;
  request: TdlibRequest;
}

@Injectable()
export class TdlibBatchService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Execute batch requests
   */
  async executeBatch(
    requests: BatchRequest[],
    timeoutMs = 30000,
  ): Promise<BatchResult[]> {
    const results: BatchResult[] = [];
    const deadline = Date.now() + timeoutMs;

    // Send all requests
    for (const batchReq of requests) {
      try {
        this.tdlibService.send(batchReq.clientId, batchReq.request);
      } catch (error) {
        results.push({
          success: false,
          error: {
            '@type': 'error',
            code: 0,
            message: error instanceof Error ? error.message : String(error),
          },
          request: batchReq.request,
        });
      }
    }

    // Collect responses
    const clientIds = [...new Set(requests.map(r => r.clientId))];
    const pendingRequests = new Map<string, BatchRequest[]>();

    for (const req of requests) {
      if (!pendingRequests.has(req.clientId)) {
        pendingRequests.set(req.clientId, []);
      }
      pendingRequests.get(req.clientId)!.push(req);
    }

    while (Date.now() < deadline && pendingRequests.size > 0) {
      for (const clientId of clientIds) {
        const response = this.tdlibService.receive(clientId, 0.1);
        if (response) {
          const pending = pendingRequests.get(clientId);
          if (pending && pending.length > 0) {
            const req = pending.shift()!;
            if (response['@type'] === 'error') {
              results.push({
                success: false,
                error: response as TdlibError,
                request: req.request,
              });
            } else {
              results.push({
                success: true,
                response: response,
                request: req.request,
              });
            }
          }
        }
      }

      // Remove completed clients
      for (const [clientId, pending] of pendingRequests.entries()) {
        if (pending.length === 0) {
          pendingRequests.delete(clientId);
        }
      }
    }

    // Mark remaining as timeout
    for (const [clientId, pending] of pendingRequests.entries()) {
      for (const req of pending) {
        results.push({
          success: false,
          error: {
            '@type': 'error',
            code: 408,
            message: 'Request timeout',
          },
          request: req.request,
        });
      }
    }

    return results;
  }

  /**
   * Batch send messages
   */
  async batchSendMessages(
    clientId: string,
    messages: Array<{
      chatId: number | string;
      text: string;
      options?: Record<string, unknown>;
    }>,
  ): Promise<BatchResult[]> {
    const requests: BatchRequest[] = messages.map(msg => ({
      clientId,
      request: {
        '@type': 'sendMessage',
        chat_id: typeof msg.chatId === 'string' ? parseInt(msg.chatId, 10) : msg.chatId,
        input_message_content: {
          '@type': 'inputMessageText',
          text: {
            '@type': 'formattedText',
            text: msg.text,
          },
        },
        ...msg.options,
      } as TdlibRequest,
    }));

    return this.executeBatch(requests);
  }

  /**
   * Batch file operations
   */
  async batchFileOperations(
    clientId: string,
    operations: Array<{
      type: 'download' | 'upload' | 'get';
      fileId?: number;
      filePath?: string;
      remoteFileId?: string;
    }>,
  ): Promise<BatchResult[]> {
    const requests: BatchRequest[] = operations.map(op => {
      let request: TdlibRequest;

      switch (op.type) {
        case 'download':
          request = {
            '@type': 'downloadFile',
            file_id: op.fileId!,
          } as TdlibRequest;
          break;
        case 'upload':
          request = {
            '@type': 'uploadFile',
            file: {
              '@type': 'inputFileLocal',
              path: op.filePath!,
            },
          } as TdlibRequest;
          break;
        case 'get':
          request = {
            '@type': 'getFile',
            file_id: op.fileId!,
          } as TdlibRequest;
          break;
        default:
          throw new Error(`Unknown file operation type: ${op.type}`);
      }

      return { clientId, request };
    });

    return this.executeBatch(requests);
  }
}
