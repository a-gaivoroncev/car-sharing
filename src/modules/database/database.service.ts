import { Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Pool, QueryResult } from "pg";
import { DATABASE_POOL } from "src/constants";

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly moduleRef: ModuleRef) {}
   

  executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    this.logger.debug(`Executing query: ${queryText} (${values})`);
    
    const pool = this.moduleRef.get(DATABASE_POOL) as Pool;
    return pool.query(queryText, values).then((result: QueryResult) => {
      this.logger.debug(`Executed query, result size ${result.rows.length}`);
      return result.rows;
    });
  }
}