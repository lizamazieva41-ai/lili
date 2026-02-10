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
import { LicensesService } from './licenses.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetLicenseResponseDto } from './dto/get-license.dto';
import { GetFeaturesResponseDto } from './dto/get-features.dto';
import { GenerateApiKeyDto } from './dto/generate-api-key.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { ValidateApiKeyDto } from './dto/validate-api-key.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@ApiTags('Licenses')
@Controller('licenses')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current user license information' })
  @ApiResponse({
    status: 200,
    description: 'License information retrieved successfully',
    type: GetLicenseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active license found' })
  @HttpCode(HttpStatus.OK)
  async getCurrentLicense(@CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { license: GetLicenseResponseDto | null } }> {
    const license = await this.licensesService.getCurrentLicense(user.id);

    return {
      success: true,
      data: {
        license: license
          ? {
              id: license.id,
              plan: license.plan,
              status: license.status,
              features: license.features,
              limits: license.limits,
              usage: license.usage,
              expiresAt: license.expiresAt,
              autoRenew: license.autoRenew,
            }
          : null,
      },
    };
  }

  @Get('features')
  @ApiOperation({ summary: 'Get available features and pricing' })
  @ApiResponse({
    status: 200,
    description: 'Features retrieved successfully',
    type: GetFeaturesResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async getFeatures() {
    const features = await this.licensesService.getAvailableFeatures();

    return {
      success: true,
      data: features,
    };
  }

  @Post('generate-key')
  @ApiOperation({ summary: 'Generate API key for current license' })
  @ApiResponse({ status: 201, description: 'API key generated successfully' })
  @ApiResponse({ status: 404, description: 'No active license found' })
  @HttpCode(HttpStatus.CREATED)
  async generateApiKey(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) generateApiKeyDto: GenerateApiKeyDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; name: string; key: string; permissions: any; rateLimit: any; expiresAt: Date | null; createdAt: Date } }> {
    const dto: any = generateApiKeyDto;
    const apiKey = await this.licensesService.generateApiKey(user.id, {
      name: generateApiKeyDto.name,
      permissions:
        generateApiKeyDto.permissions &&
        Array.isArray((generateApiKeyDto.permissions as any).permissions) &&
        Array.isArray((generateApiKeyDto.permissions as any).resources)
          ? (generateApiKeyDto.permissions as any)
          : undefined,
      rateLimit: dto.rateLimit,
      expiresAt: dto.expiresAt,
      description: dto.description,
    });

    return {
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only shown once on creation
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
    };
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'List API keys for current license' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'API keys retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getApiKeys(
    @CurrentUser() user: AuthenticatedUser,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const apiKeys = await this.licensesService.getApiKeys(user.id, includeInactive === 'true');

    return {
      success: true,
      data: {
        apiKeys: apiKeys.map((key) => ({
          id: key.id,
          name: key.name,
          permissions: key.permissions,
          rateLimit: key.rateLimit,
          isActive: key.isActive,
          usageCount: key.usageCount,
          lastUsedAt: key.lastUsedAt,
          expiresAt: key.expiresAt,
          createdAt: key.createdAt,
        })),
      },
    };
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiResponse({ status: 200, description: 'API key revoked successfully' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  @HttpCode(HttpStatus.OK)
  async revokeApiKey(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; message: string }> {
    await this.licensesService.revokeApiKey(user.id, id, reason || 'Revoked by user');

    return {
      success: true,
      message: 'API key revoked successfully',
    };
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to a license plan' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid subscription data' })
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) subscribeDto: SubscribeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; plan: string; status: string; billingCycle: string; expiresAt: Date | null; autoRenew: boolean; createdAt: Date } }> {
    const license = await this.licensesService.subscribe(user.id, subscribeDto);

    return {
      success: true,
      data: {
        id: license.id,
        plan: license.plan,
        status: license.status,
        billingCycle: license.billingCycle,
        expiresAt: license.expiresAt,
        autoRenew: license.autoRenew,
        createdAt: license.createdAt,
      },
    };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate API key and permissions' })
  @ApiResponse({ status: 200, description: 'API key validation result' })
  @HttpCode(HttpStatus.OK)
  async validateApiKey(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) validateDto: ValidateApiKeyDto,
    @Body('ipAddress') ipAddress?: string,
    @Body('userAgent') userAgent?: string,
  ) {
    const result = await this.licensesService.validateApiKey(validateDto.apiKey, {
      ipAddress,
      userAgent,
    });

    return {
      success: result.isValid,
      data: {
        isValid: result.isValid,
        permissions: result.permissions,
        rateLimit: result.rateLimit,
        violations: result.violations,
        reason: result.reason,
      },
    };
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get license usage statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days' })
  @ApiResponse({ status: 200, description: 'Usage statistics retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getUsage(
    @CurrentUser() user: AuthenticatedUser,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    const usage = await this.licensesService.getUsage(user.id, days || 30);

    return {
      success: true,
      data: {
        usage,
      },
    };
  }
}
