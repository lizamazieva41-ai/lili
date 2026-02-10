import { Body, Controller, Get, Param, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile retrieved', type: UserResponseDto })
  async getProfile(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto | null> {
    return this.usersService.findById(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'User profile updated', type: UserResponseDto })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) updateData: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(user.id, updateData);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get user sessions' })
  @ApiOkResponse({ description: 'User with active sessions', type: UserResponseDto })
  async getSessions(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto | null> {
    const userWithSessions = await this.usersService.findById(user.id);
    return userWithSessions;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User retrieved', type: UserResponseDto })
  async getUser(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.usersService.findById(id);
  }
}