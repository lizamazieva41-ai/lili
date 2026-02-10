import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum AccountTier {
  COLD = 'COLD',
  WARM = 'WARM',
  ACTIVE = 'ACTIVE',
  HOT = 'HOT',
}

export class CreateAccountDto {
  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ description: 'Proxy ID to assign', required: false })
  @IsString()
  @IsOptional()
  proxyId?: string;

  @ApiProperty({ description: 'Account tier', enum: AccountTier, required: false })
  @IsEnum(AccountTier)
  @IsOptional()
  tier?: AccountTier;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Auto-initiate TDLib authentication', required: false, default: true })
  @IsOptional()
  autoAuth?: boolean;
}
