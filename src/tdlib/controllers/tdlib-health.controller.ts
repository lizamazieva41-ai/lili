/**
 * TDLib Health Controller
 * 
 * REST API endpoints for health checks
 */

import { Controller, Get } from '@nestjs/common';
import { TdlibHealthService } from '../services/tdlib-health.service';

@Controller('tdlib/health')
export class TdlibHealthController {
  constructor(private readonly healthService: TdlibHealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('check')
  async performHealthCheck() {
    return this.healthService.performHealthCheck();
  }
}
