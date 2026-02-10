import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { 
  BusinessException, 
  ValidationException, 
  NotFoundException, 
  UnauthorizedException,
  ErrorResponse,
} from '../exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle custom exceptions
    if (exception instanceof BusinessException) {
      return this.handleBusinessException(exception, response, request);
    }

    if (exception instanceof ValidationException) {
      return this.handleValidationException(exception, response, request);
    }

    if (exception instanceof NotFoundException) {
      return this.handleNotFoundException(exception, response, request);
    }

    if (exception instanceof UnauthorizedException) {
      return this.handleUnauthorizedException(exception, response, request);
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response, request);
    }

    // Handle generic Error
    if (exception instanceof Error) {
      return this.handleGenericError(exception, response, request);
    }

    // Handle unknown errors
    return this.handleUnknownError(exception, response, request);
  }

  private handleBusinessException(
    exception: BusinessException,
    response: Response,
    request: Request,
  ): void {
    const status = exception.getStatus();
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: exception.details,
      },
    };

    this.logger.warn(
      `Business exception: ${exception.code} - ${exception.message}`,
      { path: request.url, method: request.method },
    );

    response.status(status).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleValidationException(
    exception: ValidationException,
    response: Response,
    request: Request,
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: exception.errors,
      },
    };

    this.logger.warn(
      `Validation error: ${exception.message}`,
      { path: request.url, method: request.method, errors: exception.errors },
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleNotFoundException(
    exception: NotFoundException,
    response: Response,
    request: Request,
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        resource: (exception as any).resource,
        identifier: (exception as any).identifier,
      },
    };

    this.logger.debug(
      `Resource not found: ${exception.message}`,
      { path: request.url, method: request.method },
    );

    response.status(HttpStatus.NOT_FOUND).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleUnauthorizedException(
    exception: UnauthorizedException,
    response: Response,
    request: Request,
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        reason: exception.reason,
      },
    };

    this.logger.warn(
      `Unauthorized access: ${exception.message}`,
      { path: request.url, method: request.method, reason: exception.reason },
    );

    response.status(HttpStatus.UNAUTHORIZED).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    request: Request,
  ): void {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'An error occurred';
    let details = null;
    let code = 'HTTP_EXCEPTION';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || responseObj.error?.message || message;
      details = responseObj.details || responseObj.error?.details || null;
      code = responseObj.error?.code || responseObj.code || code;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };

    this.logger.error(
      `HTTP exception: ${message}`,
      { status, path: request.url, method: request.method },
    );

    response.status(status).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleGenericError(
    exception: Error,
    response: Response,
    request: Request,
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : exception.message,
        details: process.env.NODE_ENV === 'production' 
          ? undefined 
          : { stack: exception.stack },
      },
    };

    this.logger.error(
      `Unexpected error: ${exception.message}`,
      exception.stack,
      { path: request.url, method: request.method },
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private handleUnknownError(
    exception: unknown,
    response: Response,
    request: Request,
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        details: process.env.NODE_ENV === 'production' 
          ? undefined 
          : { error: String(exception) },
      },
    };

    this.logger.error(
      'Unknown error occurred',
      { error: exception, path: request.url, method: request.method },
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}