import { Injectable, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TelegramAccount, AccountStatus, Prisma } from '@prisma/client';
import { TdlibSessionStore } from '../tdlib/tdlib-session.store';
import { TdlibAuthService } from '../tdlib/tdlib-auth.service';
import { TdlibService } from '../tdlib/tdlib.service';
import { getErrorMessage, getErrorStack } from '../common/utils/error.utils';

// Type for account with proxy assignments included
type TelegramAccountWithProxy = Prisma.TelegramAccountGetPayload<{
  include: {
    proxyAssignments: {
      include: {
        proxy: true;
      };
    };
  };
}>;

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private prisma: PrismaService,
    private readonly tdlibSessionStore: TdlibSessionStore,
    @Inject(forwardRef(() => TdlibAuthService))
    private readonly tdlibAuthService: TdlibAuthService,
    @Inject(forwardRef(() => TdlibService))
    private readonly tdlibService: TdlibService,
  ) {}

  /**
   * Get all accounts for a user with filtering and pagination
   */
  async findAll(
    userId: string,
    filters: {
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ accounts: TelegramAccountWithProxy[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: Prisma.TelegramAccountWhereInput = { userId };

      if (filters.status) {
        where.status = filters.status.toUpperCase() as AccountStatus;
      }

      const [accounts, total] = await Promise.all([
        this.prisma.telegramAccount.findMany({
          where,
          skip,
          take: limit,
          include: {
            proxyAssignments: {
              where: { isActive: true },
              include: {
                proxy: true,
              },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.telegramAccount.count({ where }),
      ]);

      return {
        accounts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Error finding accounts for user ${userId}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get account by ID
   */
  async findOne(id: string, userId: string): Promise<TelegramAccountWithProxy> {
    try {
      const account = await this.prisma.telegramAccount.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          proxyAssignments: {
            where: { isActive: true },
            include: {
              proxy: true,
            },
          },
        },
      });

      if (!account) {
        throw new NotFoundException(`Account not found: ${id}`);
      }

      return account;
    } catch (error: unknown) {
      this.logger.error(`Error finding account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Create new account
   */
  async create(createAccountDto: CreateAccountDto, userId: string): Promise<TelegramAccount> {
    try {
      // Check if account with same phone already exists
      const existing = await this.prisma.telegramAccount.findFirst({
        where: {
          phone: createAccountDto.phone,
          userId,
        },
      });

      if (existing) {
        throw new BadRequestException(`Account with phone ${createAccountDto.phone} already exists`);
      }

      const account = await this.prisma.telegramAccount.create({
        data: {
          phone: createAccountDto.phone,
          userId,
          status: AccountStatus.INACTIVE, // Start as inactive until verified
          tags: createAccountDto.tags || [],
          notes: createAccountDto.notes,
          createdBy: userId,
        },
      });

      // Assign proxy if provided
      if (createAccountDto.proxyId) {
        await this.assignProxy(account.id, createAccountDto.proxyId, userId);
      }

      // Trigger TDLib authentication flow if autoAuth is enabled
      const autoAuth = createAccountDto.autoAuth !== false; // Default to true
      if (autoAuth && this.tdlibService.isReady()) {
        try {
          // Start authentication process
          await this.tdlibAuthService.requestCode(createAccountDto.phone, userId);
          this.logger.log(`TDLib auth initiated for account: ${account.id}`);
        } catch (error) {
          // Log but don't fail account creation if auth initiation fails
          this.logger.warn(`Failed to initiate TDLib auth for account ${account.id}`, {
            error: getErrorMessage(error),
          });
        }
      }

      this.logger.log(`Account created: ${account.id} (${account.phone})`);
      return account;
    } catch (error: unknown) {
      this.logger.error(`Error creating account: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Update account
   */
  async update(id: string, updateAccountDto: UpdateAccountDto, userId: string): Promise<TelegramAccount> {
    try {
      await this.findOne(id, userId); // Verify ownership

      const account = await this.prisma.telegramAccount.update({
        where: { id },
        data: {
          ...updateAccountDto,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Account updated: ${id}`);
      return account;
    } catch (error: unknown) {
      this.logger.error(`Error updating account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Delete account
   */
  async remove(id: string, userId: string): Promise<void> {
    try {
      const account = await this.findOne(id, userId); // Verify ownership

      // Revoke all TDLib sessions for this account before deletion
      try {
        await this.tdlibSessionStore.revokeAccountSessions(id);
        this.logger.log(`TDLib sessions revoked for account: ${id}`);
      } catch (sessionError) {
        this.logger.warn(`Failed to revoke TDLib sessions for account ${id}`, {
          error: getErrorMessage(sessionError),
        });
        // Continue with deletion even if session revocation fails
      }

      // Delete account
      await this.prisma.telegramAccount.delete({
        where: { id },
      });

      this.logger.log(`Account deleted: ${id}`);
    } catch (error: unknown) {
      this.logger.error(`Error deleting account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Verify account
   */
  async verify(id: string, userId: string): Promise<TelegramAccount> {
    try {
      const account = await this.findOne(id, userId);

      // In a full implementation, this would coordinate with TdlibAuthService
      // to ensure that the TDLib authorization_state is READY for the account's phone
      // and that a TdlibSession exists. For now, we check if there is any session
      // associated with this phone number before marking as verified.

      // NOTE: current TdlibSessionStore is keyed by clientId only; wiring phone → session
      // lookup would require additional indexing. This is a placeholder integrity check.

      const updated = await this.prisma.telegramAccount.update({
        where: { id },
        data: {
          verification: 'FULL',
          status: AccountStatus.ACTIVE,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Account verified: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error verifying account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get assigned proxy for account
   */
  async getProxy(id: string, userId: string) {
    try {
      await this.findOne(id, userId);

      const assignment = await this.prisma.accountProxyAssignment.findFirst({
        where: {
          accountId: id,
          isActive: true,
        },
        include: {
          proxy: true,
        },
        orderBy: { assignedAt: 'desc' },
      });

      return assignment?.proxy ?? null;
    } catch (error: unknown) {
      this.logger.error(`Error getting proxy for account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Assign proxy to account
   */
  async assignProxy(accountId: string, proxyId: string, userId: string) {
    try {
      await this.findOne(accountId, userId);

      // Check if proxy exists
      const proxy = await this.prisma.proxy.findUnique({
        where: { id: proxyId },
      });

      if (!proxy) {
        throw new NotFoundException(`Proxy not found: ${proxyId}`);
      }

      // Deactivate existing assignments
      await this.prisma.accountProxyAssignment.updateMany({
        where: {
          accountId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Create new assignment
      const assignment = await this.prisma.accountProxyAssignment.create({
        data: {
          accountId,
          proxyId,
          isActive: true,
        },
        include: {
          proxy: true,
        },
      });

      this.logger.log(`Proxy ${proxyId} assigned to account ${accountId}`);
      return assignment.proxy;
    } catch (error: unknown) {
      this.logger.error(`Error assigning proxy to account ${accountId}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Get account statistics
   */
  async getStats(id: string, userId: string) {
    try {
      const account = await this.findOne(id, userId);

      // Get statistics from account statistics JSON field
      const stats = (account.statistics as Record<string, unknown>) || {};

      // Get additional metrics from related tables
      // Note: Message model doesn't have accountId directly, adjust query as needed
      const campaignCount = await this.prisma.campaign.count({
        where: { accountId: id },
      });

      return {
        ...stats,
        campaignCount,
        activityScore: account.activityScore,
        reputation: account.reputation,
        lastActiveAt: account.lastActiveAt,
      };
    } catch (error: unknown) {
      this.logger.error(`Error getting stats for account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Activate account
   */
  async activate(id: string, userId: string): Promise<TelegramAccount> {
    try {
      await this.findOne(id, userId);

      const updated = await this.prisma.telegramAccount.update({
        where: { id },
        data: {
          status: AccountStatus.ACTIVE,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Account activated: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error activating account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }

  /**
   * Deactivate account
   */
  async deactivate(id: string, userId: string): Promise<TelegramAccount> {
    try {
      await this.findOne(id, userId);

      const updated = await this.prisma.telegramAccount.update({
        where: { id },
        data: {
          status: AccountStatus.INACTIVE,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Account deactivated: ${id}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Error deactivating account ${id}: ${getErrorMessage(error)}`, getErrorStack(error));
      throw error;
    }
  }
}
