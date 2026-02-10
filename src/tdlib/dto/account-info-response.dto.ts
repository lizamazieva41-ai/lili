import { ApiProperty } from '@nestjs/swagger';

export class AccountInfoResponseDto {
  @ApiProperty({ description: 'User ID', example: 123456789 })
  id: number;

  @ApiProperty({ description: 'First name', example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Username', example: 'johndoe', required: false })
  username?: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'Is verified', example: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Is premium', example: false })
  isPremium: boolean;

  @ApiProperty({ description: 'Is bot', example: false })
  isBot: boolean;

  @ApiProperty({ description: 'Language code', example: 'en', required: false })
  languageCode?: string;
}
