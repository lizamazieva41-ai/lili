import { Injectable, Logger } from '@nestjs/common';
import { TdlibSessionStore } from './tdlib-session.store';
import { CustomLoggerService } from '../common/services/logger.service';
import { TdlibMessageUpdateHandler } from './handlers/tdlib-message-update.handler';
import { TdlibAccountUpdateHandler } from './handlers/tdlib-account-update.handler';
import { TdlibChatUpdateHandler } from './handlers/tdlib-chat-update.handler';

/**
 * Service that dispatches TDLib updates to appropriate handlers
 */
@Injectable()
export class TdlibUpdateDispatcher {
  private readonly logger = new Logger(TdlibUpdateDispatcher.name);

  constructor(
    private readonly sessionStore: TdlibSessionStore,
    private readonly customLogger: CustomLoggerService,
    private readonly messageHandler: TdlibMessageUpdateHandler,
    private readonly accountHandler: TdlibAccountUpdateHandler,
    private readonly chatHandler: TdlibChatUpdateHandler,
  ) {}

  /**
   * Dispatch an update to the appropriate handler
   */
  async dispatch(clientId: string, update: any): Promise<void> {
    try {
      const updateType = update['@type'] as string;
      if (!updateType) {
        this.logger.warn('Update missing @type field', { clientId, update });
        return;
      }

      // Route update to appropriate handler
      switch (updateType) {
        // Message updates
        case 'updateNewMessage':
        case 'updateMessageSendSucceeded':
        case 'updateMessageSendFailed':
        case 'updateMessageContent':
        case 'updateMessageEdited':
        case 'updateMessageIsPinned':
        case 'updateDeleteMessages':
          await this.messageHandler.handle(clientId, update);
          break;

        // Account/User updates
        case 'updateAuthorizationState':
        case 'updateUser':
        case 'updateUserStatus':
        case 'updateUserFullInfo':
          await this.accountHandler.handle(clientId, update);
          break;

        // Chat updates
        case 'updateNewChat':
        case 'updateChatTitle':
        case 'updateChatPhoto':
        case 'updateChatLastMessage':
        case 'updateChatReadInbox':
        case 'updateChatReadOutbox':
        case 'updateChatUnreadMentionCount':
        case 'updateChatUnreadReactionCount':
          await this.chatHandler.handle(clientId, update);
          break;

        // Connection updates
        case 'updateConnectionState':
          await this.handleConnectionState(clientId, update);
          break;

        // Error updates
        case 'error':
          await this.handleError(clientId, update);
          break;

        default:
          this.logger.debug('Unhandled update type', { clientId, updateType });
      }
    } catch (error) {
      this.logger.error('Error dispatching update', {
        clientId,
        updateType: update['@type'],
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - continue processing other updates
    }
  }

  /**
   * Handle connection state updates
   */
  private async handleConnectionState(clientId: string, update: any): Promise<void> {
    const state = update.state?.['@type'];
    this.logger.debug('Connection state update', { clientId, state });
    
    // Update session last activity
    const session = await this.sessionStore.getSession(clientId);
    if (session) {
      session.lastActivityAt = new Date().toISOString();
      await this.sessionStore.saveSession(session);
    }
  }

  /**
   * Handle error updates
   */
  private async handleError(clientId: string, update: any): Promise<void> {
    const errorCode = update.code;
    const errorMessage = update.message || 'Unknown error';
    
    this.logger.warn('TDLib error received', {
      clientId,
      errorCode,
      errorMessage,
    });

    // Update account status if critical error
    if (errorCode === 401 || errorCode === 403) {
      // Authorization error - may need to revoke session
      this.logger.error('Authorization error - session may be invalid', {
        clientId,
        errorCode,
      });
    }
  }
}
