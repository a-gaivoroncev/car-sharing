import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SeedService {
  constructor(private readonly db: DatabaseService) {}

  async seed() {
    await this.createTables();
    await this.seedCars();
    await this.seedTariffs();
  }

  async createTables() {
    await this.db.executeQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await this.db.executeQuery(`CREATE TABLE IF NOT EXISTS cars 
            (vin VARCHAR(255) NOT NULL PRIMARY KEY, 
            model VARCHAR(255), brand VARCHAR(255),
            state_number VARCHAR(10));`);

    await this.db.executeQuery(`CREATE TABLE IF NOT EXISTS tariffs
            (name VARCHAR(255) NOT NULL PRIMARY KEY,
            price NUMERIC, 
            payed_for_units_amount NUMERIC)`);

    await this.db.executeQuery(`CREATE TABLE IF NOT EXISTS rental_sessions 
            (id UUID NOT NULL DEFAULT uuid_generate_v1() NOT NULL PRIMARY KEY, 
            rent_price numeric DEFAULT 1000, 
            rent_date_from DATE NOT NULL,
            rent_date_to DATE NOT NULL, 
            car_id VARCHAR(255) NOT NULL REFERENCES cars(vin),
            tariff_name VARCHAR(255) NOT NULL REFERENCES tariffs(name));`);
  }

  async seedCars() {
    this.db.executeQuery(
      `INSERT INTO cars (vin, model, brand, state_number) VALUES ('4Y1SL65848Z411431', 'model s', 'LADA', 'a001aa') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO cars (vin, model, brand, state_number) VALUES ('4Y1SL65848Z411432', 'model m', 'LADA', 'a002ab') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO cars (vin, model, brand, state_number) VALUES ('4Y1SL65848Z411433', 'model s', 'LADA', 'a003ac') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO cars (vin, model, brand, state_number) VALUES ('4Y1SL65848Z411434', 'model j', 'LADA', 'a004ad') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO cars (vin, model, brand, state_number) VALUES ('4Y1SL65848Z411435', 'model j', 'LADA', 'a005ae') ON CONFLICT DO NOTHING`,
    );
  }

  async seedTariffs() {
    this.db.executeQuery(
      `INSERT INTO tariffs (price, payed_for_units_amount, name) VALUES (270, 200, 'Первый тариф') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO tariffs (price, payed_for_units_amount, name) VALUES (330, 350, 'Второй тариф') ON CONFLICT DO NOTHING`,
    );
    this.db.executeQuery(
      `INSERT INTO tariffs (price, payed_for_units_amount, name) VALUES (390, 500, 'Третий тариф') ON CONFLICT DO NOTHING`,
    );
  }
}
