import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check root', description: 'Simple readiness string' })
  @ApiOkResponse({
    description: 'Application root response',
    schema: {
      type: 'string',
      example: 'Telegram Platform Backend API v3.0 is running!',
    },
  })
  getHello(): string {
    return 'Telegram Platform Backend API v3.0 is running!';
  }
}