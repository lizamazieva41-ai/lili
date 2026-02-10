# TDLib Chat Operations Examples

## Overview

Examples for managing chats, groups, and channels.

## Create Private Chat

```typescript
import { TdlibChatService } from '../tdlib/services/tdlib-chat.service';

const chat = await chatService.createPrivateChat(
  clientId,
  userId,
  false // force
);
```

## Get Chat History

```typescript
const history = await chatService.getChatHistory(
  clientId,
  chatId,
  0,    // fromMessageId
  0,    // offset
  100,  // limit
  false // onlyLocal
);
```

## Edit Chat Title

```typescript
await chatService.editChatTitle(
  clientId,
  chatId,
  'New Chat Title'
);
```

## Set Chat Permissions

```typescript
await chatService.setChatPermissions(
  clientId,
  chatId,
  {
    '@type': 'chatPermissions',
    can_send_messages: true,
    can_send_media_messages: true,
    can_send_polls: false,
  }
);
```

## Add Chat Member

```typescript
await chatService.addChatMember(
  clientId,
  chatId,
  userId,
  0 // forwardLimit
);
```

## Get Chat Statistics

```typescript
const stats = await chatService.getChatStatistics(
  clientId,
  chatId,
  false // isDark
);
```
