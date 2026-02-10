/**
 * TDLib Request Validator
 * 
 * Validates TDLib requests before sending to native addon
 */

import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibRequest } from '../types';

@Injectable()
export class TdlibRequestValidator {
  constructor(private readonly logger: CustomLoggerService) {}

  /**
   * Validate a TDLib request
   * @param request The request to validate
   * @returns true if valid, throws error if invalid
   */
  validate(request: unknown): request is TdlibRequest {
    if (!request || typeof request !== 'object') {
      throw new Error('Request must be an object');
    }

    const req = request as Record<string, unknown>;

    // Check for @type field
    if (!req['@type'] || typeof req['@type'] !== 'string') {
      throw new Error('Request must have a @type field');
    }

    const requestType = req['@type'] as string;

    // Basic validation - check for required fields based on request type
    // This is a simplified validator - in production, you'd want more comprehensive validation
    this.validateRequestType(requestType, req);

    return true;
  }

  /**
   * Validate specific request types
   */
  private validateRequestType(type: string, request: Record<string, unknown>): void {
    switch (type) {
      case 'sendMessage':
        this.validateSendMessage(request);
        break;
      case 'getMe':
        // No additional fields required
        break;
      case 'getChats':
        this.validateGetChats(request);
        break;
      case 'setAuthenticationPhoneNumber':
        this.validateSetAuthenticationPhoneNumber(request);
        break;
      case 'checkAuthenticationCode':
        this.validateCheckAuthenticationCode(request);
        break;
      case 'checkAuthenticationPassword':
        this.validateCheckAuthenticationPassword(request);
        break;
      case 'addProxy':
        this.validateAddProxy(request);
        break;
      default:
        // For unknown types, just log a warning but don't fail
        this.logger.debug(`Unknown request type: ${type}, skipping validation`);
    }
  }

  private validateSendMessage(request: Record<string, unknown>): void {
    if (typeof request.chat_id !== 'number' && typeof request.chat_id !== 'string') {
      throw new Error('sendMessage: chat_id must be a number or string');
    }

    if (!request.input_message_content || typeof request.input_message_content !== 'object') {
      throw new Error('sendMessage: input_message_content is required');
    }

    const content = request.input_message_content as Record<string, unknown>;
    if (content['@type'] !== 'inputMessageText') {
      throw new Error('sendMessage: input_message_content must be inputMessageText');
    }
  }

  private validateGetChats(request: Record<string, unknown>): void {
    if (request.limit !== undefined && typeof request.limit !== 'number') {
      throw new Error('getChats: limit must be a number');
    }

    if (request.chat_list && typeof request.chat_list !== 'object') {
      throw new Error('getChats: chat_list must be an object');
    }
  }

  private validateSetAuthenticationPhoneNumber(request: Record<string, unknown>): void {
    if (typeof request.phone_number !== 'string') {
      throw new Error('setAuthenticationPhoneNumber: phone_number must be a string');
    }
  }

  private validateCheckAuthenticationCode(request: Record<string, unknown>): void {
    if (typeof request.code !== 'string') {
      throw new Error('checkAuthenticationCode: code must be a string');
    }
  }

  private validateCheckAuthenticationPassword(request: Record<string, unknown>): void {
    if (typeof request.password !== 'string') {
      throw new Error('checkAuthenticationPassword: password must be a string');
    }
  }

  private validateAddProxy(request: Record<string, unknown>): void {
    if (typeof request.server !== 'string') {
      throw new Error('addProxy: server must be a string');
    }

    if (typeof request.port !== 'number') {
      throw new Error('addProxy: port must be a number');
    }

    if (request.type && typeof request.type !== 'object') {
      throw new Error('addProxy: type must be an object');
    }
  }
}
