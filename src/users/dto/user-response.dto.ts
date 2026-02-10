import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'a1b2c3d4' })
  id!: string;

  @ApiProperty({ description: 'Telegram user ID', example: 123456789 })
  telegramId!: number;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  username?: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  email?: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName?: string;

  @ApiProperty({ description: 'Avatar URL', example: 'https://cdn.example.com/avatar.jpg' })
  avatar?: string;

  @ApiProperty({ description: 'Preferred language', example: 'en' })
  language!: string;

  @ApiProperty({ description: 'Whether user is active', example: true })
  isActive!: boolean;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt!: Date;
}
