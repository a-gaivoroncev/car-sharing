import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { DATABASE_POOL } from "src/constants";

export const databasePoolFactory = async (configService: ConfigService) => {
    return new Pool({
      user: configService.get('POSTGRES_USER'),
      host: configService.get('POSTGRES_HOST'),
      database: configService.get('POSTGRES_DB'),
      password: configService.get('POSTGRES_PASSWORD'),
      port: configService.get('POSTGRES_PORT'),
    });
};

export const databaseProviders = [{
    provide: DATABASE_POOL,
    inject: [ConfigService],
    useFactory: databasePoolFactory,
  }]