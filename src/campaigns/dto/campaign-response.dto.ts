import { ApiProperty } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty({ description: 'Campaign ID' })
  id!: string;

  @ApiProperty({ description: 'Campaign name' })
  name!: string;

  @ApiProperty({ description: 'Campaign description', required: false })
  description?: string | null;

  @ApiProperty({ description: 'Campaign type' })
  type!: string;

  @ApiProperty({ description: 'Campaign status' })
  status!: string;

  @ApiProperty({ description: 'Progress (0.0 to 1.0)' })
  progress!: number;

  @ApiProperty({ description: 'Success rate' })
  successRate!: number;

  @ApiProperty({ description: 'Delivery rate' })
  deliveryRate!: number;

  @ApiProperty({ description: 'Account ID' })
  accountId!: string;

  @ApiProperty({ description: 'Account details', required: false })
  account?: any;

  @ApiProperty({ description: 'Message template', required: false })
  template?: any;

  @ApiProperty({ description: 'Recipient list', required: false })
  recipientList?: any;

  @ApiProperty({ description: 'Campaign settings', required: false })
  settings?: any;

  @ApiProperty({ description: 'Tags', required: false, type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Started at', required: false })
  startedAt!: Date | null;

  @ApiProperty({ description: 'Completed at', required: false })
  completedAt!: Date | null;
}

export class CampaignListResponseDto {
  @ApiProperty({ description: 'List of campaigns', type: [CampaignResponseDto] })
  campaigns!: CampaignResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class CampaignStatsDto {
  @ApiProperty({ description: 'Total recipients' })
  totalRecipients!: number;

  @ApiProperty({ description: 'Sent messages' })
  sentMessages!: number;

  @ApiProperty({ description: 'Delivered messages' })
  deliveredMessages!: number;

  @ApiProperty({ description: 'Failed messages' })
  failedMessages!: number;

  @ApiProperty({ description: 'Success rate (%)' })
  successRate!: number;

  @ApiProperty({ description: 'Delivery rate (%)' })
  deliveryRate!: number;
}
