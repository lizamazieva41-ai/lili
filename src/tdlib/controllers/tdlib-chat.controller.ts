/**
 * TDLib Chat Controller
 * 
 * REST API endpoints for chat operations
 */

import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TdlibChatService } from '../services/tdlib-chat.service';
import { TdlibRateLimitGuard } from '../guards/tdlib-rate-limit.guard';

@Controller('tdlib/chats')
@UseGuards(TdlibRateLimitGuard)
export class TdlibChatController {
  constructor(private readonly chatService: TdlibChatService) {}

  @Post('private')
  async createPrivateChat(
    @Body()
    body: {
      clientId: string;
      userId: string;
      force?: boolean;
    },
  ) {
    return this.chatService.createPrivateChat(
      body.clientId,
      body.userId,
      body.force,
    );
  }

  @Get(':clientId/:chatId')
  async getChat(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChat(clientId, chatId);
  }

  @Get(':clientId/:chatId/history')
  async getChatHistory(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Query('fromMessageId') fromMessageId?: number,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getChatHistory(
      clientId,
      chatId,
      fromMessageId || 0,
      offset || 0,
      limit || 100,
    );
  }

  @Post('search')
  async searchChatMessages(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      query: string;
      senderId?: string;
      fromMessageId?: number;
      offset?: number;
      limit?: number;
    },
  ) {
    return this.chatService.searchChatMessages(
      body.clientId,
      body.chatId,
      body.query,
      body.senderId,
      body.fromMessageId,
      body.offset,
      body.limit,
    );
  }

  @Get(':clientId/:chatId/members/:memberId')
  async getChatMember(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.chatService.getChatMember(clientId, chatId, memberId);
  }

  @Get(':clientId/:chatId/members')
  async getChatMembers(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getChatMembers(
      clientId,
      chatId,
      undefined,
      offset || 0,
      limit || 200,
    );
  }

  @Post('title')
  async editChatTitle(
    @Body() body: { clientId: string; chatId: string; title: string },
  ) {
    return this.chatService.editChatTitle(body.clientId, body.chatId, body.title);
  }

  @Post('description')
  async editChatDescription(
    @Body() body: { clientId: string; chatId: string; description: string },
  ) {
    return this.chatService.editChatDescription(
      body.clientId,
      body.chatId,
      body.description,
    );
  }

  @Post('photo')
  async editChatPhoto(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      photo: Record<string, unknown>;
    },
  ) {
    return this.chatService.editChatPhoto(body.clientId, body.chatId, body.photo);
  }

  @Post('accent-colors')
  async setChatAccentColors(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      accentColorId: number;
      backgroundGradientId: number;
    },
  ) {
    return this.chatService.setChatAccentColors(
      body.clientId,
      body.chatId,
      body.accentColorId,
      body.backgroundGradientId,
    );
  }

  @Post('profile-accent-color')
  async setChatProfileAccentColor(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      profileAccentColorId: number;
    },
  ) {
    return this.chatService.setChatProfileAccentColor(
      body.clientId,
      body.chatId,
      body.profileAccentColorId,
    );
  }

  @Post('permissions')
  async setChatPermissions(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      permissions: Record<string, unknown>;
    },
  ) {
    return this.chatService.setChatPermissions(
      body.clientId,
      body.chatId,
      body.permissions,
    );
  }

  @Post('slow-mode')
  async setChatSlowModeDelay(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      slowModeDelay: number;
    },
  ) {
    return this.chatService.setChatSlowModeDelay(
      body.clientId,
      body.chatId,
      body.slowModeDelay,
    );
  }

  @Post('pin-message')
  async pinChatMessage(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      disableNotification?: boolean;
      onlyForSelf?: boolean;
    },
  ) {
    return this.chatService.pinChatMessage(
      body.clientId,
      body.chatId,
      body.messageId,
      body.disableNotification,
      body.onlyForSelf,
    );
  }

  @Post('unpin-message')
  async unpinChatMessage(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
    },
  ) {
    return this.chatService.unpinChatMessage(
      body.clientId,
      body.chatId,
      body.messageId,
    );
  }

  @Post('unpin-all-messages')
  async unpinAllChatMessages(
    @Body() body: { clientId: string; chatId: string },
  ) {
    return this.chatService.unpinAllChatMessages(body.clientId, body.chatId);
  }

  @Post('member/add')
  async addChatMember(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      userId: string;
      forwardLimit?: number;
    },
  ) {
    return this.chatService.addChatMember(
      body.clientId,
      body.chatId,
      body.userId,
      body.forwardLimit || 0,
    );
  }

  @Post('members/add')
  async addChatMembers(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      userIds: Array<string | number>;
    },
  ) {
    return this.chatService.addChatMembers(
      body.clientId,
      body.chatId,
      body.userIds,
    );
  }

  @Post('member/status')
  async setChatMemberStatus(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      memberId: string;
      status: Record<string, unknown>;
    },
  ) {
    return this.chatService.setChatMemberStatus(
      body.clientId,
      body.chatId,
      body.memberId,
      body.status,
    );
  }

  @Post('member/ban')
  async banChatMember(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      memberId: string;
      bannedUntilDate?: number;
      revokeMessages?: boolean;
    },
  ) {
    return this.chatService.banChatMember(
      body.clientId,
      body.chatId,
      body.memberId,
      body.bannedUntilDate || 0,
      body.revokeMessages || false,
    );
  }

  @Get('can-transfer/:clientId')
  async canTransferOwnership(@Param('clientId') clientId: string) {
    return this.chatService.canTransferOwnership(clientId);
  }

  @Post('transfer-ownership')
  async transferChatOwnership(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      userId: string;
      password: string;
    },
  ) {
    return this.chatService.transferChatOwnership(
      body.clientId,
      body.chatId,
      body.userId,
      body.password,
    );
  }

  @Get('statistics/:clientId/:chatId')
  async getChatStatistics(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Body() body: { isDark?: boolean },
  ) {
    return this.chatService.getChatStatistics(
      clientId,
      chatId,
      body.isDark || false,
    );
  }

  @Get('message-statistics/:clientId/:chatId/:messageId')
  async getChatMessageStatistics(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { isDark?: boolean },
  ) {
    return this.chatService.getChatMessageStatistics(
      clientId,
      chatId,
      messageId,
      body.isDark || false,
    );
  }

  @Get('message-by-date/:clientId/:chatId')
  async getChatMessageByDate(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Body() body: { date: number },
  ) {
    return this.chatService.getChatMessageByDate(
      clientId,
      chatId,
      body.date,
    );
  }

  @Get('scheduled-messages/:clientId/:chatId')
  async getChatScheduledMessages(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChatScheduledMessages(clientId, chatId);
  }
}
