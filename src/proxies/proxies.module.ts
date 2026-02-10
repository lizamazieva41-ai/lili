import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxiesController } from './proxies.controller';
import { ProxiesService } from './proxies.service';
import { DatabaseModule } from '../config/database.module';
import { CommonModule } from '../common/services/logger.module';
import { AuthModule } from '../auth/auth.module';
import { TdlibModule } from '../tdlib/tdlib.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CommonModule,
    AuthModule,
    forwardRef(() => TdlibModule),
  ],
  controllers: [ProxiesController],
  providers: [ProxiesService],
  exports: [ProxiesService],
})
export class ProxiesModule {}
