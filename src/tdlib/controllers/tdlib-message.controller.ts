/**
 * TDLib Message Controller
 * 
 * REST API endpoints for message operations
 */

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TdlibMessageService } from '../services/tdlib-message.service';
import { GetMessageDto } from '../dto/message-get.dto';
import { EditMessageTextDto } from '../dto/message-edit.dto';
import { DeleteMessagesDto } from '../dto/message-delete.dto';
import { TdlibRateLimitGuard } from '../guards/tdlib-rate-limit.guard';
import { RateLimit } from '../decorators/rate-limit.decorator';

@Controller('tdlib/messages')
@UseGuards(TdlibRateLimitGuard)
export class TdlibMessageController {
  constructor(private readonly messageService: TdlibMessageService) {}

  @Get(':clientId/:chatId/:messageId')
  async getMessage(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.getMessage(clientId, chatId, messageId);
  }

  @Post('edit')
  async editMessageText(@Body() dto: EditMessageTextDto) {
    return this.messageService.editMessageText(
      dto.clientId,
      dto.chatId,
      dto.messageId,
      dto.text,
      { disableWebPagePreview: dto.disableWebPagePreview },
    );
  }

  @Post('delete')
  async deleteMessages(@Body() dto: DeleteMessagesDto) {
    return this.messageService.deleteMessages(
      dto.clientId,
      dto.chatId,
      dto.messageIds,
      dto.revoke,
    );
  }

  @Post('forward')
  async forwardMessages(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      fromChatId: string;
      messageIds: number[];
      disableNotification?: boolean;
    },
  ) {
    return this.messageService.forwardMessages(
      body.clientId,
      body.chatId,
      body.fromChatId,
      body.messageIds,
      { disableNotification: body.disableNotification },
    );
  }

  @Post('pin')
  async pinMessage(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      disableNotification?: boolean;
      onlyForSelf?: boolean;
    },
  ) {
    return this.messageService.pinMessage(
      body.clientId,
      body.chatId,
      body.messageId,
      body.disableNotification,
      body.onlyForSelf,
    );
  }

  @Post('unpin')
  async unpinMessage(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
    },
  ) {
    return this.messageService.unpinMessage(
      body.clientId,
      body.chatId,
      body.messageId,
    );
  }

  @Post('unpin-all')
  async unpinAllMessages(
    @Body()
    body: {
      clientId: string;
      chatId: string;
    },
  ) {
    return this.messageService.unpinAllMessages(body.clientId, body.chatId);
  }

  @Post('read-contents')
  async readMessageContents(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageIds: number[];
    },
  ) {
    return this.messageService.readMessageContents(
      body.clientId,
      body.chatId,
      body.messageIds,
    );
  }

  @Post('read-mentions')
  async readAllMessageMentions(
    @Body()
    body: {
      clientId: string;
      chatId: string;
    },
  ) {
    return this.messageService.readAllMessageMentions(body.clientId, body.chatId);
  }

  @Post('read-reactions')
  async readAllMessageReactions(
    @Body()
    body: {
      clientId: string;
      chatId: string;
    },
  ) {
    return this.messageService.readAllMessageReactions(
      body.clientId,
      body.chatId,
    );
  }

  @Get('statistics/:clientId/:chatId/:messageId')
  async getMessageStatistics(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { isDark?: boolean },
  ) {
    return this.messageService.getMessageStatistics(
      clientId,
      chatId,
      messageId,
      body.isDark,
    );
  }

  @Get('public-forwards/:clientId/:chatId/:messageId')
  async getMessagePublicForwards(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { offset?: string; limit?: number },
  ) {
    return this.messageService.getMessagePublicForwards(
      clientId,
      chatId,
      messageId,
      body.offset || '',
      body.limit || 100,
    );
  }

  @Post('report')
  async reportMessage(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageIds: number[];
      reason: Record<string, unknown>;
    },
  ) {
    return this.messageService.reportMessage(
      body.clientId,
      body.chatId,
      body.messageIds,
      body.reason,
    );
  }

  @Get('read-date/:clientId/:chatId/:messageId')
  async getMessageReadDate(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.getMessageReadDate(
      clientId,
      chatId,
      messageId,
    );
  }

  @Get('reactions/:clientId/:chatId/:messageId')
  async getMessageAddedReactions(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { reactionType?: Record<string, unknown>; offset?: string; limit?: number },
  ) {
    return this.messageService.getMessageAddedReactions(
      clientId,
      chatId,
      messageId,
      body.reactionType || null,
      body.offset || '',
      body.limit || 100,
    );
  }

  @Post('reaction/add')
  async addMessageReaction(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      reactionType: Record<string, unknown>;
      isBig?: boolean;
      updateRecentReactions?: boolean;
    },
  ) {
    return this.messageService.addMessageReaction(
      body.clientId,
      body.chatId,
      body.messageId,
      body.reactionType,
      body.isBig,
      body.updateRecentReactions,
    );
  }

  @Post('reaction/remove')
  async removeMessageReaction(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      reactionType: Record<string, unknown>;
    },
  ) {
    return this.messageService.removeMessageReaction(
      body.clientId,
      body.chatId,
      body.messageId,
      body.reactionType,
    );
  }

  @Post('reaction/set')
  async setMessageReaction(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      reactionTypes: Array<Record<string, unknown>>;
      isBig?: boolean;
    },
  ) {
    return this.messageService.setMessageReaction(
      body.clientId,
      body.chatId,
      body.messageId,
      body.reactionTypes,
      body.isBig,
    );
  }

  @Get('available-reactions/:clientId/:chatId/:messageId')
  async getMessageAvailableReactions(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { rowSize?: number },
  ) {
    return this.messageService.getMessageAvailableReactions(
      clientId,
      chatId,
      messageId,
      body.rowSize || 8,
    );
  }

  @Post('search')
  async searchMessages(
    @Body()
    body: {
      clientId: string;
      query: string;
      offset?: string;
      limit?: number;
      filter?: Record<string, unknown>;
      chatTypeFilter?: Record<string, unknown>;
      minDate?: number;
      maxDate?: number;
      chatList?: Record<string, unknown>;
    },
  ) {
    return this.messageService.searchMessages(
      body.clientId,
      body.query,
      body.offset || '',
      body.limit || 100,
      body.filter || null,
      body.chatTypeFilter || null,
      body.minDate || 0,
      body.maxDate || 0,
      body.chatList || null,
    );
  }

  @Get('embedding-code/:clientId/:chatId/:messageId')
  async getMessageEmbeddingCode(
    @Param('clientId') clientId: string,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: number,
    @Body() body: { forAlbum?: boolean },
  ) {
    return this.messageService.getMessageEmbeddingCode(
      clientId,
      chatId,
      messageId,
      body.forAlbum,
    );
  }

  @Post('link-info')
  async getMessageLinkInfo(
    @Body()
    body: {
      clientId: string;
      url: string;
    },
  ) {
    return this.messageService.getMessageLinkInfo(body.clientId, body.url);
  }

  @Post('translate')
  async translateMessageText(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      toLanguageCode: string;
    },
  ) {
    return this.messageService.translateMessageText(
      body.clientId,
      body.chatId,
      body.messageId,
      body.toLanguageCode,
    );
  }

  @Post('reactions/report')
  async reportMessageReactions(
    @Body()
    body: {
      clientId: string;
      chatId: string;
      messageId: number;
      senderId: Record<string, unknown>;
    },
  ) {
    return this.messageService.reportMessageReactions(
      body.clientId,
      body.chatId,
      body.messageId,
      body.senderId,
    );
  }
}
