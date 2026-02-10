/**
 * TDLib Channel Controller
 * 
 * REST API endpoints for channel operations
 */

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TdlibChannelService } from '../services/tdlib-channel.service';
import { TdlibRateLimitGuard } from '../guards/tdlib-rate-limit.guard';

@Controller('tdlib/channels')
@UseGuards(TdlibRateLimitGuard)
export class TdlibChannelController {
  constructor(private readonly channelService: TdlibChannelService) {}

  @Post('create')
  async createChannel(
    @Body()
    body: {
      clientId: string;
      title: string;
      description?: string;
      isForum?: boolean;
    },
  ) {
    return this.channelService.createChannel(
      body.clientId,
      body.title,
      body.description,
      body.isForum,
    );
  }

  @Get(':clientId/:channelId')
  async getChannel(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.getChannel(clientId, channelId);
  }

  @Get('full-info/:clientId/:channelId')
  async getChannelFullInfo(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.getChannelFullInfo(clientId, channelId);
  }

  @Post('edit')
  async editChannel(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      title?: string;
      description?: string;
    },
  ) {
    return this.channelService.editChannel(
      body.clientId,
      body.channelId,
      body.title,
      body.description,
    );
  }

  @Post('about')
  async editChannelAbout(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      about: string;
    },
  ) {
    return this.channelService.editChannelAbout(
      body.clientId,
      body.channelId,
      body.about,
    );
  }

  @Post('toggle-sign-messages')
  async toggleChannelSignMessages(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      signMessages: boolean;
    },
  ) {
    return this.channelService.toggleChannelSignMessages(
      body.clientId,
      body.channelId,
      body.signMessages,
    );
  }

  @Post('toggle-history')
  async toggleChannelIsAllHistoryAvailable(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      isAllHistoryAvailable: boolean;
    },
  ) {
    return this.channelService.toggleChannelIsAllHistoryAvailable(
      body.clientId,
      body.channelId,
      body.isAllHistoryAvailable,
    );
  }

  @Post('upgrade-group')
  async upgradeGroupChatToSupergroupChat(
    @Body()
    body: {
      clientId: string;
      chatId: string;
    },
  ) {
    return this.channelService.upgradeGroupChatToSupergroupChat(
      body.clientId,
      body.chatId,
    );
  }

  @Get('members/:clientId/:channelId')
  async getChannelMembers(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
    @Body() body: { filter?: Record<string, unknown>; offset?: number; limit?: number },
  ) {
    return this.channelService.getChannelMembers(
      clientId,
      channelId,
      body.filter || null,
      body.offset || 0,
      body.limit || 200,
    );
  }

  @Get('administrators/:clientId/:channelId')
  async getChannelAdministrators(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.getChannelAdministrators(clientId, channelId);
  }

  @Get('member/:clientId/:channelId/:memberId')
  async getChannelMember(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.channelService.getChannelMember(clientId, channelId, memberId);
  }

  @Post('members/search')
  async searchChannelMembers(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      query: string;
      limit?: number;
    },
  ) {
    return this.channelService.searchChannelMembers(
      body.clientId,
      body.channelId,
      body.query,
      body.limit || 200,
    );
  }

  @Post('member/status')
  async setChannelMemberStatus(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      memberId: string;
      status: Record<string, unknown>;
    },
  ) {
    return this.channelService.setChannelMemberStatus(
      body.clientId,
      body.channelId,
      body.memberId,
      body.status,
    );
  }

  @Post('member/ban')
  async banChannelMember(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      memberId: string;
      bannedUntilDate?: number;
      revokeMessages?: boolean;
    },
  ) {
    return this.channelService.banChannelMember(
      body.clientId,
      body.channelId,
      body.memberId,
      body.bannedUntilDate || 0,
      body.revokeMessages || false,
    );
  }

  @Get('can-transfer/:clientId')
  async canTransferOwnership(@Param('clientId') clientId: string) {
    return this.channelService.canTransferOwnership(clientId);
  }

  @Post('transfer-ownership')
  async transferChannelOwnership(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      userId: string;
      password: string;
    },
  ) {
    return this.channelService.transferChannelOwnership(
      body.clientId,
      body.channelId,
      body.userId,
      body.password,
    );
  }

  @Get('statistics/:clientId/:channelId')
  async getChannelStatistics(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
    @Body() body: { isDark?: boolean },
  ) {
    return this.channelService.getChannelStatistics(
      clientId,
      channelId,
      body.isDark || false,
    );
  }

  @Get('message-statistics/:clientId/:channelId/:messageId')
  async getChannelMessageStatistics(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
    @Param('messageId') messageId: number,
    @Body() body: { isDark?: boolean },
  ) {
    return this.channelService.getChannelMessageStatistics(
      clientId,
      channelId,
      messageId,
      body.isDark || false,
    );
  }

  @Post('report')
  async reportChannel(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      reason: Record<string, unknown>;
      messageIds?: number[];
    },
  ) {
    return this.channelService.reportChannel(
      body.clientId,
      body.channelId,
      body.reason,
      body.messageIds || [],
    );
  }

  @Get('available-reactions/:clientId/:channelId')
  async getChannelAvailableReactions(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.getChannelAvailableReactions(clientId, channelId);
  }

  @Post('available-reactions')
  async setChannelAvailableReactions(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      availableReactions: Record<string, unknown>;
    },
  ) {
    return this.channelService.setChannelAvailableReactions(
      body.clientId,
      body.channelId,
      body.availableReactions,
    );
  }

  @Post('sticker-set')
  async setChannelStickerSet(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      stickerSetId: string;
    },
  ) {
    return this.channelService.setChannelStickerSet(
      body.clientId,
      body.channelId,
      body.stickerSetId,
    );
  }

  @Post('toggle-broadcast-group')
  async toggleChannelIsBroadcastGroup(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      isBroadcastGroup: boolean;
    },
  ) {
    return this.channelService.toggleChannelIsBroadcastGroup(
      body.clientId,
      body.channelId,
      body.isBroadcastGroup,
    );
  }

  @Get('recommendations/:clientId/:channelId')
  async getChannelRecommendations(
    @Param('clientId') clientId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.getChannelRecommendations(clientId, channelId);
  }

  @Post('recommendation/view')
  async viewChannelRecommendation(
    @Body()
    body: {
      clientId: string;
      channelId: string;
      openedChatId: string;
    },
  ) {
    return this.channelService.viewChannelRecommendation(
      body.clientId,
      body.channelId,
      body.openedChatId,
    );
  }
}
