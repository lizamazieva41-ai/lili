/**
 * TDLib Chat Service
 * 
 * Provides high-level methods for chat operations
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibClientNotFoundException } from '../exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

@Injectable()
export class TdlibChatService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Create a private chat
   */
  async createPrivateChat(
    clientId: string,
    userId: number | string,
    force = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'createPrivateChat',
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      force: force,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chat') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for createPrivateChat response');
  }

  /**
   * Create a basic group chat
   */
  async createGroupChat(
    clientId: string,
    title: string,
    userIds: Array<number | string>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'createBasicGroupChat',
      basic_group_id: 0, // Will be set by TDLib
      force: false,
    } as TdlibRequest;

    // Note: This is a simplified version. In practice, you'd need to create the basic group first
    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chat') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for createGroupChat response');
  }

  /**
   * Create a supergroup chat
   */
  async createSupergroupChat(
    clientId: string,
    supergroupId: number | string,
    force = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'createSupergroupChat',
      supergroup_id: typeof supergroupId === 'string' ? parseInt(supergroupId, 10) : supergroupId,
      force: force,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chat') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for createSupergroupChat response');
  }

  /**
   * Get chat information
   */
  async getChat(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChat',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chat') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChat response');
  }

  /**
   * Get chat history
   */
  async getChatHistory(
    clientId: string,
    chatId: number | string,
    fromMessageId = 0,
    offset = 0,
    limit = 100,
    onlyLocal = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatHistory',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      from_message_id: fromMessageId,
      offset: offset,
      limit: limit,
      only_local: onlyLocal,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // Longer timeout for history
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messages') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatHistory response');
  }

  /**
   * Search messages in a chat
   */
  async searchChatMessages(
    clientId: string,
    chatId: number | string,
    query: string,
    senderId?: number | string,
    fromMessageId = 0,
    offset = 0,
    limit = 100,
    filter?: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'searchChatMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      query: query,
      sender_id: senderId ? (typeof senderId === 'string' ? parseInt(senderId, 10) : senderId) : undefined,
      from_message_id: fromMessageId,
      offset: offset,
      limit: limit,
      filter: filter,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messages') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for searchChatMessages response');
  }

  /**
   * Get chat member
   */
  async getChatMember(
    clientId: string,
    chatId: number | string,
    memberId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatMember',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      member_id: {
        '@type': 'messageSenderUser',
        user_id: typeof memberId === 'string' ? parseInt(memberId, 10) : memberId,
      },
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chatMember') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatMember response');
  }

  /**
   * Get chat members
   */
  async getChatMembers(
    clientId: string,
    chatId: number | string,
    filter?: Record<string, unknown>,
    offset = 0,
    limit = 200,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatMembers',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      filter: filter,
      offset: offset,
      limit: limit,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chatMembers') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatMembers response');
  }

  /**
   * Get chats (wrapper around TdlibService.getChats)
   */
  async getChats(
    clientId: string,
    limit = 100,
    offset = 0,
  ): Promise<TdlibResponse[]> {
    return this.tdlibService.getChats(clientId, limit, offset);
  }

  /**
   * Edit chat title
   */
  async editChatTitle(
    clientId: string,
    chatId: number | string,
    title: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'editChatTitle',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      title: title,
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

    throw new Error('Timeout waiting for editChatTitle response');
  }

  /**
   * Edit chat description
   */
  async editChatDescription(
    clientId: string,
    chatId: number | string,
    description: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'editChatDescription',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      description: description,
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

    throw new Error('Timeout waiting for editChatDescription response');
  }

  /**
   * Edit chat photo
   */
  async editChatPhoto(
    clientId: string,
    chatId: number | string,
    photo: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatPhoto',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
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

    throw new Error('Timeout waiting for editChatPhoto response');
  }

  /**
   * Set chat accent colors
   */
  async setChatAccentColors(
    clientId: string,
    chatId: number | string,
    accentColorId: number,
    backgroundGradientId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatAccentColors',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      accent_color_id: accentColorId,
      background_gradient_id: backgroundGradientId,
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

    throw new Error('Timeout waiting for setChatAccentColors response');
  }

  /**
   * Set chat profile accent color
   */
  async setChatProfileAccentColor(
    clientId: string,
    chatId: number | string,
    profileAccentColorId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatProfileAccentColor',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      profile_accent_color_id: profileAccentColorId,
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

    throw new Error('Timeout waiting for setChatProfileAccentColor response');
  }

  /**
   * Set chat permissions
   */
  async setChatPermissions(
    clientId: string,
    chatId: number | string,
    permissions: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatPermissions',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      permissions: permissions,
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

    throw new Error('Timeout waiting for setChatPermissions response');
  }

  /**
   * Set chat slow mode delay
   */
  async setChatSlowModeDelay(
    clientId: string,
    chatId: number | string,
    slowModeDelay: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatSlowModeDelay',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      slow_mode_delay: slowModeDelay,
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

    throw new Error('Timeout waiting for setChatSlowModeDelay response');
  }

  /**
   * Pin chat message
   */
  async pinChatMessage(
    clientId: string,
    chatId: number | string,
    messageId: number,
    disableNotification = false,
    onlyForSelf = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'pinChatMessage',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      disable_notification: disableNotification,
      only_for_self: onlyForSelf,
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

    throw new Error('Timeout waiting for pinChatMessage response');
  }

  /**
   * Unpin chat message
   */
  async unpinChatMessage(
    clientId: string,
    chatId: number | string,
    messageId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'unpinChatMessage',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
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

    throw new Error('Timeout waiting for unpinChatMessage response');
  }

  /**
   * Unpin all chat messages
   */
  async unpinAllChatMessages(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'unpinAllChatMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
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

    throw new Error('Timeout waiting for unpinAllChatMessages response');
  }

  /**
   * Add chat member
   */
  async addChatMember(
    clientId: string,
    chatId: number | string,
    userId: number | string,
    forwardLimit = 0,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'addChatMember',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      forward_limit: forwardLimit,
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

    throw new Error('Timeout waiting for addChatMember response');
  }

  /**
   * Add chat members
   */
  async addChatMembers(
    clientId: string,
    chatId: number | string,
    userIds: Array<number | string>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'addChatMembers',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      user_ids: userIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id),
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

    throw new Error('Timeout waiting for addChatMembers response');
  }

  /**
   * Set chat member status
   */
  async setChatMemberStatus(
    clientId: string,
    chatId: number | string,
    memberId: number | string,
    status: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatMemberStatus',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      member_id: {
        '@type': 'messageSenderUser',
        user_id: typeof memberId === 'string' ? parseInt(memberId, 10) : memberId,
      },
      status: status,
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

    throw new Error('Timeout waiting for setChatMemberStatus response');
  }

  /**
   * Ban chat member
   */
  async banChatMember(
    clientId: string,
    chatId: number | string,
    memberId: number | string,
    bannedUntilDate = 0,
    revokeMessages = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'banChatMember',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      member_id: {
        '@type': 'messageSenderUser',
        user_id: typeof memberId === 'string' ? parseInt(memberId, 10) : memberId,
      },
      banned_until_date: bannedUntilDate,
      revoke_messages: revokeMessages,
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

    throw new Error('Timeout waiting for banChatMember response');
  }

  /**
   * Check if can transfer ownership
   */
  async canTransferOwnership(clientId: string): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'canTransferOwnership',
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'canTransferOwnershipResult') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for canTransferOwnership response');
  }

  /**
   * Transfer chat ownership
   */
  async transferChatOwnership(
    clientId: string,
    chatId: number | string,
    userId: number | string,
    password: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'transferChatOwnership',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      user_id: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      password: password,
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

    throw new Error('Timeout waiting for transferChatOwnership response');
  }

  /**
   * Get chat statistics
   */
  async getChatStatistics(
    clientId: string,
    chatId: number | string,
    isDark = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatStatistics',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      is_dark: isDark,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chatStatistics') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatStatistics response');
  }

  /**
   * Get chat message statistics
   */
  async getChatMessageStatistics(
    clientId: string,
    chatId: number | string,
    messageId: number,
    isDark = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageStatistics',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      is_dark: isDark,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messageStatistics') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatMessageStatistics response');
  }

  /**
   * Get chat message by date
   */
  async getChatMessageByDate(
    clientId: string,
    chatId: number | string,
    date: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatMessageByDate',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      date: date,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'message') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatMessageByDate response');
  }

  /**
   * Get chat scheduled messages
   */
  async getChatScheduledMessages(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatScheduledMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messages') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChatScheduledMessages response');
  }
}
