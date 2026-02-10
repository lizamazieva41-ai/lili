import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Validation exception
 * Used for input validation errors
 */
export class ValidationException extends HttpException {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>,
    public readonly code: string = 'VALIDATION_ERROR',
  ) {
    super(
      {
        success: false,
        error: {
          code,
          message,
          details: errors || {},
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
