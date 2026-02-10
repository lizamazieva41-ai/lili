/**
 * TDLib User Controller
 * 
 * REST API endpoints for user operations
 */

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TdlibUserService } from '../services/tdlib-user.service';
import { TdlibRateLimitGuard } from '../guards/tdlib-rate-limit.guard';

@Controller('tdlib/users')
@UseGuards(TdlibRateLimitGuard)
export class TdlibUserController {
  constructor(private readonly userService: TdlibUserService) {}

  @Get(':clientId/:userId')
  async getUser(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ) {
    return this.userService.getUser(clientId, userId);
  }

  @Get('full-info/:clientId/:userId')
  async getUserFullInfo(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ) {
    return this.userService.getUserFullInfo(clientId, userId);
  }

  @Get('profile-photos/:clientId/:userId')
  async getUserProfilePhotos(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
    @Body() body: { offset?: number; limit?: number },
  ) {
    return this.userService.getUserProfilePhotos(
      clientId,
      userId,
      body.offset,
      body.limit,
    );
  }

  @Post('profile-photo/personal')
  async setUserPersonalProfilePhoto(
    @Body() body: { clientId: string; photo: Record<string, unknown> },
  ) {
    return this.userService.setUserPersonalProfilePhoto(body.clientId, body.photo);
  }

  @Post('profile-photo')
  async setUserProfilePhoto(
    @Body()
    body: {
      clientId: string;
      userId: string;
      photo: Record<string, unknown>;
    },
  ) {
    return this.userService.setUserProfilePhoto(
      body.clientId,
      body.userId,
      body.photo,
    );
  }

  @Post('profile-photo/delete')
  async deleteUserProfilePhoto(
    @Body()
    body: {
      clientId: string;
      userId: string;
      photoId: string;
    },
  ) {
    return this.userService.deleteUserProfilePhoto(
      body.clientId,
      body.userId,
      body.photoId,
    );
  }

  @Post('username')
  async setUsername(
    @Body() body: { clientId: string; username: string },
  ) {
    return this.userService.setUsername(body.clientId, body.username);
  }

  @Post('bio')
  async setBio(@Body() body: { clientId: string; bio: string }) {
    return this.userService.setBio(body.clientId, body.bio);
  }

  @Post('commands/set')
  async setCommands(
    @Body()
    body: {
      clientId: string;
      commands: Array<Record<string, unknown>>;
      scope?: Record<string, unknown>;
      languageCode?: string;
    },
  ) {
    return this.userService.setCommands(
      body.clientId,
      body.commands,
      body.scope || null,
      body.languageCode || '',
    );
  }

  @Post('commands/get')
  async getCommands(
    @Body()
    body: {
      clientId: string;
      scope?: Record<string, unknown>;
      languageCode?: string;
    },
  ) {
    return this.userService.getCommands(
      body.clientId,
      body.scope || null,
      body.languageCode || '',
    );
  }

  @Post('commands/delete')
  async deleteCommands(
    @Body()
    body: {
      clientId: string;
      scope?: Record<string, unknown>;
      languageCode?: string;
    },
  ) {
    return this.userService.deleteCommands(
      body.clientId,
      body.scope || null,
      body.languageCode || '',
    );
  }

  @Get('sessions/:clientId')
  async getActiveSessions(@Param('clientId') clientId: string) {
    return this.userService.getActiveSessions(clientId);
  }

  @Post('sessions/terminate')
  async terminateSession(
    @Body() body: { clientId: string; sessionId: string },
  ) {
    return this.userService.terminateSession(body.clientId, body.sessionId);
  }

  @Post('sessions/terminate-all-other')
  async terminateAllOtherSessions(@Body() body: { clientId: string }) {
    return this.userService.terminateAllOtherSessions(body.clientId);
  }

  @Post('sessions/toggle-calls')
  async toggleSessionCanAcceptCalls(
    @Body()
    body: {
      clientId: string;
      sessionId: string;
      canAcceptCalls: boolean;
    },
  ) {
    return this.userService.toggleSessionCanAcceptCalls(
      body.clientId,
      body.sessionId,
      body.canAcceptCalls,
    );
  }

  @Post('sessions/toggle-secret-chats')
  async toggleSessionCanAcceptSecretChats(
    @Body()
    body: {
      clientId: string;
      sessionId: string;
      canAcceptSecretChats: boolean;
    },
  ) {
    return this.userService.toggleSessionCanAcceptSecretChats(
      body.clientId,
      body.sessionId,
      body.canAcceptSecretChats,
    );
  }

  @Post('sessions/inactive-ttl')
  async setInactiveSessionTtl(
    @Body() body: { clientId: string; inactiveSessionTtlDays: number },
  ) {
    return this.userService.setInactiveSessionTtl(
      body.clientId,
      body.inactiveSessionTtlDays,
    );
  }

  @Get('websites/:clientId')
  async getConnectedWebsites(@Param('clientId') clientId: string) {
    return this.userService.getConnectedWebsites(clientId);
  }

  @Post('websites/disconnect')
  async disconnectWebsite(
    @Body() body: { clientId: string; websiteId: string },
  ) {
    return this.userService.disconnectWebsite(body.clientId, body.websiteId);
  }
}
