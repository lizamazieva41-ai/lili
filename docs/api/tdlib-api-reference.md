# TDLib API Reference

**Generated**: 2026-01-27T22:51:33.903Z

**Total Methods**: 115

---

## Table of Contents

- [TdlibAuthService](#tdlibauthservice)
- [TdlibChannelService](#tdlibchannelservice)
- [TdlibChatService](#tdlibchatservice)
- [TdlibFileService](#tdlibfileservice)
- [TdlibMessageService](#tdlibmessageservice)
- [TdlibService](#tdlibservice)
- [TdlibUserService](#tdlibuserservice)

---

## TdlibAuthService

**Total Methods**: 4

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `checkAuthenticationCode` | `POST /tdlib/auth/confirm-code` | `TdlibAuthService.confirmCode` | implemented |
| `checkAuthenticationPassword` | `POST /tdlib/auth/confirm-password` | `TdlibAuthService.confirmPassword` | implemented |
| `resendAuthenticationCode` | `POST /tdlib/auth/resend-code` | `TdlibAuthService.resendCode` | implemented |
| `setAuthenticationPhoneNumber` | `POST /tdlib/auth/request-code` | `TdlibAuthService.requestCode` | implemented |

## TdlibChannelService

**Total Methods**: 25

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `banChannelMember` | `POST /tdlib/channels/member/ban` | `TdlibChannelService.banChannelMember` | implemented |
| `canTransferOwnership` | `GET /tdlib/channels/can-transfer/:clientId` | `TdlibChannelService.canTransferOwnership` | implemented |
| `createChannel` | `POST /tdlib/channels/create` | `TdlibChannelService.createChannel` | implemented |
| `editChannel` | `POST /tdlib/channels/edit` | `TdlibChannelService.editChannel` | implemented |
| `editChannelAbout` | `POST /tdlib/channels/about` | `TdlibChannelService.editChannelAbout` | implemented |
| `getChannel` | `GET /tdlib/channels/:clientId/:channelId` | `TdlibChannelService.getChannel` | implemented |
| `getChannelAdministrators` | `GET /tdlib/channels/administrators/:clientId/:channelId` | `TdlibChannelService.getChannelAdministrators` | implemented |
| `getChannelAvailableReactions` | `GET /tdlib/channels/available-reactions/:clientId/:channelId` | `TdlibChannelService.getChannelAvailableReactions` | implemented |
| `getChannelFullInfo` | `GET /tdlib/channels/full-info/:clientId/:channelId` | `TdlibChannelService.getChannelFullInfo` | implemented |
| `getChannelMember` | `GET /tdlib/channels/member/:clientId/:channelId/:memberId` | `TdlibChannelService.getChannelMember` | implemented |
| `getChannelMembers` | `GET /tdlib/channels/members/:clientId/:channelId` | `TdlibChannelService.getChannelMembers` | implemented |
| `getChannelMessageStatistics` | `GET /tdlib/channels/message-statistics/:clientId/:channelId/:messageId` | `TdlibChannelService.getChannelMessageStatistics` | implemented |
| `getChannelRecommendations` | `GET /tdlib/channels/recommendations/:clientId/:channelId` | `TdlibChannelService.getChannelRecommendations` | implemented |
| `getChannelStatistics` | `GET /tdlib/channels/statistics/:clientId/:channelId` | `TdlibChannelService.getChannelStatistics` | implemented |
| `reportChannel` | `POST /tdlib/channels/report` | `TdlibChannelService.reportChannel` | implemented |
| `searchChannelMembers` | `POST /tdlib/channels/members/search` | `TdlibChannelService.searchChannelMembers` | implemented |
| `setChannelAvailableReactions` | `POST /tdlib/channels/available-reactions` | `TdlibChannelService.setChannelAvailableReactions` | implemented |
| `setChannelMemberStatus` | `POST /tdlib/channels/member/status` | `TdlibChannelService.setChannelMemberStatus` | implemented |
| `setChannelStickerSet` | `POST /tdlib/channels/sticker-set` | `TdlibChannelService.setChannelStickerSet` | implemented |
| `toggleChannelIsAllHistoryAvailable` | `POST /tdlib/channels/toggle-history` | `TdlibChannelService.toggleChannelIsAllHistoryAvailable` | implemented |
| `toggleChannelIsBroadcastGroup` | `POST /tdlib/channels/toggle-broadcast-group` | `TdlibChannelService.toggleChannelIsBroadcastGroup` | implemented |
| `toggleChannelSignMessages` | `POST /tdlib/channels/toggle-sign-messages` | `TdlibChannelService.toggleChannelSignMessages` | implemented |
| `transferChannelOwnership` | `POST /tdlib/channels/transfer-ownership` | `TdlibChannelService.transferChannelOwnership` | implemented |
| `upgradeGroupChatToSupergroupChat` | `POST /tdlib/channels/upgrade-group` | `TdlibChannelService.upgradeGroupChatToSupergroupChat` | implemented |
| `viewChannelRecommendation` | `POST /tdlib/channels/recommendation/view` | `TdlibChannelService.viewChannelRecommendation` | implemented |

## TdlibChatService

**Total Methods**: 28

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `addChatMember` | `POST /tdlib/chats/member/add` | `TdlibChatService.addChatMember` | implemented |
| `addChatMembers` | `POST /tdlib/chats/members/add` | `TdlibChatService.addChatMembers` | implemented |
| `banChatMember` | `POST /tdlib/chats/member/ban` | `TdlibChatService.banChatMember` | implemented |
| `canTransferOwnership` | `GET /tdlib/chats/can-transfer/:clientId` | `TdlibChatService.canTransferOwnership` | implemented |
| `createBasicGroupChat` | `POST /tdlib/chats/group` | `TdlibChatService.createGroupChat` | implemented |
| `createPrivateChat` | `POST /tdlib/chats/private` | `TdlibChatService.createPrivateChat` | implemented |
| `createSupergroupChat` | `POST /tdlib/chats/supergroup` | `TdlibChatService.createSupergroupChat` | implemented |
| `editChatDescription` | `POST /tdlib/chats/description` | `TdlibChatService.editChatDescription` | implemented |
| `editChatTitle` | `POST /tdlib/chats/title` | `TdlibChatService.editChatTitle` | implemented |
| `getChat` | `GET /tdlib/chats/:clientId/:chatId` | `TdlibChatService.getChat` | implemented |
| `getChatHistory` | `GET /tdlib/chats/:clientId/:chatId/history` | `TdlibChatService.getChatHistory` | implemented |
| `getChatMember` | `GET /tdlib/chats/:clientId/:chatId/members/:memberId` | `TdlibChatService.getChatMember` | implemented |
| `getChatMembers` | `GET /tdlib/chats/:clientId/:chatId/members` | `TdlibChatService.getChatMembers` | implemented |
| `getChatMessageByDate` | `GET /tdlib/chats/message-by-date/:clientId/:chatId` | `TdlibChatService.getChatMessageByDate` | implemented |
| `getChatMessageStatistics` | `GET /tdlib/chats/message-statistics/:clientId/:chatId/:messageId` | `TdlibChatService.getChatMessageStatistics` | implemented |
| `getChatScheduledMessages` | `GET /tdlib/chats/scheduled-messages/:clientId/:chatId` | `TdlibChatService.getChatScheduledMessages` | implemented |
| `getChatStatistics` | `GET /tdlib/chats/statistics/:clientId/:chatId` | `TdlibChatService.getChatStatistics` | implemented |
| `pinChatMessage` | `POST /tdlib/chats/pin-message` | `TdlibChatService.pinChatMessage` | implemented |
| `searchChatMessages` | `POST /tdlib/chats/search` | `TdlibChatService.searchChatMessages` | implemented |
| `setChatAccentColors` | `POST /tdlib/chats/accent-colors` | `TdlibChatService.setChatAccentColors` | implemented |
| `setChatMemberStatus` | `POST /tdlib/chats/member/status` | `TdlibChatService.setChatMemberStatus` | implemented |
| `setChatPermissions` | `POST /tdlib/chats/permissions` | `TdlibChatService.setChatPermissions` | implemented |
| `setChatPhoto` | `POST /tdlib/chats/photo` | `TdlibChatService.editChatPhoto` | implemented |
| `setChatProfileAccentColor` | `POST /tdlib/chats/profile-accent-color` | `TdlibChatService.setChatProfileAccentColor` | implemented |
| `setChatSlowModeDelay` | `POST /tdlib/chats/slow-mode` | `TdlibChatService.setChatSlowModeDelay` | implemented |
| `transferChatOwnership` | `POST /tdlib/chats/transfer-ownership` | `TdlibChatService.transferChatOwnership` | implemented |
| `unpinAllChatMessages` | `POST /tdlib/chats/unpin-all-messages` | `TdlibChatService.unpinAllChatMessages` | implemented |
| `unpinChatMessage` | `POST /tdlib/chats/unpin-message` | `TdlibChatService.unpinChatMessage` | implemented |

## TdlibFileService

**Total Methods**: 5

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `cancelDownloadFile` | `POST /tdlib/files/cancel-download` | `TdlibFileService.cancelDownloadFile` | implemented |
| `downloadFile` | `POST /tdlib/files/download` | `TdlibFileService.downloadFile` | implemented |
| `getFile` | `GET /tdlib/files/:clientId/:fileId` | `TdlibFileService.getFile` | implemented |
| `getRemoteFile` | `GET /tdlib/files/:clientId/remote/:remoteFileId` | `TdlibFileService.getRemoteFile` | implemented |
| `uploadFile` | `POST /tdlib/files/upload` | `TdlibFileService.uploadFile` | implemented |

## TdlibMessageService

**Total Methods**: 29

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `addMessageReaction` | `POST /tdlib/messages/reaction/add` | `TdlibMessageService.addMessageReaction` | implemented |
| `deleteMessages` | `POST /tdlib/messages/delete` | `TdlibMessageService.deleteMessages` | implemented |
| `editMessageText` | `POST /tdlib/messages/edit` | `TdlibMessageService.editMessageText` | implemented |
| `forwardMessages` | `POST /tdlib/messages/forward` | `TdlibMessageService.forwardMessages` | implemented |
| `getMessage` | `GET /tdlib/messages/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessage` | implemented |
| `getMessageAddedReactions` | `GET /tdlib/messages/reactions/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessageAddedReactions` | implemented |
| `getMessageAvailableReactions` | `GET /tdlib/messages/available-reactions/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessageAvailableReactions` | implemented |
| `getMessageEmbeddingCode` | `GET /tdlib/messages/embedding-code/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessageEmbeddingCode` | implemented |
| `getMessageLink` | `GET /tdlib/messages/:clientId/:chatId/:messageId/link` | `TdlibMessageService.getMessageLink` | implemented |
| `getMessageLinkInfo` | `POST /tdlib/messages/link-info` | `TdlibMessageService.getMessageLinkInfo` | implemented |
| `getMessageLocally` | `GET /tdlib/messages/:clientId/:chatId/:messageId/local` | `TdlibMessageService.getMessageLocally` | implemented |
| `getMessagePublicForwards` | `GET /tdlib/messages/public-forwards/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessagePublicForwards` | implemented |
| `getMessageReadDate` | `GET /tdlib/messages/read-date/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessageReadDate` | implemented |
| `getMessages` | `POST /tdlib/messages/batch` | `TdlibMessageService.getMessages` | implemented |
| `getMessageStatistics` | `GET /tdlib/messages/statistics/:clientId/:chatId/:messageId` | `TdlibMessageService.getMessageStatistics` | implemented |
| `getMessageThread` | `GET /tdlib/messages/:clientId/:chatId/:messageId/thread` | `TdlibMessageService.getMessageThread` | implemented |
| `pinChatMessage` | `POST /tdlib/messages/pin` | `TdlibMessageService.pinMessage` | implemented |
| `readAllMessageMentions` | `POST /tdlib/messages/read-mentions` | `TdlibMessageService.readAllMessageMentions` | implemented |
| `readAllMessageReactions` | `POST /tdlib/messages/read-reactions` | `TdlibMessageService.readAllMessageReactions` | implemented |
| `readMessageContents` | `POST /tdlib/messages/read-contents` | `TdlibMessageService.readMessageContents` | implemented |
| `removeMessageReaction` | `POST /tdlib/messages/reaction/remove` | `TdlibMessageService.removeMessageReaction` | implemented |
| `reportMessage` | `POST /tdlib/messages/report` | `TdlibMessageService.reportMessage` | implemented |
| `reportMessageReactions` | `POST /tdlib/messages/reactions/report` | `TdlibMessageService.reportMessageReactions` | implemented |
| `searchMessages` | `POST /tdlib/messages/search` | `TdlibMessageService.searchMessages` | implemented |
| `sendMessageAlbum` | `POST /tdlib/messages/album` | `TdlibMessageService.sendMessageAlbum` | implemented |
| `setMessageReactions` | `POST /tdlib/messages/reaction/set` | `TdlibMessageService.setMessageReaction` | implemented |
| `translateMessageText` | `POST /tdlib/messages/translate` | `TdlibMessageService.translateMessageText` | implemented |
| `unpinAllChatMessages` | `POST /tdlib/messages/unpin-all` | `TdlibMessageService.unpinAllMessages` | implemented |
| `unpinChatMessage` | `POST /tdlib/messages/unpin` | `TdlibMessageService.unpinMessage` | implemented |

## TdlibService

**Total Methods**: 5

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `addProxy` | `POST /tdlib/proxy` | `TdlibService.setProxy` | implemented |
| `getChats` | `GET /tdlib/chats` | `TdlibService.getChats` | implemented |
| `getMe` | `GET /tdlib/me` | `TdlibService.getMe` | implemented |
| `searchContacts` | `GET /tdlib/contacts/search` | `TdlibService.searchContacts` | implemented |
| `sendMessage` | `POST /tdlib/messages/send` | `TdlibService.sendMessage` | implemented |

## TdlibUserService

**Total Methods**: 19

| Method | Endpoint | Service Method | Status |
|--------|----------|----------------|--------|
| `deleteCommands` | `POST /tdlib/users/commands/delete` | `TdlibUserService.deleteCommands` | implemented |
| `deleteUserProfilePhoto` | `POST /tdlib/users/profile-photo/delete` | `TdlibUserService.deleteUserProfilePhoto` | implemented |
| `disconnectWebsite` | `POST /tdlib/users/websites/disconnect` | `TdlibUserService.disconnectWebsite` | implemented |
| `getActiveSessions` | `GET /tdlib/users/sessions/:clientId` | `TdlibUserService.getActiveSessions` | implemented |
| `getCommands` | `POST /tdlib/users/commands/get` | `TdlibUserService.getCommands` | implemented |
| `getConnectedWebsites` | `GET /tdlib/users/websites/:clientId` | `TdlibUserService.getConnectedWebsites` | implemented |
| `getUser` | `GET /tdlib/users/:clientId/:userId` | `TdlibUserService.getUser` | implemented |
| `getUserFullInfo` | `GET /tdlib/users/full-info/:clientId/:userId` | `TdlibUserService.getUserFullInfo` | implemented |
| `getUserProfilePhotos` | `GET /tdlib/users/profile-photos/:clientId/:userId` | `TdlibUserService.getUserProfilePhotos` | implemented |
| `setBio` | `POST /tdlib/users/bio` | `TdlibUserService.setBio` | implemented |
| `setCommands` | `POST /tdlib/users/commands/set` | `TdlibUserService.setCommands` | implemented |
| `setInactiveSessionTtl` | `POST /tdlib/users/sessions/inactive-ttl` | `TdlibUserService.setInactiveSessionTtl` | implemented |
| `setUsername` | `POST /tdlib/users/username` | `TdlibUserService.setUsername` | implemented |
| `setUserPersonalProfilePhoto` | `POST /tdlib/users/profile-photo/personal` | `TdlibUserService.setUserPersonalProfilePhoto` | implemented |
| `setUserProfilePhoto` | `POST /tdlib/users/profile-photo` | `TdlibUserService.setUserProfilePhoto` | implemented |
| `terminateAllOtherSessions` | `POST /tdlib/users/sessions/terminate-all-other` | `TdlibUserService.terminateAllOtherSessions` | implemented |
| `terminateSession` | `POST /tdlib/users/sessions/terminate` | `TdlibUserService.terminateSession` | implemented |
| `toggleSessionCanAcceptCalls` | `POST /tdlib/users/sessions/toggle-calls` | `TdlibUserService.toggleSessionCanAcceptCalls` | implemented |
| `toggleSessionCanAcceptSecretChats` | `POST /tdlib/users/sessions/toggle-secret-chats` | `TdlibUserService.toggleSessionCanAcceptSecretChats` | implemented |

---

## Summary

- **Implemented**: 115
- **Planned**: 0
- **Not Used**: 0
