import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SessionsService {
    constructor(private readonly db: DatabaseService) { }
    
    getNumberOfDates(dateFromString: string, dateToString: string) {
        const dateFrom = new Date(dateFromString);
        const dateTo = new Date(dateToString);
        const numberOfDays = this.calculateDaysRange(dateFrom, dateTo)

        if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
            throw new BadRequestException('Invalid date')
        }
        if (!this.isWorkingDay(dateFrom) || !this.isWorkingDay(dateTo)) {
            throw new BadRequestException('You cant start/end rent at weekends')
        }

        if (numberOfDays > 30) {
            throw new BadRequestException('Max rent period error')
        }
        return numberOfDays
    }

    private calculateDaysRange(dateFrom: Date, dateTo: Date) {
        return ((dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24))
    }

    isWorkingDay(date: Date) {
        const dayOfWeek = date.getDay()
        return (dayOfWeek !== 0 && dayOfWeek !== 6)
    }

    caclulateRentPrice(numberOfDays: number, tariffPrice: number) {
        let rate = 1;
        if (numberOfDays <= 5 && numberOfDays >= 3) {
            rate = 0.95
        } else if (numberOfDays <= 14) {
            rate = 0.9
        } else if (numberOfDays <= 30) {
            rate = 0.85
        }
        return numberOfDays * tariffPrice * rate
    }

    async getTariff(tariffName: string) {
        const tariff = await this.db.executeQuery(`SELECT (price, payed_for_units_amount) FROM tariffs WHERE name = '${tariffName}'`)
        const [price, payedUnitAmount] = tariff[0].row.slice(1, -1).split(',')
        return { price, payedUnitAmount }
    }

    async calculatePrice(dateFromString: string, dateToString: string, tariffName: string) {
        const numberOfDays = this.getNumberOfDates(dateFromString, dateToString)
        
        const tariff = await this.getTariff(tariffName)

        return this.caclulateRentPrice(numberOfDays, tariff.price)
    }

    async createSession(carId: string, dateFromString: string, dateToString: string, tariffName: string, distance: number) {
        try {
            const dateFrom = new Date(dateFromString);
            const dateTo = new Date(dateToString);

            await this.checkAvailableStatus(carId, dateFrom, dateTo)

            const rentPrice = await this.calculatePrice(dateFromString, dateToString, tariffName)

            return this.db.executeQuery(
                `INSERT INTO rental_sessions 
                (rent_price, rent_date_from, rent_date_to, car_id, tariff_name) 
                VALUES ('${rentPrice}', '${dateFromString}', '${dateToString}', '${carId}', '${tariffName}') 
                RETURNING *`
            )
        } catch (e) {
            return {
                ok: false,
                description: e.message
            }
        }

    }

    async checkAvailableStatus(carId: string, dateFrom: Date, dateTo: Date) {
        const valid = this.areDatesValid(dateFrom, dateTo)
        if (!valid) {
            throw new Error('dates are not valid')
        }

        const isAvailable = await this.hasNotSessions(carId, dateFrom, dateTo)

        if (!isAvailable) {
            throw new Error('car is not available')
        }

    }

    private areDatesValid(dateFrom: Date, dateTo: Date) {
        return dateFrom < dateTo
    }

    async hasNotSessions(carId: string, dateFrom: Date, dateTo: Date) {
        dateFrom.setDate(dateFrom.getDate() - 3).toLocaleString()
        dateTo.setDate(dateTo.getDate() + 3).toLocaleString()

        const availableDateFrom = `${dateFrom.getFullYear()}-${dateFrom.getMonth() + 1}-${dateFrom.getDate()}`
        const availableDateTo = `${dateTo.getFullYear()}-${dateTo.getMonth() + 1}-${dateTo.getDate()}`

        const values = await this.db.executeQuery(`
            SELECT * FROM rental_sessions WHERE 
            car_id = '${carId}' 
            AND rent_date_from >= '${availableDateFrom}' 
            AND rent_date_to <= '${availableDateTo}'`)

        if (values.length) {
            return null
        }

        return !values.length
    }
}
