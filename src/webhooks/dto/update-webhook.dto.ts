import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean, IsObject, IsUrl } from 'class-validator';

export class UpdateWebhookDto {
  @ApiProperty({ description: 'Webhook name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Webhook URL', required: false })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Events to listen for', type: [String], required: false })
  @IsArray()
  @IsOptional()
  events?: string[];

  @ApiProperty({ description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Custom headers', type: Object, required: false })
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;
}
