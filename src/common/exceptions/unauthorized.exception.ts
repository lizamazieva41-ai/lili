import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Unauthorized exception
 * Used for authentication and authorization errors
 */
export class UnauthorizedException extends HttpException {
  constructor(
    message: string = 'Unauthorized',
    public readonly code: string = 'UNAUTHORIZED',
    public readonly reason?: string,
  ) {
    super(
      {
        success: false,
        error: {
          code,
          message,
          reason,
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
