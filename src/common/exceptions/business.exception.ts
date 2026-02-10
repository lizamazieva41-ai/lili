import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Business logic exception
 * Used for business rule violations
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
      },
      statusCode,
    );
  }
}
