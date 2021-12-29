import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './modules/report/report.module';
import { SeedModule } from './modules/seed/seed.module';
import { SessionsModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['env/.env'],
    }),
    ReportModule,
    SeedModule,
    SessionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
