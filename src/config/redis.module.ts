import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRoot() {
    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisService,
          useFactory: (configService: ConfigService) => {
            return new RedisService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [RedisService],
    };
  }
}