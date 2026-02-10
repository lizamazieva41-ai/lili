# TDLib Messaging Examples

## Overview

Examples for sending, receiving, editing, and managing messages.

## Send Message

```typescript
import { TdlibMessageService } from '../tdlib/services/tdlib-message.service';

const result = await messageService.sendMessage(
  clientId,
  chatId,
  'Hello, World!',
  {
    disableNotification: false,
    replyToMessageId: 123,
  }
);
```

## Get Message

```typescript
const message = await messageService.getMessage(
  clientId,
  chatId,
  messageId
);
```

## Edit Message

```typescript
await messageService.editMessageText(
  clientId,
  chatId,
  messageId,
  'Updated text',
  {
    disableWebPagePreview: true,
  }
);
```

## Delete Messages

```typescript
await messageService.deleteMessages(
  clientId,
  chatId,
  [messageId1, messageId2],
  true // revoke
);
```

## Forward Messages

```typescript
await messageService.forwardMessages(
  clientId,
  targetChatId,
  sourceChatId,
  [messageId1, messageId2],
  {
    disableNotification: false,
  }
);
```

## Add Reaction

```typescript
await messageService.addMessageReaction(
  clientId,
  chatId,
  messageId,
  {
    '@type': 'reactionTypeEmoji',
    emoji: '👍',
  },
  false, // isBig
  true   // updateRecentReactions
);
```
