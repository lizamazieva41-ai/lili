# TDLib Update Mapping Conventions

## Overview

This document defines the conventions for mapping TDLib updates to domain entities and actions.

## Update Flow Architecture

```
TDLib Update → TdlibUpdatePollingService → TdlibUpdateDispatcher → Handler → Domain Service → Database
```

## Update Types and Mappings

### Message Updates

#### `updateNewMessage`
- **Handler**: `TdlibMessageUpdateHandler.handleNewMessage()`
- **Domain Action**: 
  - If `is_outgoing = true`: Update message status to `SENT`
  - If `is_outgoing = false`: Log incoming message (potential webhook trigger)
- **Database Update**: `Message.status = SENT`, `Message.metadata.telegramMessageId = message.id`

#### `updateMessageSendSucceeded`
- **Handler**: `TdlibMessageUpdateHandler.handleMessageSendSucceeded()`
- **Domain Action**: Confirm message delivery
- **Database Update**: `Message.status = SENT`, update `telegramMessageId`

#### `updateMessageSendFailed`
- **Handler**: `TdlibMessageUpdateHandler.handleMessageSendFailed()`
- **Domain Action**: Mark message as failed, trigger retry if applicable
- **Database Update**: `Message.status = FAILED`, store error in metadata

#### `updateMessageContent`
- **Handler**: `TdlibMessageUpdateHandler.handleMessageContent()`
- **Domain Action**: Message was edited
- **Database Update**: Update message content if needed

#### `updateDeleteMessages`
- **Handler**: `TdlibMessageUpdateHandler.handleDeleteMessages()`
- **Domain Action**: Messages were deleted
- **Database Update**: `Message.status = FAILED` (or create DELETED status)

### Account/User Updates

#### `updateAuthorizationState`
- **Handler**: `TdlibAccountUpdateHandler.handleAuthorizationState()`
- **Domain Action**: 
  - `authorizationStateReady` → `Account.status = ACTIVE`
  - `authorizationStateLoggingOut` → `Account.status = INACTIVE`
  - `authorizationStateClosed` → Revoke session, `Account.status = INACTIVE`
- **Database Update**: `TelegramAccount.status`

#### `updateUser`
- **Handler**: `TdlibAccountUpdateHandler.handleUserUpdate()`
- **Domain Action**: Update account info from user data
- **Database Update**: `TelegramAccount.username`, `firstName`, `lastName`, `lastActiveAt`

#### `updateUserStatus`
- **Handler**: `TdlibAccountUpdateHandler.handleUserStatus()`
- **Domain Action**: Update last active time if user is online
- **Database Update**: `TelegramAccount.lastActiveAt`

### Chat Updates

#### `updateNewChat`
- **Handler**: `TdlibChatUpdateHandler.handleNewChat()`
- **Domain Action**: Log new chat (for analytics/contact management)
- **Database Update**: Optional - could store chat info

#### `updateChatLastMessage`
- **Handler**: `TdlibChatUpdateHandler.handleChatLastMessage()`
- **Domain Action**: Track last message in chat
- **Database Update**: Optional

#### `updateChatReadOutbox`
- **Handler**: `TdlibChatUpdateHandler.handleChatReadOutbox()`
- **Domain Action**: Messages were read by recipient
- **Database Update**: Could update message status to READ (requires message ID matching)

## Mapping Rules

### 1. Message ID Matching

**Challenge**: TDLib message IDs don't directly map to our database message IDs.

**Solution**:
1. Store `telegramMessageId` in `Message.metadata` when sending
2. Match updates by:
   - `metadata.telegramMessageId` (primary)
   - Account + creation time window (fallback)

**Implementation**:
```typescript
// In TdlibMessageUpdateHandler
private async updateMessageStatusByTelegramId(
  clientId: string,
  telegramMessageId: number,
  status: MessageStatus,
  metadata?: Record<string, any>,
): Promise<void> {
  // 1. Get account from session
  const session = await this.sessionStore.getSession(clientId);
  if (!session?.accountId) return;

  // 2. Find message by telegramMessageId in metadata
  const messages = await this.prisma.message.findMany({
    where: {
      campaign: { accountId: session.accountId },
      status: { in: [MessageStatus.PENDING, MessageStatus.SENDING] },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // 3. Match by metadata.telegramMessageId
  for (const message of messages) {
    const msgMetadata = message.metadata as Record<string, any> | null;
    if (msgMetadata?.telegramMessageId === telegramMessageId) {
      await this.updateMessageStatus(message.id, status, metadata);
      return;
    }
  }
}
```

### 2. Account Status Sync

**Rule**: Account status should reflect TDLib authorization state.

**Mapping**:
- `authorizationStateReady` → `AccountStatus.ACTIVE`
- `authorizationStateLoggingOut` → `AccountStatus.INACTIVE`
- `authorizationStateClosed` → `AccountStatus.INACTIVE` + revoke session
- `authorizationStateWaitCode` → `AccountStatus.INACTIVE` (pending auth)

**Implementation**:
```typescript
// In TdlibAccountUpdateHandler
private async handleAuthorizationState(clientId: string, update: any): Promise<void> {
  const stateType = update.authorization_state?.['@type'];
  const session = await this.sessionStore.getSession(clientId);
  if (!session?.accountId) return;

  let accountStatus: AccountStatus | null = null;
  switch (stateType) {
    case 'authorizationStateReady':
      accountStatus = AccountStatus.ACTIVE;
      break;
    case 'authorizationStateLoggingOut':
    case 'authorizationStateClosed':
      accountStatus = AccountStatus.INACTIVE;
      if (stateType === 'authorizationStateClosed') {
        await this.sessionStore.revokeSession(clientId);
      }
      break;
  }

  if (accountStatus) {
    await this.updateAccountStatus(session.accountId, accountStatus);
  }
}
```

### 3. Session Lifecycle

**Rule**: Sessions should be managed per-account with proper cleanup.

**Lifecycle Events**:
1. **Account Created** → Trigger auth flow → Create session
2. **Account Deleted** → Revoke all sessions → Destroy clients
3. **Account Updated** → Sync session metadata if needed
4. **Session Expired** → Auto-cleanup by `TdlibSessionCleanupService`
5. **Session Revoked** → Mark inactive, destroy client

**Implementation**:
```typescript
// Account deletion cleanup
async remove(id: string, userId: string): Promise<void> {
  // Revoke all sessions
  await this.tdlibSessionStore.revokeAccountSessions(id);
  
  // Delete account
  await this.prisma.telegramAccount.delete({ where: { id } });
}
```

### 4. Update Idempotency

**Rule**: All update handlers must be idempotent.

**Implementation**:
- Check current status before updating
- Use database transactions where needed
- Handle duplicate updates gracefully

**Example**:
```typescript
private async updateMessageStatus(
  messageId: string,
  status: MessageStatus,
  metadata?: Record<string, any>,
): Promise<void> {
  // Check current status
  const message = await this.prisma.message.findUnique({
    where: { id: messageId },
    select: { status: true, metadata: true },
  });

  // Skip if already in target state
  if (message?.status === status) {
    return;
  }

  // Update with transaction
  await this.prisma.$transaction(async (tx) => {
    await tx.message.update({
      where: { id: messageId },
      data: { status, metadata: { ...message.metadata, ...metadata } },
    });
  });
}
```

## Error Handling

### Handler Errors

**Rule**: Handler errors should not crash the update processing loop.

**Implementation**:
```typescript
// In TdlibUpdateDispatcher
async dispatch(clientId: string, update: any): Promise<void> {
  try {
    // Route and handle
  } catch (error) {
    this.logger.error('Error dispatching update', {
      clientId,
      updateType: update['@type'],
      error: error instanceof Error ? error.message : String(error),
    });
    // Don't throw - continue processing other updates
  }
}
```

### Database Update Errors

**Rule**: Log errors but don't fail the entire update.

**Implementation**:
- Try-catch in each handler method
- Log with context
- Continue processing other updates

## Performance Considerations

### Batch Updates

**Rule**: Group related updates when possible.

**Example**: Multiple message status updates can be batched:
```typescript
// Collect updates
const updates: Array<{ messageId: string; status: MessageStatus }> = [];

// Process in batch
await this.prisma.message.updateMany({
  where: { id: { in: updates.map(u => u.messageId) } },
  data: { status: updates[0].status }, // Or use case statement
});
```

### Update Rate Limiting

**Rule**: Throttle update processing if needed.

**Implementation**: Already handled by polling interval configuration.

## Testing

### Unit Tests

Test each handler with mock updates:
```typescript
describe('TdlibMessageUpdateHandler', () => {
  it('should update message status on updateMessageSendSucceeded', async () => {
    const update = {
      '@type': 'updateMessageSendSucceeded',
      message: { id: 123, date: 1234567890 },
    };
    await handler.handle(clientId, update);
    // Verify message status updated
  });
});
```

### Integration Tests

Test end-to-end update flow:
```typescript
describe('Update Flow Integration', () => {
  it('should process message send update and update database', async () => {
    // Send message via TDLib
    // Wait for update
    // Verify database updated
  });
});
```

## Best Practices

1. **Always verify session ownership** before updating domain entities
2. **Use transactions** for multi-step updates
3. **Log all updates** for audit trail
4. **Handle missing entities gracefully** (message/account not found)
5. **Implement retry logic** for transient failures
6. **Monitor update processing rate** via metrics
7. **Alert on update processing errors** via Prometheus alerts

## Monitoring

### Metrics

- `tdlib_updates_processed_total{type, status}` - Update processing rate
- `tdlib_updates_errors_total{type, error_type}` - Update errors
- `tdlib_update_processing_duration_seconds{type}` - Processing latency

### Logs

All updates should be logged with:
- Update type
- Client ID
- Account ID (if available)
- Processing result (success/error)

## Examples

### Complete Message Send Flow

1. **User sends message** → `MessagesService.send()`
2. **Create message record** → `Message.status = PENDING`
3. **Create job** → `Job.type = MESSAGE_SEND`
4. **TelegramProcessor processes** → Send to TDLib
5. **TDLib responds** → `updateMessageSendSucceeded`
6. **Handler processes** → Update `Message.status = SENT`
7. **Database updated** → Message record reflects sent status

### Account Lifecycle Flow

1. **Account created** → `AccountsService.create()`
2. **Trigger auth** → `TdlibAuthService.requestCode()`
3. **User enters code** → `TdlibAuthService.confirmCode()`
4. **Auth succeeds** → `updateAuthorizationState(authorizationStateReady)`
5. **Handler processes** → `Account.status = ACTIVE`
6. **Session linked** → `AccountSession` created
7. **Account deleted** → Sessions revoked, clients destroyed

---

**Last Updated**: 2026-01-27
