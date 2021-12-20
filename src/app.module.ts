import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { CarModule } from './modules/car/car.module';
import { SeedModule } from './modules/seed/seed.module';
import { SessionsModule } from './modules/sessions/sessions.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['env/.env'],
  }),
  CarModule,
  SeedModule,
  SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
