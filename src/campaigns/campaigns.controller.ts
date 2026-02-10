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
import { CampaignsService } from './campaigns.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignResponseDto, CampaignListResponseDto, CampaignStatsDto } from './dto/campaign-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@ApiTags('Campaigns')
@Controller('campaigns')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of campaigns' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by campaign type' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    type: CampaignListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('accountId') accountId?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.campaignsService.findAll(user.id, {
      status,
      type,
      accountId,
      page,
      limit,
    });

    return {
      success: true,
      data: {
        campaigns: result.campaigns.map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          status: campaign.status,
          progress: campaign.progress,
          successRate: campaign.successRate,
          deliveryRate: campaign.deliveryRate,
          accountId: campaign.accountId,
          // `Campaign` model stores `accountId`; relation shape depends on include in service.
          account: (campaign as any).account,
          createdAt: campaign.createdAt,
          startedAt: campaign.startedAt,
          completedAt: campaign.completedAt,
        })),
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign details' })
  @ApiResponse({
    status: 200,
    description: 'Campaign retrieved successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { campaign: CampaignResponseDto } }> {
    const campaign = await this.campaignsService.findOne(id, user.id);

    return {
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          type: campaign.type,
          status: campaign.status,
          progress: campaign.progress,
          successRate: campaign.successRate,
          deliveryRate: campaign.deliveryRate,
          accountId: campaign.accountId,
          account: campaign.account,
          template: campaign.template,
          recipientList: campaign.recipientList,
          settings: campaign.settings,
          tags: campaign.tags,
          createdAt: campaign.createdAt,
          startedAt: campaign.startedAt,
          completedAt: campaign.completedAt,
        },
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new campaign' })
  @ApiResponse({
    status: 201,
    description: 'Campaign created successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; name: string; type: string; status: string; createdAt: Date } }> {
    const campaign = await this.campaignsService.create(createCampaignDto, user.id);

    return {
      success: true,
      data: {
        id: campaign.id,
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        createdAt: campaign.createdAt,
      },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  @ApiResponse({
    status: 200,
    description: 'Campaign updated successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) updateCampaignDto: UpdateCampaignDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; name: string; status: string; updatedAt: Date } }> {
    const campaign = await this.campaignsService.update(id, updateCampaignDto, user.id);

    return {
      success: true,
      data: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        updatedAt: campaign.updatedAt,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; message: string }> {
    await this.campaignsService.remove(id, user.id);

    return {
      success: true,
      message: 'Campaign deleted successfully',
    };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start campaign' })
  @ApiResponse({ status: 200, description: 'Campaign started successfully' })
  @ApiResponse({ status: 400, description: 'Campaign cannot be started' })
  @HttpCode(HttpStatus.OK)
  async start(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string; startedAt: Date | null } }> {
    const campaign = await this.campaignsService.start(id, user.id);

    return {
      success: true,
      data: {
        id: campaign.id,
        status: campaign.status,
        startedAt: campaign.startedAt,
      },
    };
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause campaign' })
  @ApiResponse({ status: 200, description: 'Campaign paused successfully' })
  @ApiResponse({ status: 400, description: 'Campaign cannot be paused' })
  @HttpCode(HttpStatus.OK)
  async pause(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string; pausedAt: Date | null } }> {
    const campaign = await this.campaignsService.pause(id, user.id);

    return {
      success: true,
      data: {
        id: campaign.id,
        status: campaign.status,
        pausedAt: campaign.pausedAt,
      },
    };
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume campaign' })
  @ApiResponse({ status: 200, description: 'Campaign resumed successfully' })
  @ApiResponse({ status: 400, description: 'Campaign cannot be resumed' })
  @HttpCode(HttpStatus.OK)
  async resume(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string } }> {
    const campaign = await this.campaignsService.resume(id, user.id);

    return {
      success: true,
      data: {
        id: campaign.id,
        status: campaign.status,
      },
    };
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get campaign statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: CampaignStatsDto,
  })
  @HttpCode(HttpStatus.OK)
  async getStats(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { stats: CampaignStatsDto } }> {
    const stats = await this.campaignsService.getStats(id, user.id);

    return {
      success: true,
      data: {
        stats,
      },
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get campaign messages' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by message status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.campaignsService.getMessages(id, user.id, {
      status,
      page,
      limit,
    });

    return {
      success: true,
      data: result,
    };
  }
}
