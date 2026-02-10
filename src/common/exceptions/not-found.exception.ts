import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Not found exception
 * Used when a requested resource is not found
 */
export class NotFoundException extends HttpException {
  constructor(
    resource: string,
    identifier?: string | number,
    public readonly code: string = 'RESOURCE_NOT_FOUND',
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(
      {
        success: false,
        error: {
          code,
          message,
          resource,
          identifier,
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
