import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateApiKeyDto {
  @ApiProperty({ description: 'API key to validate' })
  @IsString()
  @IsNotEmpty()
  apiKey!: string;
}
