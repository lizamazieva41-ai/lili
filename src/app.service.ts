import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Telegram Platform Backend API v3.0 is running!';
  }
}