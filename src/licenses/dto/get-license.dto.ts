import { ApiProperty } from '@nestjs/swagger';

export class GetLicenseResponseDto {
  @ApiProperty({ description: 'License ID' })
  id!: string;

  @ApiProperty({ description: 'License plan type' })
  plan!: string;

  @ApiProperty({ description: 'License status' })
  status!: string;

  @ApiProperty({ description: 'Enabled features' })
  features!: Record<string, any>;

  @ApiProperty({ description: 'Usage limits' })
  limits!: Record<string, any>;

  @ApiProperty({ description: 'Current usage statistics' })
  usage!: Record<string, any>;

  @ApiProperty({ description: 'Expiration date' })
  expiresAt!: Date | null;

  @ApiProperty({ description: 'Auto renew setting' })
  autoRenew!: boolean;
}
