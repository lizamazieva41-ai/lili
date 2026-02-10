import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import {
  Prisma,
  User,
  UserSession,
  AuthAuditLog,
  SecurityAlert,
  Notification,
  UserAccountLevel,
  LicenseStatus,
  AlertSeverity,
  NotificationPriority,
} from '@prisma/client';

@Injectable()
export class UserDatabaseService {
  constructor(private prisma: PrismaService) {}

  // User operations
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        licenses: {
          where: { status: LicenseStatus.ACTIVE }
        }
      }
    });
  }

  async findByTelegramId(telegramId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        licenses: true,
        sessions: {
          where: { isActive: true }
        }
      }
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: {
        telegramId: userData.telegramId!,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        language: userData.language || 'en',
        isActive: userData.isActive ?? true,
        accountLevel: userData.accountLevel || UserAccountLevel.BASIC,
        settings: (userData.settings || {}) as Prisma.InputJsonValue,
        reputation: userData.reputation || 0
      }
    });
  }

  async updateUser(id: string, updateData: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async updateUserSettings(id: string, settings: Prisma.InputJsonValue): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { settings, updatedAt: new Date() }
    });
  }

  async updateUserReputation(id: string, reputation: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { reputation, updatedAt: new Date() }
    });
  }

  async softDeleteUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  async searchUsers(query: string, limit: number = 20, offset: number = 0): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } }
        ],
        isActive: true
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Session operations
  async createSession(sessionData: Partial<UserSession>): Promise<UserSession> {
    return this.prisma.userSession.create({
      data: {
        userId: sessionData.userId!,
        token: sessionData.token!,
        refreshToken: sessionData.refreshToken,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        deviceFingerprint: sessionData.deviceFingerprint,
        isActive: sessionData.isActive ?? true,
        expiresAt: sessionData.expiresAt!
      }
    });
  }

  async findSessionByToken(token: string): Promise<UserSession | null> {
    return this.prisma.userSession.findFirst({
      where: { 
        token, 
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            isActive: true,
            accountLevel: true
          }
        }
      }
    });
  }

  async findSessionsByUser(userId: string): Promise<UserSession[]> {
    return this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateSession(id: string, updateData: Partial<UserSession>): Promise<UserSession> {
    return this.prisma.userSession.update({
      where: { id },
      data: updateData
    });
  }

  async invalidateSession(id: string): Promise<UserSession> {
    return this.prisma.userSession.update({
      where: { id },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    const result = await this.prisma.userSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { 
            isActive: false, 
            updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
          }
        ]
      }
    });

    return { deleted: result.count };
  }

  // Audit operations
  async createAuthAuditLog(auditData: Partial<AuthAuditLog>): Promise<AuthAuditLog> {
    return this.prisma.authAuditLog.create({
      data: {
        userId: auditData.userId!,
        event: auditData.event!,
        metadata: auditData.metadata || {},
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        severity: auditData.severity || 'MEDIUM',
        status: auditData.status || 'SUCCESS'
      }
    });
  }

  async findAuthAuditLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AuthAuditLog[]> {
    return this.prisma.authAuditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async findAuthAuditLogsByEvent(
    event: string,
    limit: number = 50
  ): Promise<AuthAuditLog[]> {
    return this.prisma.authAuditLog.findMany({
      where: { event },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  // Security alerts
  async createSecurityAlert(alertData: Partial<SecurityAlert>): Promise<SecurityAlert> {
    return this.prisma.securityAlert.create({
      data: {
        userId: alertData.userId!,
        type: alertData.type!,
        message: alertData.message!,
        severity: alertData.severity || AlertSeverity.MEDIUM,
        metadata: (alertData.metadata || {}) as Prisma.InputJsonValue,
        isActive: alertData.isActive ?? true
      }
    });
  }

  async findActiveSecurityAlerts(
    userId: string,
    severity?: AlertSeverity
  ): Promise<SecurityAlert[]> {
    return this.prisma.securityAlert.findMany({
      where: { 
        userId,
        isActive: true,
        ...(severity && { severity })
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async resolveSecurityAlert(id: string, resolvedBy: string): Promise<SecurityAlert> {
    return this.prisma.securityAlert.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedBy,
        resolvedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  // Notifications
  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: notificationData.userId!,
        type: notificationData.type!,
        title: notificationData.title!,
        message: notificationData.message!,
        data: (notificationData.data || {}) as Prisma.InputJsonValue,
        priority: notificationData.priority || NotificationPriority.MEDIUM,
        channels: notificationData.channels || ['in_app']
      }
    });
  }

  async findUserNotifications(
    userId: string,
    unreadOnly: boolean = false,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { 
        userId,
        ...(unreadOnly && { isRead: false }),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
      },
      orderBy: { priority: 'desc', createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async deleteExpiredNotifications(): Promise<{ deleted: number }> {
    const result = await this.prisma.notification.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });

    return { deleted: result.count };
  }

  // Statistics and analytics
  async getUserStats(userId: string): Promise<any> {
    const [
      totalSessions,
      activeSessions,
      totalAlerts,
      activeAlerts,
      totalNotifications,
      unreadNotifications,
      recentLogins
    ] = await Promise.all([
      this.prisma.userSession.count({ where: { userId } }),
      this.prisma.userSession.count({ 
        where: { userId, isActive: true } 
      }),
      this.prisma.securityAlert.count({ where: { userId } }),
      this.prisma.securityAlert.count({ 
        where: { userId, isActive: true } 
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ 
        where: { userId, isRead: false } 
      }),
      this.prisma.authAuditLog.count({
        where: {
          userId,
          event: 'LOGIN_SUCCESS',
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    return {
      sessions: {
        total: totalSessions,
        active: activeSessions
      },
      security: {
        totalAlerts,
        activeAlerts
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications
      },
      activity: {
        recentLogins
      }
    };
  }
}