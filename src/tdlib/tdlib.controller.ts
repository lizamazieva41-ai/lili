import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TdlibService } from './tdlib.service';
import { TdlibAuthService } from './tdlib-auth.service';
import { TdlibSessionStore } from './tdlib-session.store';
import { TdlibUpdatePollingService } from './tdlib-update-polling.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RequestCodeDto } from './dto/request-code.dto';
import { SessionListResponseDto, SessionResponseDto } from './dto/session-response.dto';
import { AccountInfoResponseDto } from './dto/account-info-response.dto';
import { ChatsListResponseDto } from './dto/chats-response.dto';
import { TdlibClientNotFoundException } from './exceptions/tdlib.exceptions';

@ApiTags('TDLib')
@Controller('tdlib')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TdlibController {
  constructor(
    private readonly tdlibService: TdlibService,
    private readonly tdlibAuthService: TdlibAuthService,
    private readonly tdlibSessionStore: TdlibSessionStore,
    private readonly updatePollingService: TdlibUpdatePollingService,
  ) { }

  @Get('health')
  @ApiOperation({ summary: 'Check TDLib health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check result',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        ready: { type: 'boolean' },
        clientCount: { type: 'number' },
        activeSessions: { type: 'number' },
        libraryInfo: { type: 'object', nullable: true },
        polling: { type: 'object' },
        version: { type: 'object', nullable: true },
        queueDepth: { type: 'object' },
        lastError: { type: 'object', nullable: true },
      },
    },
  })
  async health() {
    const libraryInfo = this.tdlibService.getLibraryInfo();
    const isReady = this.tdlibService.isReady();
    const clientCount = this.tdlibService.getClientCount();

    // Get active sessions count
    let activeSessions = 0;
    let sessionsByStatus: Record<string, number> = {};
    try {
      const sessions = await this.tdlibSessionStore.getAllActiveSessions();
      activeSessions = sessions.length;
      // Count sessions by status (if we track status)
      sessionsByStatus = {
        active: sessions.filter(s => !s.revokedAt).length,
        revoked: sessions.filter(s => s.revokedAt).length,
      };
    } catch (error) {
      // Ignore error for health check
    }

    // Get polling status
    const pollingStatus = this.updatePollingService.getStatus();

    // Get version info (if available)
    let version: any = null;
    try {
      // Try to read version from tdlib-version.json
      const fs = require('fs');
      const path = require('path');
      const versionPath = path.join(process.cwd(), 'vendor/tdlib/source/tdlib-version.json');
      if (fs.existsSync(versionPath)) {
        version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
      }
    } catch (error) {
      // Ignore version read errors
    }

    // Get queue depth (if queue service is available)
    let queueDepth: Record<string, number> = {};
    try {
      const { QueueService } = await import('../config/queue.service');
      // This would require injecting QueueService, but for now we'll skip
    } catch (error) {
      // Ignore queue depth errors
    }

    // Determine overall status
    const status = isReady && clientCount >= 0 ? 'ok' : 'degraded';

    return {
      status,
      ready: isReady,
      clientCount,
      activeSessions,
      sessionsByStatus,
      libraryInfo,
      polling: pollingStatus,
      version,
      queueDepth,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List all TDLib sessions for current user' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: SessionListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async getSessions(@CurrentUser() user: AuthenticatedUser): Promise<SessionListResponseDto> {
    const sessions = await this.tdlibSessionStore.getSessionsByUserId(user.id);

    return {
      sessions: sessions.map((session) => ({
        clientId: session.clientId,
        accountId: session.accountId,
        phoneNumber: session.phoneNumber,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastActivityAt: session.lastActivityAt,
        revokedAt: session.revokedAt,
      })),
      total: sessions.length,
    };
  }

  @Post('auth/request-code')
  @ApiOperation({ summary: 'Request authentication code for phone number' })
  @ApiResponse({
    status: 200,
    description: 'Code request sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @HttpCode(HttpStatus.OK)
  async requestCode(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: RequestCodeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tdlibAuthService.requestCode(dto.phoneNumber, user.id);
  }

  @Post('auth/confirm-code')
  @ApiOperation({ summary: 'Confirm authentication code' })
  @ApiResponse({
    status: 200,
    description: 'Code confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  @HttpCode(HttpStatus.OK)
  async confirmCode(
    @Body('phoneNumber') phoneNumber: string,
    @Body('code') code: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tdlibAuthService.confirmCode(phoneNumber, code, user.id);
  }

  @Post('auth/confirm-password')
  @ApiOperation({ summary: 'Confirm 2FA password' })
  @ApiResponse({
    status: 200,
    description: 'Password confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  @HttpCode(HttpStatus.OK)
  async confirmPassword(
    @Body('clientId') clientId: string,
    @Body('password') password: string,
  ) {
    return this.tdlibAuthService.confirmPassword(clientId, password);
  }



  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiParam({ name: 'sessionId', description: 'Session (clientId) to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @HttpCode(HttpStatus.OK)
  async getSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SessionResponseDto> {
    const session = await this.tdlibSessionStore.getSession(sessionId);
    if (!session) {
      throw new TdlibClientNotFoundException(sessionId);
    }

    // Verify ownership
    if (session.userId !== user.id) {
      throw new TdlibClientNotFoundException(sessionId);
    }

    return session;
  }

  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: 'Revoke a TDLib session' })
  @ApiParam({ name: 'sessionId', description: 'Session (clientId) to revoke' })
  @ApiResponse({
    status: 200,
    description: 'Session revoked successfully',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; message: string }> {
    const session = await this.tdlibSessionStore.getSession(sessionId);
    if (!session) {
      throw new TdlibClientNotFoundException(sessionId);
    }

    // Verify ownership
    if (session.userId !== user.id) {
      throw new TdlibClientNotFoundException(sessionId);
    }

    await this.tdlibSessionStore.revokeSession(sessionId);

    // Destroy the client
    try {
      this.tdlibService.destroyClient(sessionId);
    } catch (error) {
      // Log but don't fail if client already destroyed
    }

    return {
      success: true,
      message: 'Session revoked successfully',
    };
  }

  @Get('me/:clientId')
  @ApiOperation({ summary: 'Get account information for a TDLib client' })
  @ApiParam({ name: 'clientId', description: 'TDLib client ID' })
  @ApiResponse({
    status: 200,
    description: 'Account information retrieved successfully',
    type: AccountInfoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @HttpCode(HttpStatus.OK)
  async getMe(
    @Param('clientId') clientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AccountInfoResponseDto> {
    // Verify session ownership
    const session = await this.tdlibSessionStore.getSession(clientId);
    if (!session || session.userId !== user.id) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const userInfo = await this.tdlibService.getMe(clientId);

    return {
      id: userInfo.id,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      username: userInfo.usernames?.editable_username || userInfo.username,
      phoneNumber: userInfo.phone_number,
      isVerified: userInfo.is_verified || false,
      isPremium: userInfo.is_premium || false,
      isBot: userInfo.type?.['@type'] === 'userTypeBot' || false,
      languageCode: userInfo.language_code,
    };
  }

  @Get('chats/:clientId')
  @ApiOperation({ summary: 'Get chats list for a TDLib client' })
  @ApiParam({ name: 'clientId', description: 'TDLib client ID' })
  @ApiResponse({
    status: 200,
    description: 'Chats retrieved successfully',
    type: ChatsListResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @HttpCode(HttpStatus.OK)
  async getChats(
    @Param('clientId') clientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ChatsListResponseDto> {
    // Verify session ownership
    const session = await this.tdlibSessionStore.getSession(clientId);
    if (!session || session.userId !== user.id) {
      throw new TdlibClientNotFoundException(clientId);
    }

    const chats = await this.tdlibService.getChats(clientId);

    return {
      chats: chats.map((chat: any) => ({
        id: chat.id,
        type: chat.type?.['@type'] || 'unknown',
        title: chat.title,
        username: chat.usernames?.editable_username || chat.username,
        firstName: chat.first_name,
        lastName: chat.last_name,
        isVerified: chat.is_verified || false,
        unreadCount: chat.unread_count || 0,
        lastMessageDate: chat.last_message?.date
          ? new Date(chat.last_message.date * 1000).toISOString()
          : undefined,
      })),
      total: chats.length,
    };
  }
}

