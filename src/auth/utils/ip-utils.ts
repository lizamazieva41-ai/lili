export interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  isProxy?: boolean;
  isVPN?: boolean;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class IpUtils {
  /**
   * Extract IP from request headers
   */
  static extractIp(request: any): string {
    const forwarded = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    const clientIp = request.connection?.remoteAddress || request.socket?.remoteAddress;
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
      return realIp;
    }
    
    return clientIp || '0.0.0.0';
  }

  /**
   * Check if IP is private/internal
   */
  static isPrivateIp(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^localhost$/,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];

    return privateRanges.some(range => range.test(ip));
  }

  /**
   * Get basic IP info (simplified implementation)
   */
  static async getIpInfo(ip: string): Promise<IpInfo> {
    const info: IpInfo = {
      ip,
      risk: 'MEDIUM',
    };

    // Check if private IP
    if (this.isPrivateIp(ip)) {
      info.country = 'Local';
      info.risk = 'LOW';
      return info;
    }

    // Basic proxy detection (simplified)
    if (this.isLikelyProxy(ip)) {
      info.isProxy = true;
      info.risk = 'HIGH';
    }

    // In production, integrate with real IP geolocation service
    // For now, return basic info
    return info;
  }

  /**
   * Basic proxy detection
   */
  static isLikelyProxy(ip: string): boolean {
    // Common proxy ranges (simplified)
    const proxyRanges = [
      /^208\.67\./,  // OpenDNS
      /^8\.8\./,     // Google DNS
      /^1\.1\.1\./,  // Cloudflare DNS
    ];

    return proxyRanges.some(range => range.test(ip));
  }

  /**
   * Calculate IP risk score
   */
  static calculateRiskScore(ip: string, previousIps: string[] = []): {
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    score: number;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let score = 0;

    // Private IPs are low risk
    if (this.isPrivateIp(ip)) {
      return {
        risk: 'LOW',
        score: 0,
        reasons: ['Private IP address'],
      };
    }

    // Check if IP is new compared to previous
    if (previousIps.length > 0 && !previousIps.includes(ip)) {
      score += 30;
      reasons.push('New IP address');
    }

    // Check proxy likelihood
    if (this.isLikelyProxy(ip)) {
      score += 50;
      reasons.push('Likely proxy/VPN');
    }

    // Check IP format validity
    if (!this.isValidIp(ip)) {
      score += 100;
      reasons.push('Invalid IP format');
    }

    // Determine risk level
    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score >= 70) {
      risk = 'HIGH';
    } else if (score >= 30) {
      risk = 'MEDIUM';
    }

    return {
      risk,
      score,
      reasons,
    };
  }

  /**
   * Validate IP format
   */
  static isValidIp(ip: string): boolean {
    // IPv4
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Normalize IP address
   */
  static normalizeIp(ip: string): string {
    // Remove port number if present
    if (ip.includes(':') && !ip.includes('.')) {
      return ip.split(':')[0];
    }
    
    // Handle IPv6 with port
    if (ip.includes(']:')) {
      return ip.split(']')[0].substring(1);
    }
    
    return ip;
  }

  /**
   * Get IP country from database/cache (simplified)
   */
  static async getIpCountry(ip: string): Promise<string | null> {
    if (this.isPrivateIp(ip)) {
      return 'Local';
    }

    // In production, integrate with MaxMind GeoIP2 or similar service
    // For now, return null
    return null;
  }
}