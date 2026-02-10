/**
 * TDLib File Controller
 * 
 * REST API endpoints for file operations
 */

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TdlibFileService } from '../services/tdlib-file.service';
import { TdlibRateLimitGuard } from '../guards/tdlib-rate-limit.guard';

@Controller('tdlib/files')
@UseGuards(TdlibRateLimitGuard)
export class TdlibFileController {
  constructor(private readonly fileService: TdlibFileService) {}

  @Post('download')
  async downloadFile(
    @Body()
    body: {
      clientId: string;
      fileId: number;
      priority?: number;
      offset?: number;
      limit?: number;
      synchronous?: boolean;
    },
  ) {
    return this.fileService.downloadFile(
      body.clientId,
      body.fileId,
      body.priority,
      body.offset,
      body.limit,
      body.synchronous,
    );
  }

  @Post('upload')
  async uploadFile(
    @Body()
    body: {
      clientId: string;
      file: Record<string, unknown>;
      fileType: Record<string, unknown>;
      priority?: number;
    },
  ) {
    return this.fileService.uploadFile(
      body.clientId,
      body.file,
      body.fileType,
      body.priority,
    );
  }

  @Get(':clientId/:fileId')
  async getFile(
    @Param('clientId') clientId: string,
    @Param('fileId') fileId: number,
  ) {
    return this.fileService.getFile(clientId, fileId);
  }

  @Post('cancel-download')
  async cancelDownloadFile(
    @Body()
    body: {
      clientId: string;
      fileId: number;
      onlyIfPending?: boolean;
    },
  ) {
    return this.fileService.cancelDownloadFile(
      body.clientId,
      body.fileId,
      body.onlyIfPending,
    );
  }
}
