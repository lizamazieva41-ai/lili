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
import { ProxiesService } from './proxies.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import { ProxyResponseDto, ProxyListResponseDto } from './dto/proxy-response.dto';
import { ProxyTestResponseDto } from './dto/proxy-test-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RotateProxiesResultDto } from './dto/rotate-proxies-response.dto';

@ApiTags('Proxies')
@Controller('proxies')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProxiesController {
  constructor(private readonly proxiesService: ProxiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of proxies with filtering' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by proxy type' })
  @ApiQuery({ name: 'country', required: false, description: 'Filter by country code' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Proxies retrieved successfully',
    type: ProxyListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('country') country?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.proxiesService.findAll({
      status,
      type,
      country,
      page,
      limit,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get proxy details' })
  @ApiResponse({
    status: 200,
    description: 'Proxy retrieved successfully',
    type: ProxyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proxy not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<{ success: boolean; data: { proxy: ProxyResponseDto } }> {
    const proxy = await this.proxiesService.findOne(id);

    return {
      success: true,
      data: {
        proxy: {
          id: proxy.id,
          name: proxy.name,
          type: proxy.type,
          host: proxy.host,
          port: proxy.port,
          country: proxy.country,
          region: proxy.region,
          status: proxy.status,
          isActive: proxy.isActive,
          healthScore: proxy.healthScore,
          responseTime: proxy.responseTime,
          lastChecked: proxy.lastChecked,
          lastUsedAt: proxy.lastUsedAt,
          tags: proxy.tags,
          createdAt: proxy.createdAt,
          updatedAt: proxy.updatedAt,
        },
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Add new proxy configuration' })
  @ApiResponse({
    status: 201,
    description: 'Proxy created successfully',
    type: ProxyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or proxy already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createProxyDto: CreateProxyDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: ProxyResponseDto }> {
    const proxy = await this.proxiesService.create(createProxyDto, user.id);

    return {
      success: true,
      data: {
        id: proxy.id,
        name: proxy.name,
        type: proxy.type,
        host: proxy.host,
        port: proxy.port,
        country: proxy.country,
        region: proxy.region,
        status: proxy.status,
        isActive: proxy.isActive,
        healthScore: proxy.healthScore,
        responseTime: proxy.responseTime,
        lastChecked: proxy.lastChecked,
        lastUsedAt: proxy.lastUsedAt,
        tags: proxy.tags,
        createdAt: proxy.createdAt,
        updatedAt: proxy.updatedAt,
      },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update proxy configuration' })
  @ApiResponse({
    status: 200,
    description: 'Proxy updated successfully',
    type: ProxyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proxy not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) updateProxyDto: UpdateProxyDto,
  ): Promise<{ success: boolean; data: ProxyResponseDto }> {
    const proxy = await this.proxiesService.update(id, updateProxyDto);

    return {
      success: true,
      data: {
        id: proxy.id,
        name: proxy.name,
        type: proxy.type,
        host: proxy.host,
        port: proxy.port,
        country: proxy.country,
        region: proxy.region,
        status: proxy.status,
        isActive: proxy.isActive,
        healthScore: proxy.healthScore,
        responseTime: proxy.responseTime,
        lastChecked: proxy.lastChecked,
        lastUsedAt: proxy.lastUsedAt,
        tags: proxy.tags,
        createdAt: proxy.createdAt,
        updatedAt: proxy.updatedAt,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove proxy configuration' })
  @ApiResponse({ status: 200, description: 'Proxy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Proxy not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.proxiesService.remove(id);

    return {
      success: true,
      message: 'Proxy deleted successfully',
    };
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test proxy connectivity and health' })
  @ApiResponse({
    status: 200,
    description: 'Proxy test completed',
    type: ProxyTestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proxy not found' })
  @HttpCode(HttpStatus.OK)
  async testProxy(@Param('id') id: string): Promise<{ success: boolean; data: ProxyTestResponseDto }> {
    const result = await this.proxiesService.testProxy(id);

    return {
      success: true,
      data: result,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get proxy statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getStats(): Promise<{ success: boolean; data: { stats: any } }> {
    const stats = await this.proxiesService.getStats();

    return {
      success: true,
      data: {
        stats,
      },
    };
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate proxies for accounts' })
  @ApiResponse({
    status: 200,
    description: 'Proxy rotation completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/RotateProxiesResultDto' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async rotateProxies(@Body('accountIds') accountIds?: string[]): Promise<{ success: boolean; data: RotateProxiesResultDto }> {
    const result = await this.proxiesService.rotateProxies(accountIds);

    return {
      success: true,
      data: result,
    };
  }
}
