/**
 * TDLib Message Service
 * 
 * Provides high-level methods for messaging operations
 */

import { Injectable } from '@nestjs/common';
import { TdlibService } from '../tdlib.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibClientNotFoundException } from '../exceptions/tdlib.exceptions';
import { TdlibRequest, TdlibResponse, TdlibError } from '../types';

export interface SendMessageOptions {
  replyToMessageId?: number;
  disableNotification?: boolean;
  scheduleDate?: number;
  disableWebPagePreview?: boolean;
}

export interface EditMessageOptions {
  disableWebPagePreview?: boolean;
}

@Injectable()
export class TdlibMessageService {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Get a message by ID
   */
  async getMessage(
    clientId: string,
    chatId: number | string,
    messageId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessage',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    // Wait for response
    const deadline = Date.now() + 10000; // 10 second timeout
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

    throw new Error('Timeout waiting for getMessage response');
  }

  /**
   * Get multiple messages
   */
  async getMessages(
    clientId: string,
    chatId: number | string,
    messageIds: number[],
  ): Promise<TdlibResponse[]> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_ids: messageIds,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const messages: TdlibResponse[] = [];
    const deadline = Date.now() + 10000;

    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messages') {
          const messagesResponse = response as Record<string, unknown>;
          const msgs = (messagesResponse.messages as unknown[]) || [];
          messages.push(...msgs.map(msg => msg as TdlibResponse));
          break;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    return messages;
  }

  /**
   * Edit message text
   */
  async editMessageText(
    clientId: string,
    chatId: number | string,
    messageId: number,
    text: string,
    options: EditMessageOptions = {},
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'editMessageText',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      input_message_content: {
        '@type': 'inputMessageText',
        text: {
          '@type': 'formattedText',
          text: text,
        },
        disable_web_page_preview: options.disableWebPagePreview || false,
      },
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

    throw new Error('Timeout waiting for editMessageText response');
  }

  /**
   * Delete messages
   */
  async deleteMessages(
    clientId: string,
    chatId: number | string,
    messageIds: number[],
    revoke = false,
  ): Promise<void> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'deleteMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_ids: messageIds,
      revoke: revoke,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
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

    throw new Error('Timeout waiting for deleteMessages response');
  }

  /**
   * Forward messages
   */
  async forwardMessages(
    clientId: string,
    chatId: number | string,
    fromChatId: number | string,
    messageIds: number[],
    options: { disableNotification?: boolean; fromBackground?: boolean } = {},
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'forwardMessages',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      from_chat_id: typeof fromChatId === 'string' ? parseInt(fromChatId, 10) : fromChatId,
      message_ids: messageIds,
      disable_notification: options.disableNotification || false,
      from_background: options.fromBackground || false,
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

    throw new Error('Timeout waiting for forwardMessages response');
  }

  /**
   * Send message album (multiple messages)
   */
  async sendMessageAlbum(
    clientId: string,
    chatId: number | string,
    inputMessageContents: Array<Record<string, unknown>>,
    options: SendMessageOptions = {},
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'sendMessageAlbum',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      input_message_contents: inputMessageContents,
      disable_notification: options.disableNotification || false,
      reply_to_message_id: options.replyToMessageId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // 30 second timeout for albums
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

    throw new Error('Timeout waiting for sendMessageAlbum response');
  }

  /**
   * Get message thread
   */
  async getMessageThread(
    clientId: string,
    chatId: number | string,
    messageId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageThread',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
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

    throw new Error('Timeout waiting for getMessageThread response');
  }

  /**
   * Get message link
   */
  async getMessageLink(
    clientId: string,
    chatId: number | string,
    messageId: number,
    mediaTimestamp = 0,
    forAlbum = false,
    inMessageThread = false,
  ): Promise<string> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageLink',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      media_timestamp: mediaTimestamp,
      for_album: forAlbum,
      in_message_thread: inMessageThread,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messageLink') {
          const linkResponse = response as Record<string, unknown>;
          return (linkResponse.link as string) || '';
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessageLink response');
  }

  /**
   * Get message locally (from cache)
   */
  async getMessageLocally(
    clientId: string,
    chatId: number | string,
    messageId: number,
  ): Promise<TdlibResponse | null> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageLocally',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 5000; // Shorter timeout for local
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 0.5);
      if (response) {
        if (response['@type'] === 'message') {
          return response;
        }
        if (response['@type'] === 'error') {
          // For local, errors might mean not in cache
          return null;
        }
      }
    }

    return null;
  }

  /**
   * Pin a message in a chat
   */
  async pinMessage(
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

    throw new Error('Timeout waiting for pinMessage response');
  }

  /**
   * Unpin a message in a chat
   */
  async unpinMessage(
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

    throw new Error('Timeout waiting for unpinMessage response');
  }

  /**
   * Unpin all messages in a chat
   */
  async unpinAllMessages(
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

    throw new Error('Timeout waiting for unpinAllMessages response');
  }

  /**
   * Mark message contents as read
   */
  async readMessageContents(
    clientId: string,
    chatId: number | string,
    messageIds: number[],
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'readMessageContents',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
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

    throw new Error('Timeout waiting for readMessageContents response');
  }

  /**
   * Mark all message mentions as read
   */
  async readAllMessageMentions(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'readAllMessageMentions',
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

    throw new Error('Timeout waiting for readAllMessageMentions response');
  }

  /**
   * Mark all message reactions as read
   */
  async readAllMessageReactions(
    clientId: string,
    chatId: number | string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'readAllMessageReactions',
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

    throw new Error('Timeout waiting for readAllMessageReactions response');
  }

  /**
   * Get message statistics
   */
  async getMessageStatistics(
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

    throw new Error('Timeout waiting for getMessageStatistics response');
  }

  /**
   * Get public forwards of a message
   */
  async getMessagePublicForwards(
    clientId: string,
    chatId: number | string,
    messageId: number,
    offset = '',
    limit = 100,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessagePublicForwards',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      offset: offset,
      limit: limit,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'publicForwards') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessagePublicForwards response');
  }

  /**
   * Report a message
   */
  async reportMessage(
    clientId: string,
    chatId: number | string,
    messageIds: number[],
    reason: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'reportMessage',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_ids: messageIds,
      reason: reason,
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

    throw new Error('Timeout waiting for reportMessage response');
  }

  /**
   * Get message read date
   */
  async getMessageReadDate(
    clientId: string,
    chatId: number | string,
    messageId: number,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageReadDate',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messageReadDate') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessageReadDate response');
  }

  /**
   * Get added reactions for a message
   */
  async getMessageAddedReactions(
    clientId: string,
    chatId: number | string,
    messageId: number,
    reactionType: Record<string, unknown> | null = null,
    offset = '',
    limit = 100,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageAddedReactions',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      reaction_type: reactionType,
      offset: offset,
      limit: limit,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'addedReactions') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessageAddedReactions response');
  }

  /**
   * Add reaction to a message
   */
  async addMessageReaction(
    clientId: string,
    chatId: number | string,
    messageId: number,
    reactionType: Record<string, unknown>,
    isBig = false,
    updateRecentReactions = true,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'addMessageReaction',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      reaction_type: reactionType,
      is_big: isBig,
      update_recent_reactions: updateRecentReactions,
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

    throw new Error('Timeout waiting for addMessageReaction response');
  }

  /**
   * Remove reaction from a message
   */
  async removeMessageReaction(
    clientId: string,
    chatId: number | string,
    messageId: number,
    reactionType: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'removeMessageReaction',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      reaction_type: reactionType,
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

    throw new Error('Timeout waiting for removeMessageReaction response');
  }

  /**
   * Set reactions on a message (for bots only)
   */
  async setMessageReaction(
    clientId: string,
    chatId: number | string,
    messageId: number,
    reactionTypes: Array<Record<string, unknown>>,
    isBig = false,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'setMessageReactions',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      reaction_types: reactionTypes,
      is_big: isBig,
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

    throw new Error('Timeout waiting for setMessageReaction response');
  }

  /**
   * Get available reactions for a message
   */
  async getMessageAvailableReactions(
    clientId: string,
    chatId: number | string,
    messageId: number,
    rowSize = 8,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageAvailableReactions',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      row_size: rowSize,
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

    throw new Error('Timeout waiting for getMessageAvailableReactions response');
  }

  /**
   * Search messages globally
   */
  async searchMessages(
    clientId: string,
    query: string,
    offset = '',
    limit = 100,
    filter: Record<string, unknown> | null = null,
    chatTypeFilter: Record<string, unknown> | null = null,
    minDate = 0,
    maxDate = 0,
    chatList: Record<string, unknown> | null = null,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'searchMessages',
      chat_list: chatList,
      query: query,
      offset: offset,
      limit: limit,
      filter: filter,
      chat_type_filter: chatTypeFilter,
      min_date: minDate,
      max_date: maxDate,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // Longer timeout for search
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'foundMessages') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for searchMessages response');
  }

  /**
   * Get message embedding code
   */
  async getMessageEmbeddingCode(
    clientId: string,
    chatId: number | string,
    messageId: number,
    forAlbum = false,
  ): Promise<string> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageEmbeddingCode',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      for_album: forAlbum,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'text') {
          const textResponse = response as Record<string, unknown>;
          return (textResponse.text as string) || '';
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessageEmbeddingCode response');
  }

  /**
   * Get message link info
   */
  async getMessageLinkInfo(
    clientId: string,
    url: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'getMessageLinkInfo',
      url: url,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'messageLinkInfo') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for getMessageLinkInfo response');
  }

  /**
   * Translate message text
   */
  async translateMessageText(
    clientId: string,
    chatId: number | string,
    messageId: number,
    toLanguageCode: string,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'translateMessageText',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      to_language_code: toLanguageCode,
    } as TdlibRequest;

    this.tdlibService.send(clientId, request);

    const deadline = Date.now() + 30000; // Longer timeout for translation
    while (Date.now() < deadline) {
      const response = this.tdlibService.receive(clientId, 1.0);
      if (response) {
        if (response['@type'] === 'formattedText') {
          return response;
        }
        if (response['@type'] === 'error') {
          const error = response as TdlibError;
          throw new Error(`TDLib error: ${error.message} (code: ${error.code})`);
        }
      }
    }

    throw new Error('Timeout waiting for translateMessageText response');
  }

  /**
   * Report message reactions
   */
  async reportMessageReactions(
    clientId: string,
    chatId: number | string,
    messageId: number,
    senderId: Record<string, unknown>,
  ): Promise<TdlibResponse> {
    if (!this.tdlibService.getAllClientIds().includes(clientId)) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const request: TdlibRequest = {
      '@type': 'reportMessageReactions',
      chat_id: typeof chatId === 'string' ? parseInt(chatId, 10) : chatId,
      message_id: messageId,
      sender_id: senderId,
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

    throw new Error('Timeout waiting for reportMessageReactions response');
  }
}
