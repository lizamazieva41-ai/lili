# TDLib Client Lifecycle Management

## Overview

This document describes the lifecycle management of TDLib clients, sessions, and accounts in the telegram-platform-backend.

## Lifecycle Components

### 1. Account Lifecycle

#### Account Creation
```
User creates account
  → AccountsService.create()
  → Create TelegramAccount record
  → Assign proxy (if provided)
  → Trigger TDLib auth (if autoAuth=true)
  → TdlibAuthService.requestCode()
  → Create TDLib client
  → Create session in TdlibSessionStore
```

**Implementation**:
```typescript
// In AccountsService.create()
const account = await this.prisma.telegramAccount.create({...});

if (autoAuth && this.tdlibService.isReady()) {
  await this.tdlibAuthService.requestCode(phone, userId);
}
```

#### Account Update
```
User updates account
  → AccountsService.update()
  → Update TelegramAccount record
  → Sync session metadata if needed (optional)
```

**Note**: Account updates don't automatically affect TDLib sessions unless explicitly needed.

#### Account Deletion
```
User deletes account
  → AccountsService.remove()
  → Revoke all TDLib sessions (TdlibSessionStore.revokeAccountSessions)
  → Destroy TDLib clients (TdlibService.destroyClient)
  → Delete TelegramAccount record
```

**Implementation**:
```typescript
// In AccountsService.remove()
await this.tdlibSessionStore.revokeAccountSessions(id);
await this.prisma.telegramAccount.delete({ where: { id } });
```

### 2. TDLib Client Lifecycle

#### Client Creation
```
TDLib client needed
  → TdlibService.createClient()
  → Load native addon
  → Create client via addon
  → Store in clients Map
  → Setup proxy (if account has proxy)
  → Start update polling (if enabled)
```

**Implementation**:
```typescript
// In TdlibService.createClient()
const client = await this.addon.createClient(config);
this.clients.set(clientId, client);
await this.setupProxyForClient(clientId, accountId);
```

#### Client Destruction
```
Client no longer needed
  → TdlibService.destroyClient()
  → Stop update polling for client
  → Destroy client via addon
  → Remove from clients Map
  → Revoke session
```

**Implementation**:
```typescript
// In TdlibService.destroyClient()
await this.updatePollingService.stopPolling(clientId);
await this.addon.destroyClient(clientId);
this.clients.delete(clientId);
await this.sessionStore.revokeSession(clientId);
```

#### Application Shutdown
```
Application shutting down
  → TdlibService.onModuleDestroy()
  → Destroy all clients
  → TdlibUpdatePollingService.onModuleDestroy()
  → Stop all polling
```

### 3. Session Lifecycle

#### Session Creation
```
Session created
  → TdlibAuthService creates client
  → TdlibSessionStore.saveSession()
  → Store in Redis (primary)
  → Backup to database (if enabled)
  → Encrypt session data (if enabled)
```

**Session Data Structure**:
```typescript
interface TdlibSession {
  clientId: string;
  accountId?: string;
  phoneNumber?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  revokedAt?: string;
}
```

#### Session Update
```
Session activity
  → TdlibService.send() or receive update
  → TdlibSessionStore.updateLastActivity()
  → Update Redis TTL
  → Update database backup (if enabled)
```

#### Session Expiration
```
Session expires
  → TdlibSessionCleanupService runs (scheduled)
  → Find expired sessions
  → Revoke sessions
  → Destroy clients
  → Clean up database records
```

**Configuration**:
- `TDLIB_SESSION_TTL_SECONDS`: Session TTL (default: 7 days)
- `TDLIB_SESSION_CLEANUP_ENABLED`: Enable cleanup (default: true)
- `TDLIB_SESSION_CLEANUP_INTERVAL_MS`: Cleanup interval (default: 1 hour)

#### Session Revocation
```
Session revoked
  → TdlibSessionStore.revokeSession()
  → Mark revokedAt timestamp
  → Update Redis
  → Mark inactive in database
  → Destroy client (if still exists)
```

### 4. Authentication Lifecycle

#### Phone Code Request
```
User requests code
  → TdlibAuthService.requestCode()
  → Create TDLib client
  → Send setAuthenticationPhoneNumber
  → Wait for updateAuthorizationState
  → Return code delivery method
```

#### Code Confirmation
```
User confirms code
  → TdlibAuthService.confirmCode()
  → Send checkAuthenticationCode
  → Wait for updateAuthorizationState
  → Handle 2FA if needed
  → Link account with session
```

#### 2FA Password
```
User enters 2FA password
  → TdlibAuthService.confirmPassword()
  → Send checkAuthenticationPassword
  → Wait for authorizationStateReady
  → Link account with session
  → Update account status to ACTIVE
```

## Lifecycle Hooks

### Module Lifecycle

#### OnModuleInit
- **TdlibService**: Load native addon, verify library
- **TdlibUpdatePollingService**: Start polling (if enabled)

#### OnModuleDestroy
- **TdlibService**: Destroy all clients
- **TdlibUpdatePollingService**: Stop all polling

### Account Lifecycle Hooks

#### After Account Creation
```typescript
// In AccountsService.create()
// Automatically trigger auth if autoAuth=true
if (autoAuth) {
  await this.tdlibAuthService.requestCode(phone, userId);
}
```

#### Before Account Deletion
```typescript
// In AccountsService.remove()
// Cleanup sessions before deletion
await this.tdlibSessionStore.revokeAccountSessions(id);
```

### Session Lifecycle Hooks

#### After Session Creation
- Link account with session
- Setup proxy if account has one
- Start update polling

#### Before Session Revocation
- Stop update polling
- Destroy client
- Mark session as revoked

## Error Handling

### Client Creation Errors
- **Library not found**: Log error, return null
- **Addon not loaded**: Log error, return null
- **Client creation fails**: Log error, throw exception

### Session Errors
- **Redis unavailable**: Fallback to database (if enabled)
- **Database unavailable**: Continue with Redis only
- **Encryption fails**: Log error, store unencrypted (if fallback enabled)

### Cleanup Errors
- **Cleanup job fails**: Log error, continue with next session
- **Client destruction fails**: Log error, continue cleanup

## Best Practices

### 1. Always Cleanup on Deletion
```typescript
// ✅ Good: Cleanup before deletion
await this.tdlibSessionStore.revokeAccountSessions(id);
await this.prisma.telegramAccount.delete({ where: { id } });

// ❌ Bad: Delete without cleanup
await this.prisma.telegramAccount.delete({ where: { id } });
```

### 2. Use Lifecycle Hooks
```typescript
// ✅ Good: Use OnModuleDestroy
onModuleDestroy() {
  for (const client of this.clients.values()) {
    this.destroyClient(client.id);
  }
}

// ❌ Bad: Rely on garbage collection
// Clients may not be properly destroyed
```

### 3. Handle Errors Gracefully
```typescript
// ✅ Good: Log and continue
try {
  await this.destroyClient(clientId);
} catch (error) {
  this.logger.error('Failed to destroy client', { clientId, error });
  // Continue with cleanup
}

// ❌ Bad: Let errors propagate
await this.destroyClient(clientId); // May throw
```

### 4. Update Activity Timestamps
```typescript
// ✅ Good: Update on activity
await this.sessionStore.updateLastActivity(clientId);

// ❌ Bad: Forget to update
// Session may expire prematurely
```

## Monitoring

### Metrics
- `tdlib_active_clients` - Current active clients
- `tdlib_sessions_total` - Total sessions
- `tdlib_sessions_expired_total` - Expired sessions
- `tdlib_clients_destroyed_total` - Destroyed clients

### Logs
All lifecycle events should be logged:
- Client creation/destruction
- Session creation/revocation
- Account lifecycle events
- Cleanup operations

## Configuration

### Session TTL
```env
TDLIB_SESSION_TTL_SECONDS=604800  # 7 days
```

### Cleanup
```env
TDLIB_SESSION_CLEANUP_ENABLED=true
TDLIB_SESSION_CLEANUP_INTERVAL_MS=3600000  # 1 hour
```

### Database Backup
```env
TDLIB_SESSION_DB_BACKUP=true
```

### Encryption
```env
TDLIB_SESSION_ENCRYPTION_ENABLED=true
ENCRYPTION_KEY=<64-char-hex-string>
```

## Testing

### Unit Tests
Test lifecycle methods:
```typescript
describe('Account Lifecycle', () => {
  it('should cleanup sessions on account deletion', async () => {
    const account = await accountsService.create(...);
    await accountsService.remove(account.id, userId);
    // Verify sessions revoked
  });
});
```

### Integration Tests
Test end-to-end lifecycle:
```typescript
describe('Client Lifecycle Integration', () => {
  it('should create and destroy client properly', async () => {
    const client = await tdlibService.createClient();
    await tdlibService.destroyClient(client.id);
    // Verify client destroyed
  });
});
```

---

**Last Updated**: 2026-01-27
