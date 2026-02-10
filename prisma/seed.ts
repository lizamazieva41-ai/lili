import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.usageLog.deleteMany();
  await prisma.authAuditLog.deleteMany();
  await prisma.securityAlert.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();

  await prisma.queueMetric.deleteMany();
  await prisma.jobLog.deleteMany();
  await prisma.jobMetric.deleteMany();
  await prisma.jobDependency.deleteMany();
  await prisma.jobExecution.deleteMany();
  await prisma.job.deleteMany();
  await prisma.queue.deleteMany();

  await prisma.licenseMetrics.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.apiKeyUsage.deleteMany();
  await prisma.usageLog.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.license.deleteMany();

  await prisma.proxyMetric.deleteMany();
  await prisma.proxyUsageStats.deleteMany();
  await prisma.proxyHealthLog.deleteMany();
  await prisma.accountProxyAssignment.deleteMany();
  await prisma.proxy.deleteMany();

  await prisma.sessionActivity.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        telegramId: 1000001,
        username: 'admin',
        email: 'admin@telegram-platform.com',
        firstName: 'Admin',
        lastName: 'User',
        language: 'en',
        isActive: true,
        emailVerified: true,
        accountLevel: 'ENTERPRISE',
        reputation: 100,
        settings: {
          theme: 'dark',
          notifications: true,
          twoFactor: false
        }
      }
    }),
    prisma.user.create({
      data: {
        telegramId: 1000002,
        username: 'premium_user',
        email: 'premium@telegram-platform.com',
        firstName: 'Premium',
        lastName: 'User',
        language: 'en',
        isActive: true,
        emailVerified: true,
        accountLevel: 'PREMIUM',
        reputation: 85,
        settings: {
          theme: 'light',
          notifications: true,
          twoFactor: false
        }
      }
    }),
    prisma.user.create({
      data: {
        telegramId: 1000003,
        username: 'basic_user',
        email: 'basic@telegram-platform.com',
        firstName: 'Basic',
        lastName: 'User',
        language: 'en',
        isActive: true,
        emailVerified: true,
        accountLevel: 'BASIC',
        reputation: 60,
        settings: {
          theme: 'light',
          notifications: false,
          twoFactor: false
        }
      }
    })
  ]);

  console.log(`👥 Created ${users.length} users`);

  // Create licenses for users
  const licenses = await Promise.all([
    prisma.license.create({
      data: {
        userId: users[0].id,
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        billingCycle: 'YEARLY',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        features: {
          unlimited_accounts: true,
          unlimited_messages: true,
          advanced_analytics: true,
          priority_support: true,
          custom_integrations: true,
          api_access: true,
          webhooks: true
        },
        limits: {
          accounts: 999999,
          messages_per_day: 999999,
          api_calls_per_hour: 10000,
          storage_gb: 1000,
          bandwidth_gb: 10000
        },
        usage: {
          accounts: 0,
          messages_today: 0,
          api_calls_this_hour: 0,
          storage_used_gb: 0,
          bandwidth_used_gb: 0
        }
      }
    }),
    prisma.license.create({
      data: {
        userId: users[1].id,
        plan: 'PREMIUM',
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: {
          multiple_accounts: true,
          bulk_messaging: true,
          analytics: true,
          email_support: true,
          api_access: true,
          basic_webhooks: true
        },
        limits: {
          accounts: 50,
          messages_per_day: 10000,
          api_calls_per_hour: 1000,
          storage_gb: 100,
          bandwidth_gb: 500
        },
        usage: {
          accounts: 0,
          messages_today: 0,
          api_calls_this_hour: 0,
          storage_used_gb: 0,
          bandwidth_used_gb: 0
        }
      }
    }),
    prisma.license.create({
      data: {
        userId: users[2].id,
        plan: 'BASIC',
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: {
          single_account: true,
          basic_messaging: true,
          simple_analytics: true,
          community_support: true
        },
        limits: {
          accounts: 1,
          messages_per_day: 100,
          api_calls_per_hour: 100,
          storage_gb: 10,
          bandwidth_gb: 50
        },
        usage: {
          accounts: 0,
          messages_today: 0,
          api_calls_this_hour: 0,
          storage_used_gb: 0,
          bandwidth_used_gb: 0
        }
      }
    })
  ]);

  console.log(`💳 Created ${licenses.length} licenses`);

  // Create API keys
  const apiKeys = await Promise.all([
    prisma.apiKey.create({
      data: {
        licenseId: licenses[0].id,
        name: 'Enterprise API Key',
        key: generateApiKey(),
        keyHash: await hashApiKey('enterprise-key-hash'),
        permissions: {
          permissions: ['read', 'write', 'delete', 'admin'],
          resources: ['accounts', 'campaigns', 'messages', 'analytics', 'users']
        },
        rateLimit: {
          requestsPerMinute: 10000,
          requestsPerHour: 100000,
          requestsPerDay: 1000000
        },
        isActive: true,
        usageLimit: 1000000,
        usagePeriod: 'daily'
      }
    }),
    prisma.apiKey.create({
      data: {
        licenseId: licenses[1].id,
        name: 'Premium API Key',
        key: generateApiKey(),
        keyHash: await hashApiKey('premium-key-hash'),
        permissions: {
          permissions: ['read', 'write'],
          resources: ['accounts', 'campaigns', 'messages', 'analytics']
        },
        rateLimit: {
          requestsPerMinute: 1000,
          requestsPerHour: 10000,
          requestsPerDay: 100000
        },
        isActive: true,
        usageLimit: 100000,
        usagePeriod: 'daily'
      }
    }),
    prisma.apiKey.create({
      data: {
        licenseId: licenses[2].id,
        name: 'Basic API Key',
        key: generateApiKey(),
        keyHash: await hashApiKey('basic-key-hash'),
        permissions: {
          permissions: ['read', 'write'],
          resources: ['accounts', 'messages']
        },
        rateLimit: {
          requestsPerMinute: 100,
          requestsPerHour: 1000,
          requestsPerDay: 10000
        },
        isActive: true,
        usageLimit: 10000,
        usagePeriod: 'daily'
      }
    })
  ]);

  console.log(`🔑 Created ${apiKeys.length} API keys`);

  // Create sample proxies
  const proxies = await Promise.all([
    prisma.proxy.create({
      data: {
        name: 'US Proxy 1',
        type: 'HTTP',
        host: '192.168.1.100',
        port: 8080,
        username: 'proxyuser1',
        password: 'proxypass1',
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        status: 'ACTIVE',
        healthScore: 95,
        responseTime: 150,
        uptime: 99.5,
        lastChecked: new Date(),
        maxConnections: 10,
        protocols: ['HTTP', 'HTTPS'],
        features: {
          anonymity: true,
          https_support: true,
          bandwidth_unlimited: false
        },
        tags: ['us', 'fast', 'premium'],
        isActive: true
      }
    }),
    prisma.proxy.create({
      data: {
        name: 'EU Proxy 1',
        type: 'SOCKS5',
        host: '192.168.1.101',
        port: 1080,
        username: 'proxyuser2',
        password: 'proxypass2',
        country: 'Germany',
        region: 'Berlin',
        city: 'Berlin',
        status: 'ACTIVE',
        healthScore: 88,
        responseTime: 200,
        uptime: 98.2,
        lastChecked: new Date(),
        maxConnections: 5,
        protocols: ['SOCKS4', 'SOCKS5'],
        features: {
          anonymity: true,
          speed: 'medium',
          bandwidth_unlimited: false
        },
        tags: ['eu', 'anonymous', 'medium'],
        isActive: true
      }
    }),
    prisma.proxy.create({
      data: {
        name: 'Asia Proxy 1',
        type: 'HTTPS',
        host: '192.168.1.102',
        port: 3128,
        username: 'proxyuser3',
        password: 'proxypass3',
        country: 'Singapore',
        region: 'Singapore',
        city: 'Singapore',
        status: 'INACTIVE',
        healthScore: 75,
        responseTime: 300,
        uptime: 95.0,
        lastChecked: new Date(),
        maxConnections: 5,
        protocols: ['HTTP', 'HTTPS'],
        features: {
          anonymity: true,
          speed: 'slow',
          bandwidth_unlimited: false
        },
        tags: ['asia', 'budget', 'slow'],
        isActive: false
      }
    })
  ]);

  console.log(`🌐 Created ${proxies.length} proxies`);

  // Create job queues
  const queues = await Promise.all([
    prisma.queue.create({
      data: {
        name: 'high-priority',
        description: 'High priority jobs queue',
        maxSize: 1000,
        maxRetries: 5,
        concurrency: 10,
        isActive: true,
        settings: {
          priority: 1,
          backoff: {
            type: 'exponential',
            delay: 1000,
            maxDelay: 30000
          }
        }
      }
    }),
    prisma.queue.create({
      data: {
        name: 'default',
        description: 'Default jobs queue',
        maxSize: 5000,
        maxRetries: 3,
        concurrency: 5,
        isActive: true,
        settings: {
          priority: 2,
          backoff: {
            type: 'fixed',
            delay: 5000,
            maxDelay: 60000
          }
        }
      }
    }),
    prisma.queue.create({
      data: {
        name: 'low-priority',
        description: 'Low priority background jobs queue',
        maxSize: 10000,
        maxRetries: 2,
        concurrency: 2,
        isActive: true,
        settings: {
          priority: 3,
          backoff: {
            type: 'linear',
            delay: 10000,
            maxDelay: 120000
          }
        }
      }
    }),
    prisma.queue.create({
      data: {
        name: 'bulk-messaging',
        description: 'Bulk messaging jobs queue',
        maxSize: 20000,
        maxRetries: 10,
        concurrency: 20,
        isActive: true,
        settings: {
          priority: 1,
          backoff: {
            type: 'exponential',
            delay: 2000,
            maxDelay: 600000
          }
        }
      }
    })
  ]);

  console.log(`📋 Created ${queues.length} job queues`);

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'SYSTEM',
        title: 'Welcome to Telegram Platform v3.0',
        message: 'Your enterprise account has been successfully created. Explore all features now!',
        data: {
          action: 'explore_features',
          features: ['accounts', 'campaigns', 'analytics', 'api']
        },
        priority: 'HIGH',
        channels: ['in_app', 'email']
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'SECURITY',
        title: 'New Login Detected',
        message: 'A new login was detected from IP address 192.168.1.1',
        data: {
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          location: 'San Francisco, CA'
        },
        priority: 'MEDIUM',
        channels: ['in_app']
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        type: 'MARKETING',
        title: 'Upgrade to Premium',
        message: 'Get unlimited accounts and advanced features with Premium plan.',
        data: {
          promotion: 'upgrade_offer',
          discount: '20%'
        },
        priority: 'LOW',
        channels: ['in_app', 'email']
      }
    })
  ]);

  console.log(`📬 Created ${notifications.length} notifications`);

  // Create sample audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: users[0].id,
        entityType: 'USER',
        entityId: users[0].id,
        action: 'CREATE',
        newValues: {
          username: 'admin',
          accountLevel: 'ENTERPRISE'
        },
        metadata: {
          source: 'seed_script',
          automated: true
        }
      }
    }),
    prisma.auditLog.create({
      data: {
        userId: users[1].id,
        entityType: 'LICENSE',
        entityId: licenses[1].id,
        action: 'CREATE',
        newValues: {
          plan: 'PREMIUM',
          billingCycle: 'MONTHLY'
        },
        metadata: {
          source: 'seed_script',
          automated: true
        }
      }
    }),
    prisma.auditLog.create({
      data: {
        entityType: 'SYSTEM',
        entityId: 'system',
        action: 'SEED',
        metadata: {
          action: 'database_seeding',
          records_created: 'initial_data'
        }
      }
    })
  ]);

  console.log(`📊 Created ${auditLogs.length} audit logs`);

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Licenses: ${licenses.length}`);
  console.log(`   API Keys: ${apiKeys.length}`);
  console.log(`   Proxies: ${proxies.length}`);
  console.log(`   Queues: ${queues.length}`);
  console.log(`   Notifications: ${notifications.length}`);
  console.log(`   Audit Logs: ${auditLogs.length}`);
  console.log('\n🔐 Test API Keys:');
  apiKeys.forEach((key, index) => {
    console.log(`   ${index + 1}. ${key.name}: ${key.key}`);
  });
}

function generateApiKey(): string {
  return `tg_${randomBytes(16).toString('hex')}`;
}

async function hashApiKey(key: string): Promise<string> {
  // Simple hash for demo - in production use proper hashing
  return `hashed_${key}`;
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });