import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from '../database/database.providers';
import { DatabaseService } from '../database/database.service';
import { SessionsModule } from '../sessions/sessions.module';
import { SessionsService } from '../sessions/sessions.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  imports: [DatabaseService, ConfigModule, SessionsModule],
  controllers: [CarController],
  providers: [CarService, DatabaseService, SessionsService, ...databaseProviders],
  exports: [CarService]
})
export class CarModule {}
