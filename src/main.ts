import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SeedService } from './modules/seed/seed.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Carsharing API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const seedService = app.get(SeedService);

  await seedService.seed();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
