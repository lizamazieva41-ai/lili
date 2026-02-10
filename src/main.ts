import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { ApiVersionMiddleware } from './common/middleware/api-version.middleware';
import { CustomLoggerService } from './common/services/logger.service';
import { HttpLoggingMiddleware } from './common/middleware/http-logging.middleware';

async function bootstrap() {
  // Check if running as worker process
  const appMode = process.env.APP_MODE || process.env.NODE_ENV === 'production' ? 'api' : 'api';
  if (appMode === 'worker') {
    console.log('⚠️  This is the API server entry point. Use worker.ts for worker processes.');
    console.log('   Set APP_MODE=api or use: node dist/main.js');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  
  const configService = app.get(ConfigService);
  
  // Log process type
  console.log(`📦 Process mode: ${appMode}`);
  
  // Security middleware (should be first)
  const securityMiddleware = app.get(SecurityMiddleware);
  app.use(securityMiddleware);

  // API versioning middleware
  const apiVersionMiddleware = app.get(ApiVersionMiddleware);
  app.use(apiVersionMiddleware.use.bind(apiVersionMiddleware));

  // HTTP logging middleware
  const httpLoggingMiddleware = app.get(HttpLoggingMiddleware);
  app.use(httpLoggingMiddleware.use.bind(httpLoggingMiddleware));

  // Compression middleware
  app.use(compression());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // CORS with security
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });
  
  // Trust proxy for correct IP detection
  app.set('trust proxy', 1);
  
  // Prefix
  app.setGlobalPrefix('api');
  
  // Swagger/OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Telegram Platform Backend API')
    .setDescription('Enterprise-grade backend API for Telegram marketing automation platform')
    .setVersion('3.0.0')
    .addTag('auth', 'Authentication and authorization endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('accounts', 'Telegram account management')
    .addTag('campaigns', 'Campaign management endpoints')
    .addTag('messages', 'Message sending and management')
    .addTag('jobs', 'Job processing and queue management')
    .addTag('licenses', 'License and subscription management')
    .addTag('proxies', 'Proxy management endpoints')
    .addTag('webhooks', 'Webhook configuration and delivery')
    .addTag('analytics', 'Analytics and reporting endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'Enter API key',
      },
      'api-key',
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.telegram-automation.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Telegram Platform Backend v3.0 running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🔒 Security monitoring: Enabled`);
  console.log(`📝 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();