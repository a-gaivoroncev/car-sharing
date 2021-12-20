import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CarService {
    constructor(private readonly db: DatabaseService) {}

    async createNewReport(dateFromString: string, dateToString: string, targetCarId = null) {
        const dateFrom = new Date(dateFromString)
        const dateTo = new Date(dateToString)

        const yearFrom = dateFrom.getFullYear();
        const monthFrom = dateFrom.getMonth() + 1;
        const yearTo = dateTo.getFullYear();
        const monthTo = dateTo.getMonth() + 1;
        
        let dateQuery = `((EXTRACT(YEAR FROM sessions.rent_date_from) = '${yearFrom}') OR (EXTRACT(YEAR FROM sessions.rent_date_to) = '${yearTo}')) AND
        ((EXTRACT(MONTH FROM sessions.rent_date_from) >= '${monthFrom}') OR (EXTRACT(MONTH FROM sessions.rent_date_from) <= '${monthTo}')) OR
        ((EXTRACT(YEAR FROM sessions.rent_date_from) > '${yearFrom}') OR (EXTRACT(YEAR FROM sessions.rent_date_to) < '${yearTo}'))`
        const sessions = await this.db.executeQuery(`
            SELECT json_build_object(
            'car_number', cars.state_number, 'date_from', sessions.rent_date_from, 'date_to', sessions.rent_date_to) as session_data
            FROM rental_sessions sessions LEFT JOIN cars ON cars.vin = sessions.car_id
            WHERE
            ${targetCarId ? `(cars.vin = sessions.car_id) AND (${dateQuery})` : `${dateQuery}`}
        `)
        const numberOfMonths = this.calculateNumberOfMonths(monthFrom, monthTo, yearFrom, yearTo)

        const reportByCar: any = this.calculateReportDate(monthFrom, monthTo, yearFrom, yearTo, sessions)
        
        let averageOfAll = 0

        for (const key in reportByCar) {
            reportByCar[key].numberOfDays = this.calculateAverageDays(reportByCar[key].numberOfDays, numberOfMonths)
            averageOfAll += +reportByCar[key].numberOfDays
        }
        
        reportByCar.averageOfAll = averageOfAll / Object.keys(reportByCar).length
        return reportByCar
    }

    calculateNumberOfMonths(monthFrom: number, monthTo: number, yearFrom: number, yearTo: number) {        
        if (yearFrom === yearTo) {
            return monthTo - monthFrom
        } else {
            return (yearTo - yearFrom - 1) * 12 + (12 - monthFrom + monthTo)
        }
    }

    calculateAverageDays(numberOfDays, numberOfMonths) {
        return (numberOfDays / numberOfMonths).toFixed(2)
    }

    calculateReportDate(monthFrom, monthTo, yearFrom, yearTo, sessions: Array<any>) {
        const result = {}
        const lastDayOfLastMonth = new Date(yearTo, monthTo, 0).getDate()

        for (const session of sessions) {
            
            
            const sessionDateFrom = new Date(session.session_data.date_from)
            const sessionDateTo = new Date(session.session_data.date_to)
            
            const sessionYearFrom = sessionDateFrom.getFullYear()
            const sessionYearTo = sessionDateTo.getFullYear()

            const sessionMonthFrom = sessionDateFrom.getMonth() + 1
            const sessionMonthTo = sessionDateTo.getMonth() + 1

            const sessionDayFrom = sessionDateFrom.getDate()
            const sessionDayTo = sessionDateTo.getDate()
        
            let numberOfDays = 0;

            if (yearFrom === sessionYearFrom || yearTo === sessionYearTo) {
                if (sessionMonthFrom < monthFrom) {
                    numberOfDays = sessionDayTo
                    
                } else if (sessionMonthTo > monthTo) {
                    numberOfDays = lastDayOfLastMonth - sessionDayFrom
                } else {
                    numberOfDays = sessionDayTo - sessionDayFrom
                }
            } else if (sessionMonthFrom === sessionMonthTo) {
                numberOfDays = sessionDayTo - sessionDayFrom
            } else {
                const lastDayOfMonth = new Date(sessionYearFrom, sessionMonthFrom, 0).getDate()
                numberOfDays = sessionDayTo + (lastDayOfMonth - sessionDayFrom)
            }

            if (!result[session.session_data.car_number]) {
                result[session['session_data'].car_number] = {
                    numberOfDays: 0,
                }
            }
            
            result[session.session_data.car_number].numberOfDays += numberOfDays
        }
        return result
    }
}
