/**
 * TDLib File Service
 * 
 * Provides high-level methods for file operations
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibClientNotFoundException } from '../exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

@Injectable()
export class TdlibFileService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Download a file
   */
  async downloadFile(
    clientId: string,
    fileId: number,
    priority = 1,
    offset = 0,
    limit = 0,
    synchronous = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'downloadFile',
      file_id: fileId,
      priority: priority,
      offset: offset,
      limit: limit,
      synchronous: synchronous,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // 30 second timeout for downloads
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'file') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for downloadFile response');
  }

  /**
   * Upload a file
   */
  async uploadFile(
    clientId: string,
    file: Record<string, unknown>,
    fileType: Record<string, unknown>,
    priority = 1,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'uploadFile',
      file: file,
      file_type: fileType,
      priority: priority,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // 30 second timeout for uploads
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'file') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for uploadFile response');
  }

  /**
   * Get file information
   */
  async getFile(
    clientId: string,
    fileId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getFile',
      file_id: fileId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'file') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getFile response');
  }

  /**
   * Cancel file download
   */
  async cancelDownloadFile(
    clientId: string,
    fileId: number,
    onlyIfPending = false,
  ): Promise<void> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'cancelDownloadFile',
      file_id: fileId,
      only_if_pending: onlyIfPending,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for cancelDownloadFile response');
  }

  /**
   * Get remote file information
   */
  async getRemoteFile(
    clientId: string,
    remoteFileId: string,
    fileType?: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getRemoteFile',
      remote_file_id: remoteFileId,
      file_type: fileType,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'file') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getRemoteFile response');
  }
}
