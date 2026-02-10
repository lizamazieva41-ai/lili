export interface ParsedUserAgent {
  browser?: string;
  version?: string;
  os?: string;
  device?: string;
  isBot: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export class UserAgentParser {
  static parse(userAgent: string): ParsedUserAgent {
    if (!userAgent) {
      return {
        isBot: false,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
      };
    }

    const ua = userAgent.toLowerCase();
    
    // Bot detection
    const isBot = /bot|crawler|spider|crawling|facebook|twitter|google|yahoo|bing/i.test(ua);
    
    // Mobile detection
    const isMobile = /mobile|android|iphone|ipod|blackberry|opera mini|windows phone/i.test(ua);
    
    // Tablet detection
    const isTablet = /ipad|tablet|playbook|silk|kindle|nexus/i.test(ua);
    
    // Desktop detection (if not mobile or tablet)
    const isDesktop = !isMobile && !isTablet && !isBot;

    // Browser detection
    let browser = 'Unknown';
    let version = '';

    if (ua.includes('chrome')) {
      browser = 'Chrome';
      const match = ua.match(/chrome\/(\d+)/);
      version = match ? match[1] : '';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
      const match = ua.match(/firefox\/(\d+)/);
      version = match ? match[1] : '';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser = 'Safari';
      const match = ua.match(/safari\/(\d+)/);
      version = match ? match[1] : '';
    } else if (ua.includes('edge')) {
      browser = 'Edge';
      const match = ua.match(/edge\/(\d+)/);
      version = match ? match[1] : '';
    } else if (ua.includes('opera')) {
      browser = 'Opera';
      const match = ua.match(/opera\/(\d+)/);
      version = match ? match[1] : '';
    }

    // OS detection
    let os = 'Unknown';
    if (ua.includes('windows')) {
      os = 'Windows';
    } else if (ua.includes('mac')) {
      os = 'macOS';
    } else if (ua.includes('linux')) {
      os = 'Linux';
    } else if (ua.includes('android')) {
      os = 'Android';
    } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
      os = 'iOS';
    }

    // Device detection
    let device = 'Desktop';
    if (isMobile && !isTablet) {
      device = 'Mobile';
    } else if (isTablet) {
      device = 'Tablet';
    } else if (isBot) {
      device = 'Bot';
    }

    return {
      browser,
      version,
      os,
      device,
      isBot,
      isMobile,
      isTablet,
      isDesktop,
    };
  }

  static getDeviceCategory(parsed: ParsedUserAgent): string {
    if (parsed.isBot) return 'Bot';
    if (parsed.isTablet) return 'Tablet';
    if (parsed.isMobile) return 'Mobile';
    if (parsed.isDesktop) return 'Desktop';
    return 'Unknown';
  }

  static isSuspicious(userAgent: string): boolean {
    const parsed = this.parse(userAgent);
    
    // Very suspicious user agents
    const suspiciousPatterns = [
      /^$/,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /node/i,
      /go-http-client/i,
      /postman/i,
      /insomnia/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent)) || 
           parsed.isBot ||
           parsed.browser === 'Unknown';
  }
}