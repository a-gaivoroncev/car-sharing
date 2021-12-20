import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule {}
