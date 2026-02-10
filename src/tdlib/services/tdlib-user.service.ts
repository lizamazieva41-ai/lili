/**
 * TDLib User Service
 * 
 * Provides high-level methods for user operations
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibClientNotFoundException } from '../exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

@Injectable()
export class TdlibUserService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Get user info
   */
  async getUser(
    clientId: string,
    userId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getUser',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'user') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getUser response');
  }

  /**
   * Get full user info
   */
  async getUserFullInfo(
    clientId: string,
    userId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getUserFullInfo',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'userFullInfo') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getUserFullInfo response');
  }

  /**
   * Get user profile photos
   */
  async getUserProfilePhotos(
    clientId: string,
    userId: number | string,
    offset = 0,
    limit = 100,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getUserProfilePhotos',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      offset: offset,
      limit: limit,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chatPhotos') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getUserProfilePhotos response');
  }

  /**
   * Set user personal profile photo
   */
  async setUserPersonalProfilePhoto(
    clientId: string,
    photo: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setUserPersonalProfilePhoto',
      user_id: 0, // Current user
      photo: photo,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setUserPersonalProfilePhoto response');
  }

  /**
   * Set user profile photo
   */
  async setUserProfilePhoto(
    clientId: string,
    userId: number | string,
    photo: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setUserProfilePhoto',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      photo: photo,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setUserProfilePhoto response');
  }

  /**
   * Delete user profile photo
   */
  async deleteUserProfilePhoto(
    clientId: string,
    userId: number | string,
    photoId: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'deleteUserProfilePhoto',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      photo_id: photoId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for deleteUserProfilePhoto response');
  }

  /**
   * Set username
   */
  async setUsername(
    clientId: string,
    username: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setUsername',
      username: username,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setUsername response');
  }

  /**
   * Set bio
   */
  async setBio(
    clientId: string,
    bio: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setBio',
      bio: bio,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setBio response');
  }

  /**
   * Set bot commands
   */
  async setCommands(
    clientId: string,
    commands: Array<Record<string, unknown>>,
    scope: Record<string, unknown> | null = null,
    languageCode = '',
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setCommands',
      scope: scope,
      language_code: languageCode,
      commands: commands,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setCommands response');
  }

  /**
   * Get bot commands
   */
  async getCommands(
    clientId: string,
    scope: Record<string, unknown> | null = null,
    languageCode = '',
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getCommands',
      scope: scope,
      language_code: languageCode,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'botCommands') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getCommands response');
  }

  /**
   * Delete commands
   */
  async deleteCommands(
    clientId: string,
    scope: Record<string, unknown> | null = null,
    languageCode = '',
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'deleteCommands',
      scope: scope,
      language_code: languageCode,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for deleteCommands response');
  }

  /**
   * Set commands scope
   */
  async setCommandsScope(
    clientId: string,
    commands: Array<Record<string, unknown>>,
    scope: Record<string, unknown>,
    languageCode = '',
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setCommands',
      scope: scope,
      language_code: languageCode,
      commands: commands,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setCommandsScope response');
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(clientId: string): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getActiveSessions',
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'sessions') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getActiveSessions response');
  }

  /**
   * Terminate session
   */
  async terminateSession(
    clientId: string,
    sessionId: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'terminateSession',
      session_id: sessionId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for terminateSession response');
  }

  /**
   * Terminate all other sessions
   */
  async terminateAllOtherSessions(clientId: string): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'terminateAllOtherSessions',
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for terminateAllOtherSessions response');
  }

  /**
   * Toggle session can accept calls
   */
  async toggleSessionCanAcceptCalls(
    clientId: string,
    sessionId: string,
    canAcceptCalls: boolean,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'toggleSessionCanAcceptCalls',
      session_id: sessionId,
      can_accept_calls: canAcceptCalls,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for toggleSessionCanAcceptCalls response');
  }

  /**
   * Toggle session can accept secret chats
   */
  async toggleSessionCanAcceptSecretChats(
    clientId: string,
    sessionId: string,
    canAcceptSecretChats: boolean,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'toggleSessionCanAcceptSecretChats',
      session_id: sessionId,
      can_accept_secret_chats: canAcceptSecretChats,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for toggleSessionCanAcceptSecretChats response');
  }

  /**
   * Set inactive session TTL
   */
  async setInactiveSessionTtl(
    clientId: string,
    inactiveSessionTtlDays: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setInactiveSessionTtl',
      inactive_session_ttl_days: inactiveSessionTtlDays,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for setInactiveSessionTtl response');
  }

  /**
   * Get connected websites
   */
  async getConnectedWebsites(clientId: string): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getConnectedWebsites',
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'connectedWebsites') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getConnectedWebsites response');
  }

  /**
   * Disconnect website
   */
  async disconnectWebsite(
    clientId: string,
    websiteId: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'disconnectWebsite',
      website_id: websiteId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'ok') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for disconnectWebsite response');
  }
}
