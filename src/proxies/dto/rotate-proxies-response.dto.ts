import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RotateProxyDetailDto {
  @ApiProperty({ description: 'Account ID', example: 'acc_123' })
  accountId!: string;

  @ApiPropertyOptional({ description: 'Old proxy ID', example: 'proxy_old_123' })
  oldProxyId?: string;

  @ApiPropertyOptional({ description: 'New proxy ID', example: 'proxy_new_456' })
  newProxyId?: string;

  @ApiPropertyOptional({ description: 'Error message if rotation failed', example: 'No available healthy proxy found' })
  error?: string;
}

export class RotateProxiesResultDto {
  @ApiProperty({ description: 'Number of accounts rotated successfully', example: 3 })
  rotated!: number;

  @ApiProperty({ description: 'Number of accounts failed to rotate', example: 1 })
  failed!: number;

  @ApiProperty({ description: 'Per-account rotation details', type: [RotateProxyDetailDto] })
  details!: RotateProxyDetailDto[];
}
