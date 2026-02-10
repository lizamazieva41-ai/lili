import { ApiProperty } from '@nestjs/swagger';

export class JobResponseDto {
  @ApiProperty({ description: 'Job ID' })
  id!: string;

  @ApiProperty({ description: 'Job type' })
  type!: string;

  @ApiProperty({ description: 'Queue name' })
  queue!: string;

  @ApiProperty({ description: 'Job status' })
  status!: string;

  @ApiProperty({ description: 'Progress (0.0 to 1.0)', required: false })
  progress!: number | null;

  @ApiProperty({ description: 'Number of attempts' })
  attempts!: number;

  @ApiProperty({ description: 'Maximum attempts' })
  maxAttempts!: number;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Started at', required: false })
  startedAt!: Date | null;

  @ApiProperty({ description: 'Completed at', required: false })
  completedAt!: Date | null;

  @ApiProperty({ description: 'Failed at', required: false })
  failedAt!: Date | null;

  @ApiProperty({ description: 'Error message', required: false })
  error!: string | null;

  @ApiProperty({ description: 'Detailed error message', required: false })
  errorMessage?: string | null;

  @ApiProperty({ description: 'Execution history/logs', required: false, type: 'array' })
  executions?: any[];
}

export class JobListResponseDto {
  @ApiProperty({ description: 'List of jobs', type: [JobResponseDto] })
  jobs!: JobResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class QueueStatusResponseDto {
  @ApiProperty({ description: 'Queue name' })
  name!: string;

  @ApiProperty({ description: 'Waiting jobs count' })
  waiting!: number;

  @ApiProperty({ description: 'Active jobs count' })
  active!: number;

  @ApiProperty({ description: 'Completed jobs count' })
  completed!: number;

  @ApiProperty({ description: 'Failed jobs count' })
  failed!: number;

  @ApiProperty({ description: 'Delayed jobs count' })
  delayed!: number;

  @ApiProperty({ description: 'Paused jobs count' })
  paused!: number;
}
