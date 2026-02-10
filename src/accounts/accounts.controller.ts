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
import { AccountsService } from './accounts.service';
import { EnhancedJwtAuthGuard } from '../auth/guards/enhanced-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto, AccountListResponseDto } from './dto/account-response.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AssignProxyDto } from './dto/assign-proxy.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(EnhancedJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of Telegram accounts' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: AccountListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const result = await this.accountsService.findAll(user.id, {
      status,
      page,
      limit,
    });

    return {
      success: true,
      data: {
        accounts: result.accounts.map((account) => ({
          id: account.id,
          phone: account.phone,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
          status: account.status,
          activityScore: account.activityScore,
          reputation: account.reputation,
          lastActiveAt: account.lastActiveAt,
          proxy: account.proxyAssignments?.[0]?.proxy
            ? {
                id: account.proxyAssignments[0].proxy.id,
                name: account.proxyAssignments[0].proxy.name,
                host: account.proxyAssignments[0].proxy.host,
                country: account.proxyAssignments[0].proxy.country,
              }
            : null,
          createdAt: account.createdAt,
        })),
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details' })
  @ApiResponse({
    status: 200,
    description: 'Account retrieved successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const account = await this.accountsService.findOne(id, user.id);

    return {
      success: true,
      data: {
        account: {
          id: account.id,
          phone: account.phone,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
          status: account.status,
          activityScore: account.activityScore,
          reputation: account.reputation,
          lastActiveAt: account.lastActiveAt,
          proxy: account.proxyAssignments?.[0]?.proxy
            ? {
                id: account.proxyAssignments[0].proxy.id,
                name: account.proxyAssignments[0].proxy.name,
                host: account.proxyAssignments[0].proxy.host,
                country: account.proxyAssignments[0].proxy.country,
              }
            : null,
          createdAt: account.createdAt,
        },
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Add new Telegram account' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or account already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createAccountDto: CreateAccountDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; phone: string; status: string; createdAt: Date } }> {
    const account = await this.accountsService.create(createAccountDto, user.id);

    return {
      success: true,
      data: {
        id: account.id,
        phone: account.phone,
        status: account.status,
        createdAt: account.createdAt,
      },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { id: string; phone: string; firstName: string | null; lastName: string | null; updatedAt: Date } }> {
    const account = await this.accountsService.update(id, updateAccountDto, user.id);

    return {
      success: true,
      data: {
        id: account.id,
        phone: account.phone,
        firstName: account.firstName,
        lastName: account.lastName,
        updatedAt: account.updatedAt,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; message: string }> {
    await this.accountsService.remove(id, user.id);

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify Telegram account' })
  @ApiResponse({ status: 200, description: 'Account verification initiated' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async verify(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string; verification: any } }> {
    const account = await this.accountsService.verify(id, user.id);

    return {
      success: true,
      data: {
        id: account.id,
        status: account.status,
        verification: account.verification,
      },
    };
  }

  @Get(':id/proxy')
  @ApiOperation({ summary: 'Get assigned proxy for account' })
  @ApiResponse({ status: 200, description: 'Proxy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account or proxy not found' })
  @HttpCode(HttpStatus.OK)
  async getProxy(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { proxy: { id: string; name: string | null; host: string; port: number; country: string | null } | null } }> {
    const proxy = await this.accountsService.getProxy(id, user.id);

    if (!proxy) {
      return {
        success: true,
        data: {
          proxy: null,
        },
      };
    }

    return {
      success: true,
      data: {
        proxy: {
          id: proxy.id,
          name: proxy.name,
          host: proxy.host,
          port: proxy.port,
          country: proxy.country,
        },
      },
    };
  }

  @Post(':id/proxy')
  @ApiOperation({ summary: 'Assign proxy to account' })
  @ApiResponse({ status: 200, description: 'Proxy assigned successfully' })
  @ApiResponse({ status: 404, description: 'Account or proxy not found' })
  @HttpCode(HttpStatus.OK)
  async assignProxy(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) assignProxyDto: AssignProxyDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; data: { proxy: { id: string; name: string | null; host: string; port: number; country: string | null } } }> {
    const proxy = await this.accountsService.assignProxy(id, assignProxyDto.proxyId, user.id);

    return {
      success: true,
      data: {
        proxy: {
          id: proxy.id,
          name: proxy.name,
          host: proxy.host,
          port: proxy.port,
          country: proxy.country,
        },
      },
    };
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get account statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async getStats(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { stats: any } }> {
    const stats = await this.accountsService.getStats(id, user.id);

    return {
      success: true,
      data: {
        stats,
      },
    };
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate account' })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string } }> {
    const account = await this.accountsService.activate(id, user.id);

    return {
      success: true,
      data: {
        id: account.id,
        status: account.status,
      },
    };
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate account' })
  @ApiResponse({ status: 200, description: 'Account deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<{ success: boolean; data: { id: string; status: string } }> {
    const account = await this.accountsService.deactivate(id, user.id);

    return {
      success: true,
      data: {
        id: account.id,
        status: account.status,
      },
    };
  }
}
