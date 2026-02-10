# TDLib Channel Operations Examples

## Overview

Examples for managing channels and supergroups.

## Create Channel

```typescript
import { TdlibChannelService } from '../tdlib/services/tdlib-channel.service';

const channel = await channelService.createChannel(
  clientId,
  'My Channel',
  'Channel description',
  false // isForum
);
```

## Get Channel Members

```typescript
const members = await channelService.getChannelMembers(
  clientId,
  channelId,
  null, // filter
  0,    // offset
  200   // limit
);
```

## Ban Channel Member

```typescript
await channelService.banChannelMember(
  clientId,
  channelId,
  userId,
  0,    // bannedUntilDate (0 = permanent)
  true  // revokeMessages
);
```

## Get Channel Statistics

```typescript
const stats = await channelService.getChannelStatistics(
  clientId,
  channelId,
  false // isDark
);
```

## Set Channel Available Reactions

```typescript
await channelService.setChannelAvailableReactions(
  clientId,
  channelId,
  {
    '@type': 'availableReactions',
    reactions: [
      {
        '@type': 'reactionTypeEmoji',
        emoji: '👍',
      },
    ],
  }
);
```

## Transfer Channel Ownership

```typescript
await channelService.transferChannelOwnership(
  clientId,
  channelId,
  newOwnerId,
  '2fa-password'
);
```
