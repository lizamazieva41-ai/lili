/**
 * TDLib Response Validator
 * 
 * Validates TDLib responses received from native addon
 */

import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TdlibResponse, TdlibError } from '../types';

@Injectable()
export class TdlibResponseValidator {
  constructor(private readonly logger: CustomLoggerService) {}

  /**
   * Validate a TDLib response
   * @param response The response to validate
   * @returns true if valid, throws error if invalid
   */
  validate(response: unknown): response is TdlibResponse {
    if (response === null || response === undefined) {
      return false; // null is valid (no response yet)
    }

    if (typeof response !== 'object') {
      throw new Error('Response must be an object');
    }

    const resp = response as Record<string, unknown>;

    // Check for @type field
    if (!resp['@type'] || typeof resp['@type'] !== 'string') {
      throw new Error('Response must have a @type field');
    }

    const responseType = resp['@type'] as string;

    // Check if it's an error
    if (responseType === 'error') {
      return this.validateError(resp as unknown as TdlibError);
    }

    // Validate specific response types
    this.validateResponseType(responseType, resp);

    return true;
  }

  /**
   * Validate error response
   */
  private validateError(error: TdlibError): boolean {
    if (typeof error.code !== 'number') {
      throw new Error('Error response: code must be a number');
    }

    if (typeof error.message !== 'string') {
      throw new Error('Error response: message must be a string');
    }

    return true;
  }

  /**
   * Validate specific response types
   */
  private validateResponseType(type: string, response: Record<string, unknown>): void {
    switch (type) {
      case 'ok':
        // No additional validation needed
        break;
      case 'user':
        this.validateUser(response);
        break;
      case 'chat':
        this.validateChat(response);
        break;
      case 'chats':
        this.validateChats(response);
        break;
      case 'messages':
        this.validateMessages(response);
        break;
      case 'file':
        this.validateFile(response);
        break;
      default:
        // For unknown types, just log a debug message
        this.logger.debug(`Unknown response type: ${type}, skipping detailed validation`);
    }
  }

  private validateUser(response: Record<string, unknown>): void {
    if (typeof response.id !== 'number' && typeof response.id !== 'string') {
      throw new Error('user response: id must be a number or string');
    }

    if (typeof response.first_name !== 'string') {
      throw new Error('user response: first_name must be a string');
    }
  }

  private validateChat(response: Record<string, unknown>): void {
    if (typeof response.id !== 'number' && typeof response.id !== 'string') {
      throw new Error('chat response: id must be a number or string');
    }

    if (typeof response.type !== 'object') {
      throw new Error('chat response: type must be an object');
    }
  }

  private validateChats(response: Record<string, unknown>): void {
    if (!Array.isArray(response.chat_ids)) {
      throw new Error('chats response: chat_ids must be an array');
    }
  }

  private validateMessages(response: Record<string, unknown>): void {
    if (!Array.isArray(response.messages)) {
      throw new Error('messages response: messages must be an array');
    }
  }

  private validateFile(response: Record<string, unknown>): void {
    if (typeof response.id !== 'number') {
      throw new Error('file response: id must be a number');
    }

    if (typeof response.size !== 'number' && typeof response.size !== 'string') {
      throw new Error('file response: size must be a number or string');
    }
  }

  /**
   * Check if response is an error
   */
  isError(response: unknown): response is TdlibError {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const resp = response as Record<string, unknown>;
    return resp['@type'] === 'error';
  }

  /**
   * Extract error from response if it's an error
   */
  extractError(response: unknown): TdlibError | null {
    if (this.isError(response)) {
      return response;
    }
    return null;
  }
}
