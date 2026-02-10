# TDLib User Operations Examples

## Overview

Examples for managing user profiles, sessions, and commands.

## Get User Info

```typescript
import { TdlibUserService } from '../tdlib/services/tdlib-user.service';

const user = await userService.getUser(clientId, userId);
console.log(`Username: ${user.username}`);
console.log(`First name: ${user.first_name}`);
```

## Set Username

```typescript
await userService.setUsername(clientId, 'new_username');
```

## Set Bio

```typescript
await userService.setBio(clientId, 'My bio text');
```

## Get Active Sessions

```typescript
const sessions = await userService.getActiveSessions(clientId);
console.log(`Active sessions: ${sessions.sessions.length}`);
```

## Terminate Session

```typescript
await userService.terminateSession(clientId, sessionId);
```

## Set Bot Commands

```typescript
await userService.setCommands(
  clientId,
  [
    {
      command: 'start',
      description: 'Start the bot',
    },
    {
      command: 'help',
      description: 'Show help',
    },
  ],
  null, // scope
  'en'  // languageCode
);
```
