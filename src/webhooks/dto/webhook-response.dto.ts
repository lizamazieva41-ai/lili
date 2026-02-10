import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({ description: 'Webhook ID' })
  id!: string;

  @ApiProperty({ description: 'Webhook name' })
  name!: string;

  @ApiProperty({ description: 'Webhook URL' })
  url!: string;

  @ApiProperty({ description: 'Events', type: [String] })
  events!: string[];

  @ApiProperty({ description: 'Is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Retry attempts', required: false })
  retryAttempts?: number;

  @ApiProperty({ description: 'Retry delay in ms', required: false })
  retryDelay?: number;

  @ApiProperty({ description: 'Timeout in ms', required: false })
  timeout?: number;

  @ApiProperty({ description: 'Total sent' })
  totalSent!: number;

  @ApiProperty({ description: 'Total success' })
  totalSuccess!: number;

  @ApiProperty({ description: 'Total failures' })
  totalFailures!: number;

  @ApiProperty({ description: 'Last triggered at', required: false })
  lastTriggeredAt!: Date | null;

  @ApiProperty({ description: 'Last success at', required: false })
  lastSuccessAt?: Date | null;

  @ApiProperty({ description: 'Last failure at', required: false })
  lastFailureAt?: Date | null;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;
}

export class WebhookListResponseDto {
  @ApiProperty({ description: 'List of webhooks', type: [WebhookResponseDto] })
  webhooks!: WebhookResponseDto[];
}

export class WebhookDeliveryDto {
  @ApiProperty({ description: 'Delivery ID' })
  id!: string;

  @ApiProperty({ description: 'Event type' })
  eventType!: string;

  @ApiProperty({ description: 'Status' })
  status!: string;

  @ApiProperty({ description: 'Status code', required: false })
  statusCode!: number | null;

  @ApiProperty({ description: 'Attempts' })
  attempts!: number;

  @ApiProperty({ description: 'Delivered at', required: false })
  deliveredAt!: Date | null;

  @ApiProperty({ description: 'Failed at', required: false })
  failedAt!: Date | null;

  @ApiProperty({ description: 'Error', required: false })
  error!: string | null;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;
}
