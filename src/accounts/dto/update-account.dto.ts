import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'Bio', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Daily message limit', required: false })
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  dailyLimit?: number;

  @ApiProperty({ description: 'Hourly message limit', required: false })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  hourlyLimit?: number;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
