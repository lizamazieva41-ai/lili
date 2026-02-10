import { 
  BadRequestException,
  Body,
  Controller, 
  Get, 
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TelegramOAuthService } from './telegram-oauth.service';
import { SessionManagementService } from './session-management.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { EnhancedJwtAuthGuard } from './guards/enhanced-jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { RateLimit } from './guards/rate-limit.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { TelegramOAuthInitDto, TelegramCallbackDto } from './dto/telegram-oauth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto, SessionListResponseDto } from './dto/auth-response.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { CsrfService } from '../common/services/csrf.service';
import { TelegramUserInfo } from './telegram-oauth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private telegramOAuthService: TelegramOAuthService,
    private sessionManagementService: SessionManagementService,
    private csrfService: CsrfService,
  ) {}

  @Post('telegram/oauth')
  @ApiOperation({ 
    summary: 'Initiate Telegram OAuth flow',
    description: 'Generates OAuth URL and state for Telegram authentication. Returns auth URL that user should redirect to.',
  })
  @ApiBody({ type: TelegramOAuthInitDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OAuth URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            authUrl: { type: 'string', example: 'https://oauth.telegram.org/auth?...' },
            stateId: { type: 'string', example: 'state_1234567890' },
            expiresIn: { type: 'number', example: 600 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @RateLimit({ windowMs: 60 * 1000, max: 5, message: 'Too many OAuth attempts' })
  async initiateTelegramOAuth(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: TelegramOAuthInitDto,
  ): Promise<{ success: boolean; data: { authUrl: string; stateId: string; expiresIn: number } }> {
    const { authUrl, stateId } = await this.telegramOAuthService.generateAuthUrl(body.redirectUri);
    
    return {
      success: true,
      data: {
        authUrl,
        stateId,
        expiresIn: 600, // 10 minutes
      },
    };
  }

  @Post('telegram/callback')
  @ApiOperation({ 
    summary: 'Handle Telegram OAuth callback',
    description: 'Processes Telegram OAuth callback data, validates user, and creates session. Returns access and refresh tokens.',
  })
  @ApiBody({ type: TelegramCallbackDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Authentication successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid callback data or missing state parameter' })
  @ApiResponse({ status: 401, description: 'Telegram authentication failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @RateLimit({ windowMs: 60 * 1000, max: 10, message: 'Too many callback attempts' })
  async telegramCallback(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: TelegramCallbackDto,
    @Req() request: Request,
  ): Promise<{ success: boolean; data: AuthResponseDto }> {
    const { state, ...telegramData } = body;

    if (!state) {
      throw new BadRequestException('State parameter is required');
    }

    const telegramUser: TelegramUserInfo = {
      id: Number(telegramData.id),
      first_name: telegramData.first_name,
      last_name: telegramData.last_name,
      username: telegramData.username,
      photo_url: telegramData.photo_url,
      auth_date: Number(telegramData.auth_date),
      hash: telegramData.hash,
    };

    const user = await this.telegramOAuthService.validateCallback(telegramUser, state);

    // Login user and create session
    const loginResult = await this.authService.login(user);

    return {
      success: true,
      data: loginResult,
    };
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh access token with rotation',
    description: 'Exchanges refresh token for new access and refresh tokens. Implements token rotation for enhanced security.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @HttpCode(HttpStatus.OK)
  @RateLimit({ windowMs: 60 * 1000, max: 20, message: 'Too many refresh attempts' })
  async refreshToken(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: RefreshTokenDto,
    @Req() request: Request,
  ): Promise<{ success: boolean; data: AuthResponseDto }> {
    const { refreshToken } = body;
    const context = {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    };

    const result = await this.authService.refreshTokenWithRotation(refreshToken, context);

    return {
      success: true,
      data: result,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout from current session' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(EnhancedJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ success: boolean; message: string }> {
    const sessionId = user.session?.sessionId || (request as any).session?.sessionId;
    if (!sessionId) {
      throw new BadRequestException('Session ID not found');
    }
    
    await this.sessionManagementService.invalidateSession(
      sessionId,
      'MANUAL_LOGOUT'
    );

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all sessions' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Logged out from all devices' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @UseGuards(EnhancedJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @RateLimit({ windowMs: 60 * 1000, max: 5, message: 'Too many logout attempts' })
  async logoutAll(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; message: string }> {
    await this.sessionManagementService.invalidateAllUserSessions(
      user.id,
      'LOGOUT_ALL'
    );

    return {
      success: true,
      message: 'Logged out from all devices',
    };
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get all active sessions' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'List of active sessions',
    type: SessionListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(EnhancedJwtAuthGuard)
  async getSessions(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: SessionListResponseDto }> {
    const sessions = await this.sessionManagementService.getUserSessions(user.id);
    const currentSessionId = user.session?.sessionId;

    return {
      success: true,
      data: {
        sessions: sessions.map(session => ({
        sessionId: session.sessionId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
          isCurrent: currentSessionId ? session.sessionId === currentSessionId : false,
      })),
      },
    };
  }

  @Get('csrf')
  @ApiOperation({ summary: 'Get CSRF token for current session' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'CSRF token returned in both response body and X-CSRF-Token header',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object', properties: { csrfToken: { type: 'string' } } },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(EnhancedJwtAuthGuard)
  async getCsrfToken(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ success: boolean; data: { csrfToken: string } }> {
    const sessionId = (user.session?.sessionId || (request as any).session?.sessionId || `user_${user.id}`) as string;
    const csrfToken = await this.csrfService.generateToken(sessionId);

    // also expose via header for convenience
    (request.res as any)?.setHeader?.('X-CSRF-Token', csrfToken);

    return {
      success: true,
      data: { csrfToken },
    };
  }

  @Post('sessions/:sessionId/revoke')
  @ApiOperation({ summary: 'Revoke specific session' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Session revoked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @UseGuards(EnhancedJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ success: boolean; message: string }> {
    // Extract sessionId from URL parameter
    const sessionId = (request.params as any).sessionId;

    if (!sessionId) {
      throw new BadRequestException('Session ID is required');
    }

    // Validate that session belongs to user
    const session = await this.sessionManagementService.getUserSessions(user.id);
    const targetSession = session.find(s => s.sessionId === sessionId);

    if (!targetSession) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionManagementService.invalidateSession(
      sessionId,
      'MANUAL_REVOCATION'
    );

    return {
      success: true,
      message: 'Session revoked successfully',
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(EnhancedJwtAuthGuard)
  async getMe(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { user: AuthenticatedUser; session: { sessionId?: string; expiresAt?: Date } } }> {
    return {
      success: true,
      data: {
        user,
        session: {
          sessionId: user.session?.sessionId,
          expiresAt: user.session?.expiresAt,
        },
      },
    };
  }

  @Get('me/api-keys')
  @ApiOperation({ summary: 'Get user API keys (requires API key auth)' })
  @ApiHeader({ name: 'X-API-Key', description: 'API Key for authentication' })
  @ApiResponse({ status: 200, description: 'API key information retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @UseGuards(ApiKeyAuthGuard)
  async getMeApiKey(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { user: AuthenticatedUser; apiKey: any; license: any } }> {
    return {
      success: true,
      data: {
        user,
        apiKey: user.apiKey,
        license: user.license,
      },
    };
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate current session' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Session is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired session' })
  @UseGuards(EnhancedJwtAuthGuard)
  async validateSession(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { valid: boolean; user: { id: string; telegramId: number; username?: string }; session: { expiresAt?: Date } } }> {
    return {
      success: true,
      data: {
        valid: true,
        user: {
          id: user.id,
          telegramId: user.telegramId,
          username: user.username,
        },
        session: {
          expiresAt: user.session?.expiresAt,
        },
      },
    };
  }
}