import { Inject } from "@nestjs/common";
import { Pool } from "pg";
import { DATABASE_POOL } from "src/constants";

export class TariffRepository {
  constructor(@Inject(DATABASE_POOL) private readonly connection: Pool) {}

  async getTariffById(tariffName: string) {
    const tariff = ( await this.connection.query(`SELECT (price, payed_for_units_amount) FROM tariffs WHERE name = '${tariffName}'`)).rows
    const [price, payedUnitAmount] = tariff[0].row.slice(1, -1).split(',')
    return { price, payedUnitAmount }
  }

}