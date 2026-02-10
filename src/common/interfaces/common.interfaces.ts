export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  statusCode?: number;
  message?: string;
  details?: any;
  timestamp: string;
  path: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  id: string;
  telegramId: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  telegramId: number;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface SessionData {
  userId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
}

export interface ProxyConfig {
  id: string;
  type: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
  region?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'TESTING';
  healthScore: number;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobData {
  type: 'MESSAGE_SEND' | 'ACCOUNT_HEALTH_CHECK' | 'PROXY_TEST' | 'CAMPAIGN_EXECUTE' | 'WEBHOOK_SEND';
  data: any;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  priority: number;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: any;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseInfo {
  id: string;
  userId: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  expiresAt?: Date;
  features: string[];
  limits: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}