import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Message ID' })
  id!: string;

  @ApiProperty({ description: 'Campaign ID' })
  campaignId!: string;

  @ApiProperty({ description: 'Phone number' })
  phoneNumber!: string;

  @ApiProperty({ description: 'Message content' })
  content!: string;

  @ApiProperty({ description: 'Message type' })
  type!: string;

  @ApiProperty({ description: 'Message status' })
  status!: string;

  @ApiProperty({ description: 'Sent at', required: false })
  sentAt!: Date | null;

  @ApiProperty({ description: 'Delivered at', required: false })
  deliveredAt!: Date | null;

  @ApiProperty({ description: 'Read at', required: false })
  readAt?: Date | null;

  @ApiProperty({ description: 'Failed at', required: false })
  failedAt!: Date | null;

  @ApiProperty({ description: 'Error message', required: false })
  errorMessage!: string | null;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: any;
}

export class MessageListResponseDto {
  @ApiProperty({ description: 'List of messages', type: [MessageResponseDto] })
  messages!: MessageResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class MessageStatusDto {
  @ApiProperty({ description: 'Message ID' })
  id!: string;

  @ApiProperty({ description: 'Message status' })
  status!: string;

  @ApiProperty({ description: 'Sent at', required: false })
  sentAt!: Date | null;

  @ApiProperty({ description: 'Delivered at', required: false })
  deliveredAt!: Date | null;

  @ApiProperty({ description: 'Read at', required: false })
  readAt!: Date | null;

  @ApiProperty({ description: 'Failed at', required: false })
  failedAt!: Date | null;

  @ApiProperty({ description: 'Error message', required: false })
  errorMessage!: string | null;
}
