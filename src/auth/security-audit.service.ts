import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../config/prisma.service';
import { RedisService } from '../config/redis.service';
import { IpUtils, IpInfo } from './utils/ip-utils';
import { UserAgentParser, ParsedUserAgent } from './utils/user-agent-parser';

export interface SecurityEvent {
  userId: string;
  event: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: Date;
}

export interface SecurityAlert {
  type: string;
  userId: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: any;
  createdAt: Date;
}

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);
  private readonly MAX_RECENT_EVENTS = 100;
  private readonly THRESHOLD_SUSPICIOUS_LOGIN_ATTEMPTS = 5;
  private readonly THRESHOLD_FAILED_ATTEMPTS_WINDOW = 15 * 60 * 1000; // 15 minutes

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  /**
   * Log authentication event
   */
  async logAuthEvent(event: SecurityEvent): Promise<void> {
    // Store in database
    await this.prisma.authAuditLog.create({
      data: {
        userId: event.userId,
        event: event.event,
        metadata: {
          severity: event.severity,
          details: event.details,
          sessionId: event.sessionId,
        },
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      },
    });

    // Store in Redis for quick access
    const key = `auth_events:${event.userId}`;
    const events = await this.getRecentAuthEvents(event.userId);
    events.push(event);

    // Keep only recent events
    if (events.length > this.MAX_RECENT_EVENTS) {
      events.splice(0, events.length - this.MAX_RECENT_EVENTS);
    }

    await this.redisService.set(key, JSON.stringify(events), 24 * 60 * 60); // 24 hours

    // Check for suspicious patterns
    await this.analyzeSecurityPattern(event.userId, events);

    // Log high severity events
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      this.logger.warn(`Security event: ${event.event} for user ${event.userId}`, event.details);
    }
  }

  /**
   * Analyze login patterns for suspicious activity
   */
  async analyzeLoginPattern(
    userId: string, 
    ipAddress: string, 
    userAgent: string,
    sessionId: string
  ): Promise<{ risk: 'LOW' | 'MEDIUM' | 'HIGH'; alerts: SecurityAlert[] }> {
    const alerts: SecurityAlert[] = [];
    const recentEvents = await this.getRecentAuthEvents(userId, 'LOGIN_SUCCESS');
    
    const ipInfo = await IpUtils.getIpInfo(ipAddress);
    const parsedUA = UserAgentParser.parse(userAgent);
    
    // Check for new IP
    const previousIps = recentEvents.map(e => e.ipAddress).filter(Boolean) as string[];
    const ipRisk = IpUtils.calculateRiskScore(ipAddress, previousIps);
    
    if (ipRisk.score >= 50) {
      alerts.push({
        type: 'SUSPICIOUS_IP',
        userId,
        message: `Login from suspicious IP: ${ipAddress}`,
        severity: ipRisk.risk,
        metadata: {
          ipInfo,
          riskScore: ipRisk.score,
          reasons: ipRisk.reasons,
        },
        createdAt: new Date(),
      });
    }

    // Check for new user agent
    const previousUAs = recentEvents.map(e => e.userAgent).filter(Boolean);
    const isNewUA = previousUAs.length === 0 || !previousUAs.includes(userAgent);
    
    if (isNewUA && UserAgentParser.isSuspicious(userAgent)) {
      alerts.push({
        type: 'SUSPICIOUS_USER_AGENT',
        userId,
        message: 'Login from suspicious user agent',
        severity: 'MEDIUM',
        metadata: {
          userAgent,
          parsed: parsedUA,
        },
        createdAt: new Date(),
      });
    }

    // Check for rapid location changes
    if (previousIps.length > 0) {
      const locationChange = await this.detectLocationChange(previousIps, ipAddress);
      if (locationChange.isSignificant) {
        alerts.push({
          type: 'RAPID_LOCATION_CHANGE',
          userId,
          message: `Rapid location change detected: ${locationChange.from} → ${locationChange.to}`,
          severity: 'HIGH',
          metadata: locationChange,
          createdAt: new Date(),
        });
      }
    }

    // Check for concurrent sessions from different locations
    const concurrentSessions = await this.getConcurrentSessionLocations(userId, sessionId);
    if (concurrentSessions.length > 1) {
      alerts.push({
        type: 'CONCURRENT_LOCATIONS',
        userId,
        message: `Concurrent sessions from ${concurrentSessions.length} different locations`,
        severity: 'MEDIUM',
        metadata: { locations: concurrentSessions },
        createdAt: new Date(),
      });
    }

    // Determine overall risk
    const risk = alerts.length === 0 ? 'LOW' : 
                 alerts.some(a => a.severity === 'HIGH' || a.severity === 'CRITICAL') ? 'HIGH' : 'MEDIUM';

    return { risk, alerts };
  }

  /**
   * Detect failed login attempts
   */
  async detectFailedLoginAttempts(userId: string, ipAddress: string): Promise<{
    isBruteForce: boolean;
    attempts: number;
    alerts: SecurityAlert[];
  }> {
    const key = `failed_attempts:${userId}:${ipAddress}`;
    const attempts = await this.redisService.get(key);
    const count = attempts ? parseInt(attempts) : 0;

    const alerts: SecurityAlert[] = [];
    let isBruteForce = false;

    if (count >= this.THRESHOLD_SUSPICIOUS_LOGIN_ATTEMPTS) {
      isBruteForce = true;
      alerts.push({
        type: 'BRUTE_FORCE_DETECTED',
        userId,
        message: `Multiple failed login attempts detected: ${count} attempts`,
        severity: 'CRITICAL',
        metadata: { attempts: count, ipAddress },
        createdAt: new Date(),
      });
    }

    return { isBruteForce, attempts: count, alerts };
  }

  /**
   * Increment failed login counter
   */
  async incrementFailedAttempts(userId: string, ipAddress: string): Promise<void> {
    const key = `failed_attempts:${userId}:${ipAddress}`;
    const current = await this.redisService.get(key);
    const count = current ? parseInt(current) + 1 : 1;

    await this.redisService.set(key, count.toString(), this.THRESHOLD_FAILED_ATTEMPTS_WINDOW / 1000);

    // Log failed attempt
    await this.logAuthEvent({
      userId,
      event: 'LOGIN_FAILED',
      severity: count >= this.THRESHOLD_SUSPICIOUS_LOGIN_ATTEMPTS ? 'HIGH' : 'MEDIUM',
      details: { attempts: count, ipAddress },
      ipAddress,
      timestamp: new Date(),
    } as SecurityEvent);
  }

  /**
   * Reset failed login counter on successful login
   */
  async resetFailedAttempts(userId: string, ipAddress: string): Promise<void> {
    const key = `failed_attempts:${userId}:${ipAddress}`;
    await this.redisService.del(key);
  }

  /**
   * Get recent authentication events for user
   */
  async getRecentAuthEvents(userId: string, eventType?: string, limit: number = 20): Promise<SecurityEvent[]> {
    const key = `auth_events:${userId}`;
    const eventsData = await this.redisService.get(key);
    
    if (!eventsData) {
      return [];
    }

    const events = JSON.parse(eventsData);
    let filteredEvents = eventType ? events.filter((e: SecurityEvent) => e.event === eventType) : events;
    
    return filteredEvents.slice(-limit).reverse();
  }

  /**
   * Analyze security patterns
   */
  private async analyzeSecurityPattern(userId: string, events: SecurityEvent[]): Promise<void> {
    // Count events by severity in last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentEvents = events.filter(e => e.timestamp.getTime() > oneHourAgo);
    
    const highSeverityCount = recentEvents.filter(e => 
      e.severity === 'HIGH' || e.severity === 'CRITICAL'
    ).length;

    if (highSeverityCount >= 3) {
      await this.createSecurityAlert({
        type: 'MULTIPLE_HIGH_RISK_EVENTS',
        userId,
        message: `Multiple high-risk security events detected: ${highSeverityCount} events`,
        severity: 'HIGH',
        metadata: { events: recentEvents.slice(-5) },
        createdAt: new Date(),
      });
    }
  }

  /**
   * Detect location changes
   */
  private async detectLocationChange(previousIps: string[], currentIp: string): Promise<{
    isSignificant: boolean;
    from?: string;
    to?: string;
    distance?: number;
  }> {
    if (previousIps.length === 0) {
      return { isSignificant: false };
    }

    const lastIp = previousIps[previousIps.length - 1];
    const lastCountry = await IpUtils.getIpCountry(lastIp);
    const currentCountry = await IpUtils.getIpCountry(currentIp);

    if (lastCountry && currentCountry && lastCountry !== currentCountry) {
      return {
        isSignificant: true,
        from: lastCountry,
        to: currentCountry,
        distance: -1, // Calculate actual distance in production
      };
    }

    return { isSignificant: false };
  }

  /**
   * Get concurrent session locations
   */
  private async getConcurrentSessionLocations(userId: string, currentSessionId: string): Promise<string[]> {
    // This would be implemented with session management service
    // For now, return empty array
    return [];
  }

  /**
   * Create security alert
   */
  private async createSecurityAlert(alert: SecurityAlert): Promise<void> {
    // Store alert in database or alerting system
    this.logger.warn(`Security Alert: ${alert.type} for user ${alert.userId}`, alert);

    // In production, integrate with alerting system (email, Slack, etc.)
    
    // Store in Redis for quick access
    const key = `security_alerts:${alert.userId}`;
    const existingAlerts = await this.redisService.get(key);
    const alerts = existingAlerts ? JSON.parse(existingAlerts) : [];
    
    alerts.push(alert);
    
    // Keep only recent alerts
    if (alerts.length > 50) {
      alerts.splice(0, alerts.length - 50);
    }
    
    await this.redisService.set(key, JSON.stringify(alerts), 24 * 60 * 60);
  }

  /**
   * Get security alerts for user
   */
  async getSecurityAlerts(userId: string, limit: number = 20): Promise<SecurityAlert[]> {
    const key = `security_alerts:${userId}`;
    const alertsData = await this.redisService.get(key);
    
    if (!alertsData) {
      return [];
    }

    const alerts = JSON.parse(alertsData);
    return alerts.slice(-limit).reverse();
  }
}