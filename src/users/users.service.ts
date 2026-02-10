import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { User, SessionData } from '../common/interfaces/common.interfaces';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(userData: {
    telegramId: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    language?: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        telegramId: userData.telegramId,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        language: userData.language || 'en',
      },
    });

    const mappedUser = this.mapToUser(user);

    // Cache the newly created user
    await this.cacheService.set(`user:${mappedUser.id}`, mappedUser, 1800);
    if (userData.telegramId) {
      await this.cacheService.set(`user:telegram:${userData.telegramId}`, mappedUser, 1800);
    }
    if (userData.username) {
      await this.cacheService.set(`user:username:${userData.username}`, mappedUser, 1800);
    }

    return mappedUser;
  }

  async findById(id: string): Promise<User | null> {
    return this.cacheService.getUser(id, async () => {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return user ? this.mapToUser(user) : null;
    });
  }

  async findByTelegramId(telegramId: number): Promise<User | null> {
    return this.cacheService.getOrSet(
      `user:telegram:${telegramId}`,
      async () => {
        const user = await this.prisma.user.findUnique({
          where: { telegramId },
          include: {
            sessions: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        return user ? this.mapToUser(user) : null;
      },
      { ttl: 1800 }, // 30 minutes
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.cacheService.getOrSet(
      `user:username:${username}`,
      async () => {
        const user = await this.prisma.user.findUnique({
          where: { username },
          include: {
            sessions: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        return user ? this.mapToUser(user) : null;
      },
      { ttl: 1800 }, // 30 minutes
    );
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    const updatedUser = this.mapToUser(user);

    // Invalidate cache for this user
    await this.cacheService.invalidateUser(id);
    if (user.telegramId) {
      await this.cacheService.delete(`user:telegram:${user.telegramId}`);
    }
    if (user.username) {
      await this.cacheService.delete(`user:username:${user.username}`);
    }

    return updatedUser;
  }

  async createOrUpdateSession(
    userId: string,
    token: string,
    refreshToken?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SessionData> {
    // Invalidate previous sessions for this user if needed (max 3 concurrent)
    const activeSessions = await this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (activeSessions.length >= 3) {
      // Deactivate oldest session
      await this.prisma.userSession.update({
        where: { id: activeSessions[activeSessions.length - 1].id },
        data: { isActive: false },
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        token,
        refreshToken,
        ipAddress,
        userAgent,
        isActive: true,
        expiresAt,
      },
    });

    return {
      userId: session.userId,
      sessionId: session.id,
      ipAddress: session.ipAddress ?? undefined,
      userAgent: session.userAgent ?? undefined,
      isActive: session.isActive,
      expiresAt: session.expiresAt,
    };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  async findActiveSessionByToken(token: string): Promise<SessionData | null> {
    const session = await this.prisma.userSession.findFirst({
      where: { token, isActive: true, expiresAt: { gt: new Date() } },
    });

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      sessionId: session.id,
      ipAddress: session.ipAddress ?? undefined,
      userAgent: session.userAgent ?? undefined,
      isActive: session.isActive,
      expiresAt: session.expiresAt,
    };
  }

  private mapToUser(user: any): User {
    return {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      language: user.language,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}