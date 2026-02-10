import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from '../config/database.module';
import { AuthModule } from '../auth/auth.module';
import { TdlibModule } from '../tdlib/tdlib.module';

@Module({
  imports: [DatabaseModule, AuthModule, TdlibModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}