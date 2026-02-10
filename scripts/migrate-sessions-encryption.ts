/**
 * Migration script to encrypt existing TDLib sessions
 * 
 * Usage:
 *   npx ts-node scripts/migrate-sessions-encryption.ts
 * 
 * Prerequisites:
 *   - ENCRYPTION_KEY environment variable set
 *   - Database accessible
 *   - Redis accessible (optional, will migrate DB backups)
 */

import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../src/common/services/encryption.service';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const configService = new ConfigService();
const encryptionService = new EncryptionService(configService);

interface SessionData {
  clientId: string;
  phoneNumber?: string;
  userId?: string;
  accountId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
}

async function migrateSessions() {
  console.log('=== TDLib Session Encryption Migration ===\n');

  // Check encryption key
  const encryptionKey = configService.get<string>('ENCRYPTION_KEY');
  if (!encryptionKey) {
    console.error('❌ ERROR: ENCRYPTION_KEY environment variable not set');
    console.error('   Generate with: openssl rand -hex 32');
    process.exit(1);
  }

  if (encryptionKey.length < 64) {
    console.warn('⚠️  WARNING: ENCRYPTION_KEY seems too short');
  }

  console.log('✅ Encryption key configured\n');

  try {
    // Get all active sessions from database
    console.log('Fetching sessions from database...');
    const sessions = await prisma.accountSession.findMany({
      where: {
        isActive: true,
      },
      include: {
        account: true,
      },
    });

    console.log(`Found ${sessions.length} active sessions\n`);

    if (sessions.length === 0) {
      console.log('✅ No sessions to migrate');
      await prisma.$disconnect();
      return;
    }

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const session of sessions) {
      try {
        const sessionData = session.sessionData as any;

        // Skip if already encrypted
        if (sessionData.encrypted) {
          skipped++;
          continue;
        }

        // Reconstruct session object from legacy format
        const sessionObj: SessionData = {
          clientId: sessionData.clientId,
          userId: sessionData.userId,
          accountId: session.accountId,
          phoneNumber: sessionData.phoneNumber || session.account.phone,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
          lastActivityAt: session.lastUsedAt?.toISOString(),
        };

        // Encrypt session data
        const encrypted = encryptionService.encrypt(JSON.stringify(sessionObj));

        // Update database with encrypted data
        await prisma.accountSession.update({
          where: { id: session.id },
          data: {
            sessionData: { encrypted },
          },
        });

        migrated++;

        if (migrated % 10 === 0) {
          console.log(`  Migrated ${migrated} sessions...`);
        }
      } catch (error) {
        console.error(`  ❌ Error migrating session ${session.id}:`, error);
        errors++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already encrypted): ${skipped}`);
    console.log(`Errors: ${errors}`);

    if (errors > 0) {
      console.log('\n⚠️  Some sessions failed to migrate. Review errors above.');
    } else {
      console.log('\n✅ Migration completed successfully');
    }

    console.log('\nNote: Redis sessions will be encrypted on next access.');
    console.log('      To force re-encryption, restart the application.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateSessions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
