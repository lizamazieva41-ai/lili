import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

export class BulkMessageDto {
  @ApiProperty({ description: 'Campaign ID (optional if creating new campaign)' })
  @IsString()
  @IsOptional()
  campaignId?: string;

  @ApiProperty({ description: 'Account ID to send from' })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({ description: 'Recipients list', type: [String] })
  @IsArray()
  @IsNotEmpty()
  recipients!: string[];

  @ApiProperty({ description: 'Message content', type: Object })
  @IsObject()
  @IsNotEmpty()
  message!: {
    text: string;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    mediaUrl?: string;
    mediaType?: string;
  };

  @ApiProperty({ description: 'Bulk sending settings', type: Object, required: false })
  @IsObject()
  @IsOptional()
  settings?: {
    batchSize?: number;
    delayBetweenBatches?: number;
    randomizeDelay?: boolean;
    stopOnError?: boolean;
  };
}
