# Migration Guide: Enabling Session Encryption

## Overview

This guide helps you migrate from unencrypted to encrypted session storage for TDLib sessions.

## Prerequisites

- Encryption service configured with `ENCRYPTION_KEY`
- Database access to `AccountSession` table
- Redis access for session data

## Migration Steps

### Step 1: Enable Encryption (Gradual Rollout)

1. **Set environment variable**
   ```bash
   TDLIB_SESSION_ENCRYPTION_ENABLED=true
   ```

2. **Restart application**
   - New sessions will be encrypted automatically
   - Old sessions will remain unencrypted until accessed

### Step 2: Migrate Existing Sessions

Run the migration script to encrypt existing sessions:

```bash
# Create migration script
cat > scripts/migrate-sessions-to-encrypted.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../src/common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

const prisma = new PrismaClient();
const configService = new ConfigService();
const encryptionService = new EncryptionService(configService);

async function migrateSessions() {
  console.log('Starting session migration...');
  
  const sessions = await prisma.accountSession.findMany({
    where: {
      isActive: true,
    },
  });

  let migrated = 0;
  let errors = 0;

  for (const session of sessions) {
    try {
      const sessionData = session.sessionData as any;
      
      // Skip if already encrypted
      if (sessionData.encrypted) {
        continue;
      }

      // Reconstruct session object
      const sessionObj = {
        clientId: sessionData.clientId,
        userId: sessionData.userId,
        accountId: session.accountId,
        phoneNumber: sessionData.phoneNumber,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        lastActivityAt: session.lastUsedAt?.toISOString(),
      };

      // Encrypt session data
      const encrypted = encryptionService.encrypt(JSON.stringify(sessionObj));

      // Update database
      await prisma.accountSession.update({
        where: { id: session.id },
        data: {
          sessionData: { encrypted },
        },
      });

      migrated++;
      
      if (migrated % 100 === 0) {
        console.log(`Migrated ${migrated} sessions...`);
      }
    } catch (error) {
      console.error(`Error migrating session ${session.id}:`, error);
      errors++;
    }
  }

  console.log(`Migration complete: ${migrated} migrated, ${errors} errors`);
  await prisma.$disconnect();
}

migrateSessions();
EOF

# Run migration
npx ts-node scripts/migrate-sessions-to-encrypted.ts
```

### Step 3: Verify Migration

1. **Check Redis sessions**
   ```bash
   redis-cli KEYS "tdlib:session:*" | head -5 | xargs -I {} redis-cli GET {}
   ```
   - Should see encrypted data (hex strings with colons)

2. **Check database sessions**
   ```sql
   SELECT id, session_data->>'encrypted' IS NOT NULL as is_encrypted
   FROM "AccountSession"
   WHERE is_active = true
   LIMIT 10;
   ```
   - All should be `true`

### Step 4: Cleanup

After verifying migration:

1. **Remove migration script**
   ```bash
   rm scripts/migrate-sessions-to-encrypted.ts
   ```

2. **Monitor for issues**
   - Watch logs for decryption errors
   - Monitor session creation/access rates

## Rollback Procedure

If issues occur:

1. **Disable encryption**
   ```bash
   TDLIB_SESSION_ENCRYPTION_ENABLED=false
   ```

2. **Restart application**
   - New sessions will be unencrypted
   - Old encrypted sessions will be decrypted on access

3. **Revert database (if needed)**
   ```sql
   -- This would require restoring from backup
   -- Or re-running migration to decrypt
   ```

## Proxy Password Migration

Proxy passwords are automatically encrypted when:
- Creating new proxies
- Updating existing proxies

To migrate existing plaintext passwords:

```typescript
// Run once to encrypt existing passwords
const proxies = await prisma.proxy.findMany({
  where: {
    password: { not: null },
  },
});

for (const proxy of proxies) {
  // Check if already encrypted
  if (encryptionService.isEncrypted(proxy.password)) {
    continue;
  }
  
  // Encrypt and update
  await prisma.proxy.update({
    where: { id: proxy.id },
    data: {
      password: encryptionService.encrypt(proxy.password),
    },
  });
}
```

## Troubleshooting

### Issue: Decryption errors

**Symptoms**: Logs show "Failed to decrypt session data"

**Solution**:
1. Verify `ENCRYPTION_KEY` is correct
2. Check if key was rotated
3. Ensure all instances use same key

### Issue: Sessions not accessible

**Symptoms**: Sessions exist but can't be retrieved

**Solution**:
1. Check Redis connectivity
2. Verify TTL hasn't expired
3. Check encryption/decryption logs

### Issue: Performance degradation

**Symptoms**: Slower session operations

**Solution**:
1. Monitor encryption overhead
2. Consider caching decrypted sessions
3. Optimize encryption key access

## Best Practices

1. **Test migration in staging first**
2. **Backup database before migration**
3. **Monitor metrics during migration**
4. **Have rollback plan ready**
5. **Document encryption key location**

## Security Notes

- Never commit encryption keys to version control
- Rotate keys periodically (every 90 days recommended)
- Use different keys for different environments
- Store keys in secure secret management system
