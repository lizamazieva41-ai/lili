import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { QueueStatusResponseDto } from './dto/job-response.dto';

@ApiTags('Queues')
@Controller('queues')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth()
export class QueuesController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get queue status and statistics' })
  @ApiQuery({ name: 'queue', required: false, description: 'Specific queue name' })
  @ApiResponse({
    status: 200,
    description: 'Queue status retrieved successfully',
    type: [QueueStatusResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async getStatus(@Query('queue') queue?: string) {
    const status = await this.jobsService.getQueueStatus(queue);

    return {
      success: true,
      data: {
        queues: Array.isArray(status) ? status : [status],
      },
    };
  }
}
