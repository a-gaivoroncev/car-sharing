import { Injectable } from '@nestjs/common';
import { ICarsReport } from 'src/types/report';
import { IGetSessions } from 'src/types/session';
import { SessionRepository } from '../session/repositories/session.repository';

@Injectable()
export class ReportService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createNewReport(getReportDto) {
    const dateFromString = getReportDto.dateFrom;
    const dateToString = getReportDto.dateTo;

    let result = { averageOfAll: 0, cars: {} };
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);

    if (dateFrom > dateTo) {
      throw new Error('Invalid dates');
    }

    const yearFrom = dateFrom.getFullYear();
    const monthFrom = dateFrom.getMonth() + 1;
    const yearTo = dateTo.getFullYear();
    const monthTo = dateTo.getMonth() + 1;

    const sessions: IGetSessions[] =
      await this.sessionRepository.getSessionsSliceByTimePeroiod(
        yearFrom,
        monthFrom,
        yearTo,
        monthTo,
      );

    if (!sessions.length) {
      return {
        hasError: false,
        message: 'Sessions not found',
      };
    }

    const numberOfMonths: number = this.calculateNumberOfMonths(
      monthFrom,
      monthTo,
      yearFrom,
      yearTo,
    );

    const reportByCar: ICarsReport = this.calculateReportDate(
      monthFrom,
      monthTo,
      yearFrom,
      yearTo,
      sessions,
    );

    let averageOfAll = 0;

    for (const key in reportByCar) {
      reportByCar[key].numberOfDays = this.calculateAverageDays(
        reportByCar[key].numberOfDays,
        numberOfMonths,
      );
      averageOfAll += +reportByCar[key].numberOfDays;
    }

    result.averageOfAll = averageOfAll / Object.keys(reportByCar).length;
    result.cars = reportByCar;

    return result;
  }

  private calculateNumberOfMonths(
    monthFrom: number,
    monthTo: number,
    yearFrom: number,
    yearTo: number,
  ) {
    if (yearFrom === yearTo) {
      return monthTo - monthFrom;
    }
    return (yearTo - yearFrom - 1) * 12 + (12 - monthFrom + monthTo);
  }

  private calculateReportDate(
    monthFrom,
    monthTo,
    yearFrom,
    yearTo,
    sessions: IGetSessions[],
  ) {
    const result = {};
    const lastDayOfLastMonth = new Date(yearTo, monthTo, 0).getDate();

    for (const session of sessions) {
      const sessionDateFrom = new Date(session.session_data.date_from);
      const sessionDateTo = new Date(session.session_data.date_to);

      const sessionYearFrom = sessionDateFrom.getFullYear();
      const sessionYearTo = sessionDateTo.getFullYear();

      const sessionMonthFrom = sessionDateFrom.getMonth() + 1;
      const sessionMonthTo = sessionDateTo.getMonth() + 1;

      const sessionDayFrom = sessionDateFrom.getDate();
      const sessionDayTo = sessionDateTo.getDate();

      let numberOfDays = 0;

      if (yearFrom === sessionYearFrom || yearTo === sessionYearTo) {
        if (sessionMonthFrom < monthFrom) {
          numberOfDays = sessionDayTo;
        } else if (sessionMonthTo > monthTo) {
          numberOfDays = lastDayOfLastMonth - sessionDayFrom;
        } else {
          numberOfDays = sessionDayTo - sessionDayFrom;
        }
      } else if (sessionMonthFrom === sessionMonthTo) {
        numberOfDays = sessionDayTo - sessionDayFrom;
      } else {
        const lastDayOfMonth = new Date(
          sessionYearFrom,
          sessionMonthFrom,
          0,
        ).getDate();
        numberOfDays = sessionDayTo + (lastDayOfMonth - sessionDayFrom);
      }

      if (!result[session.session_data.car_number]) {
        result[session['session_data'].car_number] = {
          numberOfDays: 0,
        };
      }

      result[session.session_data.car_number].numberOfDays += numberOfDays;
    }
    return result;
  }

  private calculateAverageDays(numberOfDays, numberOfMonths) {
    if (numberOfMonths === 0) {
      throw new Error('Division by zero error');
    }
    return numberOfMonths ? +(numberOfDays / numberOfMonths).toFixed(2) : 0;
  }
}
