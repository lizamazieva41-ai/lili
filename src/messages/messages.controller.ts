import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { BulkMessageDto } from './dto/bulk-message.dto';
import { MessageResponseDto, MessageListResponseDto, MessageStatusDto } from './dto/message-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send individual message' })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.OK)
  async send(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) sendMessageDto: SendMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { messageId: string; status: string; sentAt: Date | null } }> {
    const message = await this.messagesService.send(sendMessageDto, user.id);

    return {
      success: true,
      data: {
        messageId: message.id,
        status: message.status,
        sentAt: message.sentAt,
      },
    };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Send bulk messages' })
  @ApiResponse({
    status: 202,
    description: 'Bulk messages queued successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.ACCEPTED)
  async sendBulk(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) bulkMessageDto: BulkMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: any }> {
    const result = await this.messagesService.sendBulk(bulkMessageDto, user.id);

    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List messages with filtering' })
  @ApiQuery({ name: 'campaignId', required: false, description: 'Filter by campaign ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: MessageListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('campaignId') campaignId?: string,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.messagesService.findAll({
      campaignId,
      status,
      userId: user.id,
      page,
      limit,
    });

    return {
      success: true,
      data: {
        messages: result.messages.map((message) => ({
          id: message.id,
          campaignId: message.campaignId,
          phoneNumber: message.phoneNumber,
          content: message.content,
          type: message.type,
          status: message.status,
          sentAt: message.sentAt,
          deliveredAt: message.deliveredAt,
          failedAt: message.failedAt,
          errorMessage: message.errorMessage,
          createdAt: message.createdAt,
        })),
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message details' })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { message: MessageResponseDto } }> {
    const message = await this.messagesService.findOne(id, user.id);

    return {
      success: true,
      data: {
        message: {
          id: message.id,
          campaignId: message.campaignId,
          phoneNumber: message.phoneNumber,
          content: message.content,
          type: message.type,
          status: message.status,
          sentAt: message.sentAt,
          deliveredAt: message.deliveredAt,
          readAt: message.readAt,
          failedAt: message.failedAt,
          errorMessage: message.errorMessage,
          metadata: message.metadata,
          createdAt: message.createdAt,
        },
      },
    };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get message delivery status' })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved successfully',
    type: MessageStatusDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @HttpCode(HttpStatus.OK)
  async getStatus(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { status: MessageStatusDto } }> {
    const status = await this.messagesService.getStatus(id, user.id);

    return {
      success: true,
      data: {
        status,
      },
    };
  }
}
