import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt, Min, IsBoolean, IsObject, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ description: 'Webhook name', example: 'Campaign Events Webhook' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Webhook URL', example: 'https://example.com/webhook' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @ApiProperty({ description: 'Events to listen for', type: [String], example: ['campaign.started', 'message.sent'] })
  @IsArray()
  @IsNotEmpty()
  events!: string[];

  @ApiProperty({ description: 'HMAC secret for verification', required: false })
  @IsString()
  @IsOptional()
  secret?: string;

  @ApiProperty({ description: 'Retry attempts', example: 3, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  retryAttempts?: number;

  @ApiProperty({ description: 'Retry delay (ms)', example: 5000, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  retryDelay?: number;

  @ApiProperty({ description: 'Timeout (ms)', example: 30000, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeout?: number;

  @ApiProperty({ description: 'Custom headers', type: Object, required: false })
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({ description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
