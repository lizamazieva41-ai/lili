import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum, IsInt, Min, IsArray } from 'class-validator';
import { CampaignType } from '@prisma/client';

export class CreateCampaignDto {
  @ApiProperty({ description: 'Campaign name', example: 'Product Launch Campaign' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Campaign description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Account ID to use for campaign' })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({ description: 'Campaign type', enum: CampaignType, required: false })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @ApiProperty({ description: 'Message template', type: Object })
  @IsObject()
  @IsNotEmpty()
  template!: Record<string, any>;

  @ApiProperty({ description: 'Recipient list', type: Object })
  @IsObject()
  @IsNotEmpty()
  recipientList!: {
    recipients: Array<{
      type: 'phone' | 'username' | 'user_id';
      value: string;
    }>;
  };

  @ApiProperty({ description: 'Campaign settings', type: Object, required: false })
  @IsObject()
  @IsOptional()
  settings?: {
    delayBetweenMessages?: number;
    randomizeDelay?: boolean;
    stopOnError?: boolean;
    batchSize?: number;
    delayBetweenBatches?: number;
  };

  @ApiProperty({ description: 'Schedule configuration', type: Object, required: false })
  @IsObject()
  @IsOptional()
  schedule?: {
    type: 'immediate' | 'scheduled';
    scheduledAt?: Date;
  };

  @ApiProperty({ description: 'Campaign priority', example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Budget', required: false })
  @IsOptional()
  budget?: number;
}
