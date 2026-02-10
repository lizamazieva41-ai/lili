import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';

export class UpdateCampaignDto {
  @ApiProperty({ description: 'Campaign name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Campaign description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Message template', type: Object, required: false })
  @IsObject()
  @IsOptional()
  template?: Record<string, any>;

  @ApiProperty({ description: 'Recipient list', type: Object, required: false })
  @IsObject()
  @IsOptional()
  recipientList?: {
    recipients: Array<{
      type: 'phone' | 'username' | 'user_id';
      value: string;
    }>;
  };

  @ApiProperty({ description: 'Campaign settings', type: Object, required: false })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
