import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Session information in auth response
 */
export class SessionInfoDto {
  @ApiProperty({
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Token expiration date',
    example: '2026-01-27T10:00:00.000Z',
  })
  expiresAt!: Date;

  @ApiPropertyOptional({
    description: 'IP address where session was created',
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User agent string',
    example: 'Mozilla/5.0...',
  })
  userAgent?: string;
}

/**
 * User information in auth response
 */
export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: '123',
  })
  id!: string;

  @ApiProperty({
    description: 'Telegram user ID',
    example: '123456789',
  })
  telegramId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username!: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://t.me/i/userpic/320/johndoe.jpg',
  })
  avatar?: string;
}

/**
 * Authentication response DTO
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiPropertyOptional({
    description: 'Refresh token (may be omitted on refresh endpoints depending on rotation strategy)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Access token expiration (configured value, e.g. 24h)',
    example: '24h',
  })
  expiresIn!: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    description: 'Session information',
    type: SessionInfoDto,
  })
  sessionInfo!: SessionInfoDto;

  @ApiPropertyOptional({
    description: 'User information (may be omitted on refresh endpoints)',
    type: UserInfoDto,
  })
  user?: UserInfoDto;
}

/**
 * Session list item DTO
 */
export class SessionListItemDto {
  @ApiProperty({
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sessionId!: string;

  @ApiPropertyOptional({
    description: 'IP address',
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User agent',
    example: 'Mozilla/5.0...',
  })
  userAgent?: string;

  @ApiProperty({
    description: 'Session creation date',
    example: '2026-01-26T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last activity date',
    example: '2026-01-26T12:00:00.000Z',
  })
  lastActivityAt!: Date;

  @ApiProperty({
    description: 'Session expiration date',
    example: '2026-02-02T10:00:00.000Z',
  })
  expiresAt!: Date;

  @ApiProperty({
    description: 'Whether this is the current session',
    example: true,
  })
  isCurrent!: boolean;
}

/**
 * Session list response DTO
 */
export class SessionListResponseDto {
  @ApiProperty({
    description: 'List of active sessions',
    type: [SessionListItemDto],
  })
  sessions!: SessionListItemDto[];
}
