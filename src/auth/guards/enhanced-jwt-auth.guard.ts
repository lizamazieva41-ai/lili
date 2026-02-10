import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionManagementService } from '../session-management.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class EnhancedJwtAuthGuard implements CanActivate {
  constructor(
    private sessionManagementService: SessionManagementService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    // Validate session
    const validationResult = await this.sessionManagementService.validateSession(token, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    if (!validationResult.isValid) {
      throw new UnauthorizedException(`Session invalid: ${validationResult.reason}`);
    }

    // Get full user information
    const user = await this.usersService.findById(validationResult.session!.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Attach user and session to request
    request.user = user;
    request.session = validationResult.session;

    // Check additional requirements if any
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (requiredPermissions) {
      // This will be implemented with the licensing system
      // For now, just log the requirement
      console.log(`Required permissions: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }

  private extractTokenFromHeader(authHeader: string): string | null {
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}