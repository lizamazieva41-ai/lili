import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ description: 'Job type', example: 'bulk_message' })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: 'Queue name', example: 'messages', required: false })
  @IsString()
  @IsOptional()
  queue?: string;

  @ApiProperty({ description: 'Job data/payload', type: Object })
  @IsObject()
  @IsNotEmpty()
  data!: Record<string, any>;

  @ApiProperty({ description: 'Job priority (higher = more priority)', example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Delay before execution (ms)', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  delay?: number;

  @ApiProperty({ description: 'Maximum retry attempts', example: 3, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxAttempts?: number;

  @ApiProperty({ description: 'Job timeout (ms)', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeout?: number;

  @ApiProperty({ description: 'Cron expression for recurring jobs', required: false })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ description: 'Job tags', type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Additional metadata', type: Object, required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
