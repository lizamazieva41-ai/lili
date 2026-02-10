/**
 * Utility for sanitizing sensitive data in logs
 * Prevents passwords, keys, secrets, and sensitive session data from appearing in logs
 */

export interface SanitizeOptions {
  /**
   * Fields to always sanitize (blacklist)
   */
  blacklist?: string[];
  /**
   * Fields to never sanitize (whitelist)
   */
  whitelist?: string[];
  /**
   * Replacement string for sanitized values
   */
  replacement?: string;
  /**
   * Maximum length of non-sensitive values to log
   */
  maxLength?: number;
}

const DEFAULT_OPTIONS: Required<SanitizeOptions> = {
  blacklist: [
    'password',
    'passwd',
    'secret',
    'token',
    'key',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'authorization',
    'auth',
    'credentials',
    'encryptionKey',
    'encryption_key',
    'privateKey',
    'private_key',
    'sessionData',
    'session_data',
    'session',
    'cookie',
    'jwt',
  ],
  whitelist: [],
  replacement: '***',
  maxLength: 100,
};

/**
 * Check if a field name should be sanitized
 */
function shouldSanitize(fieldName: string, options: Required<SanitizeOptions>): boolean {
  const lowerName = fieldName.toLowerCase();

  // Check whitelist first
  if (options.whitelist.some((w) => lowerName.includes(w.toLowerCase()))) {
    return false;
  }

  // Check blacklist
  return options.blacklist.some((b) => lowerName.includes(b.toLowerCase()));
}

/**
 * Sanitize a value based on its type and field name
 */
function sanitizeValue(value: any, fieldName: string, options: Required<SanitizeOptions>): any {
  if (value === null || value === undefined) {
    return value;
  }

  // If field should be sanitized, replace with placeholder
  if (shouldSanitize(fieldName, options)) {
    return options.replacement;
  }

  // For strings, truncate if too long
  if (typeof value === 'string' && value.length > options.maxLength) {
    return `${value.substring(0, options.maxLength)}... (truncated)`;
  }

  return value;
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any, fieldName: string, options: Required<SanitizeOptions>, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) {
    return '[Max depth reached]';
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item, index) => sanitizeObject(item, `${fieldName}[${index}]`, options, depth + 1));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = fieldName ? `${fieldName}.${key}` : key;
      
      // Check if this field should be sanitized
      if (shouldSanitize(key, options)) {
        sanitized[key] = options.replacement;
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeObject(value, fullKey, options, depth + 1);
      } else {
        sanitized[key] = sanitizeValue(value, key, options);
      }
    }
    return sanitized;
  }

  // Handle primitives
  return sanitizeValue(obj, fieldName, options);
}

/**
 * Sanitize sensitive data from log messages
 * 
 * @param data - Data to sanitize (object, array, or primitive)
 * @param options - Sanitization options
 * @returns Sanitized data
 * 
 * @example
 * ```typescript
 * const sanitized = sanitizeLogData({
 *   username: 'user',
 *   password: 'secret123',
 *   proxy: { host: 'proxy.com', password: 'pass' }
 * });
 * // Returns: { username: 'user', password: '***', proxy: { host: 'proxy.com', password: '***' } }
 * ```
 */
export function sanitizeLogData(data: any, options: SanitizeOptions = {}): any {
  const opts: Required<SanitizeOptions> = {
    blacklist: options.blacklist || DEFAULT_OPTIONS.blacklist,
    whitelist: options.whitelist || DEFAULT_OPTIONS.whitelist,
    replacement: options.replacement || DEFAULT_OPTIONS.replacement,
    maxLength: options.maxLength || DEFAULT_OPTIONS.maxLength,
  };

  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitives
  if (typeof data !== 'object') {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item, '', opts, 0));
  }

  // Handle objects
  return sanitizeObject(data, '', opts, 0);
}

/**
 * Sanitize a string message that might contain sensitive data
 * Uses regex patterns to find and replace common sensitive patterns
 */
export function sanitizeLogMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return message;
  }

  // Patterns to match and replace
  const patterns: Array<{ pattern: RegExp; replacement: string }> = [
    // Passwords in various formats
    { pattern: /password["\s:=]+([^\s"',}]+)/gi, replacement: 'password=***' },
    { pattern: /passwd["\s:=]+([^\s"',}]+)/gi, replacement: 'passwd=***' },
    { pattern: /pwd["\s:=]+([^\s"',}]+)/gi, replacement: 'pwd=***' },
    
    // API keys and tokens
    { pattern: /api[_-]?key["\s:=]+([^\s"',}]+)/gi, replacement: 'api_key=***' },
    { pattern: /access[_-]?token["\s:=]+([^\s"',}]+)/gi, replacement: 'access_token=***' },
    { pattern: /refresh[_-]?token["\s:=]+([^\s"',}]+)/gi, replacement: 'refresh_token=***' },
    { pattern: /bearer\s+[\w-]+/gi, replacement: 'bearer ***' },
    
    // Secrets
    { pattern: /secret["\s:=]+([^\s"',}]+)/gi, replacement: 'secret=***' },
    { pattern: /encryption[_-]?key["\s:=]+([^\s"',}]+)/gi, replacement: 'encryption_key=***' },
    
    // Session data (partial)
    { pattern: /session[_-]?data["\s:=]+({[^}]{0,50})/gi, replacement: 'session_data={***}' },
  ];

  let sanitized = message;
  for (const { pattern, replacement } of patterns) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  return sanitized;
}

/**
 * Create a sanitized version of an object for logging
 * Only includes safe fields and sanitizes sensitive ones
 */
export function createSafeLogObject(obj: any, safeFields: string[] = []): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const safe: any = {};
  
  // Always include these safe fields
  const defaultSafeFields = ['id', 'name', 'type', 'status', 'createdAt', 'updatedAt', 'host', 'port', 'protocol'];
  const allSafeFields = [...new Set([...defaultSafeFields, ...safeFields])];

  for (const key of Object.keys(obj)) {
    if (allSafeFields.includes(key)) {
      safe[key] = obj[key];
    } else if (shouldSanitize(key, DEFAULT_OPTIONS)) {
      safe[key] = DEFAULT_OPTIONS.replacement;
    }
  }

  return safe;
}
