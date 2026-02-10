import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto, JobListResponseDto, QueueStatusResponseDto } from './dto/job-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid job data' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createJobDto: CreateJobDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; type: string; queue: string; status: string; createdAt: Date } }> {
    const job = await this.jobsService.create(createJobDto, user.id);

    return {
      success: true,
      data: {
        id: job.id,
        type: job.type,
        queue: job.queue,
        status: job.status,
        createdAt: job.createdAt,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'List jobs with filtering' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by job type' })
  @ApiQuery({ name: 'queue', required: false, description: 'Filter by queue name' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
    type: JobListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('queue') queue?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.jobsService.findAll({
      status,
      type,
      queue,
      userId: user.id,
      page,
      limit,
    });

    return {
      success: true,
      data: {
        jobs: result.jobs.map((job) => ({
          id: job.id,
          type: job.type,
          queue: job.queue,
          status: job.status,
          progress: job.progress,
          attempts: job.attempts,
          maxAttempts: job.maxAttempts,
          createdAt: job.createdAt,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          failedAt: job.failedAt,
          error: job.error,
        })),
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job status and details' })
  @ApiResponse({
    status: 200,
    description: 'Job retrieved successfully',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<{ success: boolean; data: JobResponseDto }> {
    const job = await this.jobsService.findOne(id);

    return {
      success: true,
      data: {
        id: job.id,
        type: job.type,
        queue: job.queue,
        status: job.status,
        progress: job.progress,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        failedAt: job.failedAt,
        error: job.error,
        errorMessage: job.errorMessage,
        executions: job.executions,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a job' })
  @ApiResponse({ status: 200, description: 'Job cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.jobsService.remove(id);

    return {
      success: true,
      message: 'Job cancelled successfully',
    };
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry a failed job' })
  @ApiResponse({ status: 200, description: 'Job retried successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 400, description: 'Job is not in failed status' })
  @HttpCode(HttpStatus.OK)
  async retry(@Param('id') id: string): Promise<{ success: boolean; data: { id: string; status: string } }> {
    const job = await this.jobsService.retry(id);

    return {
      success: true,
      data: {
        id: job.id,
        status: job.status,
      },
    };
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get job execution logs' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @HttpCode(HttpStatus.OK)
  async getLogs(@Param('id') id: string): Promise<{ success: boolean; data: { logs: any } }> {
    const logs = await this.jobsService.getLogs(id);

    return {
      success: true,
      data: {
        logs,
      },
    };
  }
}
