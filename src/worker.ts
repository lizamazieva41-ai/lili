/**
 * Worker entry point for BullMQ job processors
 * 
 * This file starts only the worker processes, not the API server.
 * Use PM2 to run this separately from the API server.
 * 
 * Usage:
 *   node dist/worker.js
 *   or via PM2: pm2 start ecosystem.config.js --only worker
 */

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomLoggerService } from './common/services/logger.service';

async function bootstrapWorker() {
  // Ensure we're running as worker
  const appMode = process.env.APP_MODE || 'worker';
  if (appMode !== 'worker') {
    console.log('⚠️  This is the worker entry point. Use main.ts for API server.');
    console.log('   Set APP_MODE=worker or use: node dist/worker.js');
    process.exit(1);
  }

  // Use createApplicationContext to avoid starting HTTP server
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: new CustomLoggerService(),
  });

  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);

  logger.log('🚀 Telegram Platform Backend Worker started');
  logger.log(`📦 Process mode: ${appMode}`);
  logger.log(`📊 Environment: ${configService.get('NODE_ENV', 'development')}`);
  logger.log(`🔧 Queue processing: Enabled`);
  logger.log('ℹ️  HTTP server: Disabled (worker mode)');

  // The AppModule will automatically start all registered BullMQ processors
  // No need to manually start them here

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });
}

bootstrapWorker().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});
