import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ description: 'TDLib client ID', example: 'client_123' })
  clientId: string;

  @ApiProperty({ description: 'User ID', example: 'user_456', required: false })
  userId?: string;

  @ApiProperty({ description: 'Account ID', example: 'account_789', required: false })
  accountId?: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ description: 'Session creation timestamp', example: '2024-01-01T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00Z' })
  updatedAt: string;

  @ApiProperty({ description: 'Revocation timestamp', required: false })
  revokedAt?: string;

  @ApiProperty({ description: 'Last activity timestamp', required: false })
  lastActivityAt?: string;
}

export class SessionListResponseDto {
  @ApiProperty({ type: [SessionResponseDto], description: 'List of sessions' })
  sessions: SessionResponseDto[];

  @ApiProperty({ description: 'Total count', example: 10 })
  total: number;
}
