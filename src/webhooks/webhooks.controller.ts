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
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookResponseDto, WebhookListResponseDto, WebhookDeliveryDto } from './dto/webhook-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { WebhookTestResultDto } from './dto/webhook-test-response.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  @ApiOperation({ summary: 'List webhooks' })
  @ApiResponse({
    status: 200,
    description: 'Webhooks retrieved successfully',
    type: WebhookListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { webhooks: WebhookResponseDto[] } }> {
    const webhooks = await this.webhooksService.findAll(user.id);

    return {
      success: true,
      data: {
        webhooks: webhooks.map((webhook) => ({
          id: webhook.id,
          name: webhook.name,
          url: webhook.url,
          events: webhook.events,
          isActive: webhook.isActive,
          totalSent: webhook.totalSent,
          totalSuccess: webhook.totalSuccess,
          totalFailures: webhook.totalFailures,
          lastTriggeredAt: webhook.lastTriggeredAt,
          createdAt: webhook.createdAt,
        })),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webhook details' })
  @ApiResponse({
    status: 200,
    description: 'Webhook retrieved successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { webhook: WebhookResponseDto } }> {
    const webhook = await this.webhooksService.findOne(id, user.id);

    return {
      success: true,
      data: {
        webhook: {
          id: webhook.id,
          name: webhook.name,
          url: webhook.url,
          events: webhook.events,
          isActive: webhook.isActive,
          retryAttempts: webhook.retryAttempts,
          retryDelay: webhook.retryDelay,
          timeout: webhook.timeout,
          totalSent: webhook.totalSent,
          totalSuccess: webhook.totalSuccess,
          totalFailures: webhook.totalFailures,
          lastTriggeredAt: webhook.lastTriggeredAt,
          lastSuccessAt: webhook.lastSuccessAt,
          lastFailureAt: webhook.lastFailureAt,
          createdAt: webhook.createdAt,
        },
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new webhook' })
  @ApiResponse({
    status: 201,
    description: 'Webhook created successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createWebhookDto: CreateWebhookDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; name: string; url: string; events: string[]; isActive: boolean; secret: string; createdAt: Date } }> {
    const webhook = await this.webhooksService.create(createWebhookDto, user.id);

    return {
      success: true,
      data: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
        secret: webhook.secret!, // Only shown on creation
        createdAt: webhook.createdAt,
      },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook updated successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) updateWebhookDto: UpdateWebhookDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; name: string; url: string; events: string[]; isActive: boolean; updatedAt: Date } }> {
    const webhook = await this.webhooksService.update(id, updateWebhookDto, user.id);

    return {
      success: true,
      data: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
        updatedAt: webhook.updatedAt,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiResponse({ status: 200, description: 'Webhook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; message: string }> {
    await this.webhooksService.remove(id, user.id);

    return {
      success: true,
      message: 'Webhook deleted successfully',
    };
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook test initiated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/WebhookTestResultDto' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @HttpCode(HttpStatus.OK)
  async test(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: WebhookTestResultDto }> {
    const result = await this.webhooksService.test(id, user.id);

    return {
      success: result.success,
      data: result,
    };
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'Get webhook delivery history' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Deliveries retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            deliveries: { type: 'array', items: { $ref: '#/components/schemas/WebhookDeliveryDto' } },
            pagination: { type: 'object', additionalProperties: true },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async getDeliveries(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.webhooksService.getDeliveries(id, user.id, {
      status,
      eventType,
      page,
      limit,
    });

    return {
      success: true,
      data: {
        deliveries: result.deliveries.map((delivery) => ({
          id: delivery.id,
          eventType: delivery.eventType,
          status: delivery.status,
          statusCode: delivery.statusCode,
          attempts: delivery.attempts,
          deliveredAt: delivery.deliveredAt,
          failedAt: delivery.failedAt,
          error: delivery.error,
          createdAt: delivery.createdAt,
        })),
        pagination: result.pagination,
      },
    };
  }
}
