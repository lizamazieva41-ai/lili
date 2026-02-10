import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsNumberString } from 'class-validator';

/**
 * DTO for initiating Telegram OAuth flow
 */
export class TelegramOAuthInitDto {
  @ApiPropertyOptional({
    description: 'Redirect URI after OAuth completion',
    example: 'https://example.com/auth/callback',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  redirectUri?: string;
}

/**
 * DTO for Telegram OAuth callback data
 * This matches the data structure sent by Telegram Widget
 */
export class TelegramCallbackDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123456789',
  })
  @IsNumberString()
  id!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  first_name!: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'User photo URL',
    example: 'https://t.me/i/userpic/320/username.jpg',
  })
  @IsOptional()
  @IsUrl()
  photo_url?: string;

  @ApiProperty({
    description: 'Authentication date (Unix timestamp)',
    example: 1640995200,
  })
  @IsNumberString()
  auth_date!: string;

  @ApiProperty({
    description: 'Hash for data verification',
    example: 'abc123def456...',
  })
  @IsString()
  hash!: string;

  @ApiPropertyOptional({
    description: 'OAuth state parameter for CSRF protection',
    example: 'state_1234567890',
  })
  @IsOptional()
  @IsString()
  state?: string;
}
