import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class GenerateApiKeyDto {
  @ApiProperty({ description: 'API key name', example: 'Production API Key' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Permissions', type: Object, required: false })
  @IsObject()
  @IsOptional()
  permissions?: {
    permissions: string[];
    resources: string[];
  };

  @ApiProperty({ description: 'Rate limit configuration', type: Object, required: false })
  @IsObject()
  @IsOptional()
  rateLimit?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsOptional()
  expiresAt?: Date;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
