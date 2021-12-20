import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Pool } from "pg";
import { databaseProviders } from "./database.providers";
import { DatabaseService } from "./database.service";

@Module({
  providers: [...databaseProviders, DatabaseService, ],
  exports: [DatabaseService],
})

export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}