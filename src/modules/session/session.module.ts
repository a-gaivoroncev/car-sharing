import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SessionRepository } from './repositories/session.repository';
import { TariffRepository } from './repositories/tariff.repository';
import { databaseProviders } from '../database/database.providers';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository, TariffRepository, ...databaseProviders],
})
export class SessionsModule {}
