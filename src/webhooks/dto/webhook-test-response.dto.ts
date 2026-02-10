import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookTestResultDto {
  @ApiProperty({ description: 'Whether the test job was created successfully', example: true })
  success!: boolean;

  @ApiProperty({ description: 'Time the test was triggered', example: '2026-01-27T12:00:00.000Z' })
  testedAt!: Date;

  @ApiPropertyOptional({ description: 'HTTP status code if request was executed inline', example: 200 })
  statusCode?: number;

  @ApiPropertyOptional({ description: 'Response payload if request was executed inline' })
  response?: unknown;

  @ApiPropertyOptional({ description: 'Error message if failed', example: 'Webhook is not active' })
  error?: string;
}

