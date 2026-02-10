import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { TdlibSessionStore } from '../tdlib-session.store';
import { CustomLoggerService } from '../../common/services/logger.service';
import { AccountStatus } from '@prisma/client';

/**
 * Handler for TDLib account/user-related updates
 */
@Injectable()
export class TdlibAccountUpdateHandler {
  private readonly logger = new Logger(TdlibAccountUpdateHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionStore: TdlibSessionStore,
    private readonly customLogger: CustomLoggerService,
  ) {}

  /**
   * Handle account update
   */
  async handle(clientId: string, update: any): Promise<void> {
    const updateType = update['@type'] as string;

    switch (updateType) {
      case 'updateAuthorizationState':
        await this.handleAuthorizationState(clientId, update);
        break;
      case 'updateUser':
        await this.handleUserUpdate(clientId, update);
        break;
      case 'updateUserStatus':
        await this.handleUserStatus(clientId, update);
        break;
      case 'updateUserFullInfo':
        await this.handleUserFullInfo(clientId, update);
        break;
      default:
        this.logger.debug('Unhandled account update type', { clientId, updateType });
    }
  }

  /**
   * Handle authorization state update
   */
  private async handleAuthorizationState(clientId: string, update: any): Promise<void> {
    const authState = update.authorization_state;
    const stateType = authState?.['@type'] as string;

    this.logger.debug('Authorization state update', { clientId, stateType });

    // Get session
    const session = await this.sessionStore.getSession(clientId);
    if (!session || !session.accountId) {
      return;
    }

    // Update account status based on authorization state
    let accountStatus: AccountStatus | null = null;

    switch (stateType) {
      case 'authorizationStateReady':
        accountStatus = AccountStatus.ACTIVE;
        break;
      case 'authorizationStateLoggingOut':
        accountStatus = AccountStatus.INACTIVE;
        break;
      case 'authorizationStateClosed':
        accountStatus = AccountStatus.INACTIVE;
        // Revoke session
        await this.sessionStore.revokeSession(clientId);
        break;
    }

    if (accountStatus) {
      await this.updateAccountStatus(session.accountId, accountStatus);
    }
  }

  /**
   * Handle user update
   */
  private async handleUserUpdate(clientId: string, update: any): Promise<void> {
    const user = update.user;
    if (!user) {
      return;
    }

    // Get session and account
    const session = await this.sessionStore.getSession(clientId);
    if (!session || !session.accountId) {
      return;
    }

    // Update account with user info
    await this.updateAccountFromUser(session.accountId, user);
  }

  /**
   * Handle user status update
   */
  private async handleUserStatus(clientId: string, update: any): Promise<void> {
    const userId = update.user_id;
    const status = update.status;

    // Update last active time if user is online
    if (status?.['@type'] === 'userStatusOnline') {
      const session = await this.sessionStore.getSession(clientId);
      if (session && session.accountId) {
        await this.prisma.telegramAccount.update({
          where: { id: session.accountId },
          data: { lastActiveAt: new Date() },
        });
      }
    }
  }

  /**
   * Handle user full info update
   */
  private async handleUserFullInfo(clientId: string, update: any): Promise<void> {
    const userId = update.user_id;
    const fullInfo = update.user_full_info;

    // Could update account with additional info
    this.logger.debug('User full info update', { clientId, userId });
  }

  /**
   * Update account status
   */
  private async updateAccountStatus(
    accountId: string,
    status: AccountStatus,
  ): Promise<void> {
    try {
      await this.prisma.telegramAccount.update({
        where: { id: accountId },
        data: { status },
      });

      this.logger.log('Account status updated from TDLib', { accountId, status });
    } catch (error) {
      this.logger.error('Failed to update account status', {
        accountId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Update account from user data
   */
  private async updateAccountFromUser(accountId: string, user: any): Promise<void> {
    try {
      const updateData: any = {
        lastActiveAt: new Date(),
      };

      // Update username if available
      if (user.usernames?.editable_username || user.username) {
        updateData.username = user.usernames?.editable_username || user.username;
      }

      // Update first/last name
      if (user.first_name) {
        updateData.firstName = user.first_name;
      }
      if (user.last_name) {
        updateData.lastName = user.last_name;
      }

      // Update verification status
      if (user.is_verified !== undefined) {
        // Map to AccountVerification enum
        // Note: You may need to adjust this based on your enum values
      }

      if (Object.keys(updateData).length > 1) {
        // Only update if there's more than just lastActiveAt
        await this.prisma.telegramAccount.update({
          where: { id: accountId },
          data: updateData,
        });

        this.logger.debug('Account updated from user data', { accountId });
      }
    } catch (error) {
      this.logger.error('Failed to update account from user data', {
        accountId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
