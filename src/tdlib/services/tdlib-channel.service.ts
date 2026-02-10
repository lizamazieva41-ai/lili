/**
 * TDLib Channel Service
 * 
 * Provides high-level methods for channel operations
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibClientNotFoundException } from '../exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

@Injectable()
export class TdlibChannelService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Create a channel
   */
  async createChannel(
    clientId: string,
    title: string,
    description = '',
    isForum = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'createChannel',
      title: title,
      description: description,
      is_forum: isForum,
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

    throw new Error('Timeout waiting for createChannel response');
  }

  /**
   * Get channel info
   */
  async getChannel(
    clientId: string,
    channelId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChat',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for getChannel response');
  }

  /**
   * Get full channel info
   */
  async getChannelFullInfo(
    clientId: string,
    channelId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatFullInfo',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chatFullInfo') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChannelFullInfo response');
  }

  /**
   * Edit channel
   */
  async editChannel(
    clientId: string,
    channelId: number | string,
    title?: string,
    description?: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'editChatTitle',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      title: title,
    } as TdlibRequest;

    if (description) {
      (request as Record<string, unknown>).description = description;
    }

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

    throw new Error('Timeout waiting for editChannel response');
  }

  /**
   * Edit channel about
   */
  async editChannelAbout(
    clientId: string,
    channelId: number | string,
    about: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'editChatDescription',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      description: about,
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

    throw new Error('Timeout waiting for editChannelAbout response');
  }

  /**
   * Toggle channel sign messages
   */
  async toggleChannelSignMessages(
    clientId: string,
    channelId: number | string,
    signMessages: boolean,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'toggleChannelSignMessages',
      channel_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      sign_messages: signMessages,
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

    throw new Error('Timeout waiting for toggleChannelSignMessages response');
  }

  /**
   * Toggle channel is all history available
   */
  async toggleChannelIsAllHistoryAvailable(
    clientId: string,
    channelId: number | string,
    isAllHistoryAvailable: boolean,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'toggleChannelIsAllHistoryAvailable',
      channel_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      is_all_history_available: isAllHistoryAvailable,
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

    throw new Error('Timeout waiting for toggleChannelIsAllHistoryAvailable response');
  }

  /**
   * Upgrade group chat to supergroup chat
   */
  async upgradeGroupChatToSupergroupChat(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'upgradeGroupChatToSupergroupChat',
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

    throw new Error('Timeout waiting for upgradeGroupChatToSupergroupChat response');
  }

  /**
   * Get channel members
   */
  async getChannelMembers(
    clientId: string,
    channelId: number | string,
    filter: Record<string, unknown> | null = null,
    offset = 0,
    limit = 200,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatMembers',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      filter: filter,
      offset: offset,
      limit: limit,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
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

    throw new Error('Timeout waiting for getChannelMembers response');
  }

  /**
   * Get channel administrators
   */
  async getChannelAdministrators(
    clientId: string,
    channelId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const filter = {
      '@type': 'chatMembersFilterAdministrators',
    };

    return this.getChannelMembers(clientId, channelId, filter);
  }

  /**
   * Get channel member
   */
  async getChannelMember(
    clientId: string,
    channelId: number | string,
    memberId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatMember',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for getChannelMember response');
  }

  /**
   * Search channel members
   */
  async searchChannelMembers(
    clientId: string,
    channelId: number | string,
    query: string,
    limit = 200,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const filter = {
      '@type': 'chatMembersFilterSearch',
      query: query,
    };

    return this.getChannelMembers(clientId, channelId, filter, 0, limit);
  }

  /**
   * Set channel member status
   */
  async setChannelMemberStatus(
    clientId: string,
    channelId: number | string,
    memberId: number | string,
    status: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatMemberStatus',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for setChannelMemberStatus response');
  }

  /**
   * Ban channel member
   */
  async banChannelMember(
    clientId: string,
    channelId: number | string,
    memberId: number | string,
    bannedUntilDate = 0,
    revokeMessages = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'banChatMember',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for banChannelMember response');
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
   * Transfer channel ownership
   */
  async transferChannelOwnership(
    clientId: string,
    channelId: number | string,
    userId: number | string,
    password: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'transferChatOwnership',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for transferChannelOwnership response');
  }

  /**
   * Get channel statistics
   */
  async getChannelStatistics(
    clientId: string,
    channelId: number | string,
    isDark = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatStatistics',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for getChannelStatistics response');
  }

  /**
   * Get channel message statistics
   */
  async getChannelMessageStatistics(
    clientId: string,
    channelId: number | string,
    messageId: number,
    isDark = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageStatistics',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
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

    throw new Error('Timeout waiting for getChannelMessageStatistics response');
  }

  /**
   * Report channel
   */
  async reportChannel(
    clientId: string,
    channelId: number | string,
    reason: Record<string, unknown>,
    messageIds: number[] = [],
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'reportChat',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      reason: reason,
      message_ids: messageIds,
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

    throw new Error('Timeout waiting for reportChannel response');
  }

  /**
   * Get channel available reactions
   */
  async getChannelAvailableReactions(
    clientId: string,
    channelId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatAvailableReactions',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'availableReactions') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChannelAvailableReactions response');
  }

  /**
   * Set channel available reactions
   */
  async setChannelAvailableReactions(
    clientId: string,
    channelId: number | string,
    availableReactions: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatAvailableReactions',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      available_reactions: availableReactions,
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

    throw new Error('Timeout waiting for setChannelAvailableReactions response');
  }

  /**
   * Set channel sticker set
   */
  async setChannelStickerSet(
    clientId: string,
    channelId: number | string,
    stickerSetId: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setChatStickerSet',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      sticker_set_id: stickerSetId,
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

    throw new Error('Timeout waiting for setChannelStickerSet response');
  }

  /**
   * Toggle channel is broadcast group
   */
  async toggleChannelIsBroadcastGroup(
    clientId: string,
    channelId: number | string,
    isBroadcastGroup: boolean,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'toggleChannelIsBroadcastGroup',
      channel_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      is_broadcast_group: isBroadcastGroup,
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

    throw new Error('Timeout waiting for toggleChannelIsBroadcastGroup response');
  }

  /**
   * Get channel recommendations
   */
  async getChannelRecommendations(
    clientId: string,
    channelId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getChatSimilarChats',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'chats') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getChannelRecommendations response');
  }

  /**
   * View channel recommendation
   */
  async viewChannelRecommendation(
    clientId: string,
    channelId: number | string,
    openedChatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'openChatSimilarChat',
      chat_id: typeof channelId === 'string' ? parseInt(channelId, 10) : channelId,
      opened_chat_id: typeof openedChatId === 'string' ? parseInt(openedChatId, 10) : openedChatId,
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

    throw new Error('Timeout waiting for viewChannelRecommendation response');
  }
}
