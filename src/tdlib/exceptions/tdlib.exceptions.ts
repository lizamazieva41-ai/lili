import { HttpException, HttpStatus } from '@nestjs/common';

export class TdlibException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
    this.name = 'TdlibException';
  }
}

export class TdlibNotReadyException extends TdlibException {
  constructor(message = 'TDLib is not ready or not initialized') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'TdlibNotReadyException';
  }
}

export class TdlibClientNotFoundException extends TdlibException {
  constructor(clientId: string) {
    super(`TDLib client not found: ${clientId}`, HttpStatus.NOT_FOUND);
    this.name = 'TdlibClientNotFoundException';
  }
}

export class TdlibLibraryLoadException extends TdlibException {
  constructor(message: string) {
    super(`Failed to load TDLib library: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'TdlibLibraryLoadException';
  }
}

export class TdlibSendFailedException extends TdlibException {
  constructor(message = 'Failed to send request to TDLib') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'TdlibSendFailedException';
  }
}

export class TdlibInvalidArgumentException extends TdlibException {
  constructor(message: string) {
    super(`Invalid argument: ${message}`, HttpStatus.BAD_REQUEST);
    this.name = 'TdlibInvalidArgumentException';
  }
}
