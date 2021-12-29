import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { databaseProviders } from '../database/database.providers';
import { SessionRepository } from '../session/repositories/session.repository';
import { SessionsModule } from '../session/session.module';
import { CarController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [DatabaseModule, SessionsModule],
  controllers: [CarController],
  providers: [ReportService, SessionRepository, ...databaseProviders],
  exports: [ReportService],
})
export class ReportModule {}
