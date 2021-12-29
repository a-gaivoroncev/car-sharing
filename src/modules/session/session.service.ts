import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './repositories/session.repository';
import { TariffRepository } from './repositories/tariff.repository';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tariffRepository: TariffRepository,
  ) {}

  async calculatePrice(getSessionPriceDto) {
    const { tariffId } = getSessionPriceDto;
    const dateFromString = getSessionPriceDto.fromDate;
    const dateToString = getSessionPriceDto.toDate;
    const numberOfDays = this.getNumberOfDates(dateFromString, dateToString);

    const tariff = await this.tariffRepository.getTariffById(tariffId);

    if (!tariff?.price) {
      throw new Error('Unknown tariff');
    }

    const carRentPrice = this.caclulateRentPrice(numberOfDays, tariff.price);
    return {
      carRentPrice,
    };
  }

  async createSession(createSessionData: CreateSessionDto) {
    try {
      const { carId, tariffId } = createSessionData;
      const dateFromString = createSessionData.fromDate;
      const dateToString = createSessionData.toDate;

      const fromDate = new Date(dateFromString);
      const toDate = new Date(dateToString);

      await this.checkAvailableStatus(carId, fromDate, toDate);

      const rentPrice = (
        await this.calculatePrice({ fromDate, toDate, tariffId })
      ).carRentPrice;

      return this.sessionRepository.createSession({
        rentPrice,
        dateFromString,
        dateToString,
        carId,
        tariffId,
      });
    } catch (e) {
      return {
        ok: false,
        description: e.message,
      };
    }
  }

  private getNumberOfDates(dateFromString: string, dateToString: string) {
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);
    const numberOfDays = this.calculateDaysRange(dateFrom, dateTo);

    if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
      throw new BadRequestException('Invalid date');
    }
    if (!this.isWorkingDay(dateFrom) || !this.isWorkingDay(dateTo)) {
      throw new BadRequestException('You cant start/end rent at weekends'); // вынести наверх
    }

    if (numberOfDays > 30) {
      throw new BadRequestException('Max rent period error'); // вынести наверх
    }

    return numberOfDays;
  }

  private calculateDaysRange(dateFrom: Date, dateTo: Date) {
    return (dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24);
  }

  private isWorkingDay(date: Date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }

  private caclulateRentPrice(numberOfDays: number, tariffPrice: number) {
    let rate = 1;
    if (numberOfDays <= 5 && numberOfDays >= 3) {
      rate = 0.95;
    } else if (numberOfDays <= 14) {
      rate = 0.9;
    } else if (numberOfDays <= 30) {
      rate = 0.85;
    }
    return numberOfDays * tariffPrice * rate;
  }

  private async checkAvailableStatus(
    carId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const valid = this.areDatesValid(dateFrom, dateTo);
    if (!valid) {
      throw new Error('dates are not valid');
    }

    const isAvailable = await this.hasNotSessions(carId, dateFrom, dateTo);

    if (!isAvailable) {
      throw new Error('car is not available');
    }
  }

  private areDatesValid(dateFrom: Date, dateTo: Date) {
    return dateFrom < dateTo;
  }

  private async hasNotSessions(
    carId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<boolean> {
    const restPeriod = 4;
    dateFrom.setDate(dateFrom.getDate() - restPeriod).toLocaleString();
    dateTo.setDate(dateTo.getDate() + restPeriod).toLocaleString();

    const unAvailableDateFrom = `${dateFrom.getFullYear()}-${
        dateFrom.getMonth() + 1
      }-${dateFrom.getDate()}`;
    const unAvailablDateTo = `${dateTo.getFullYear()}-${
        dateTo.getMonth() + 1
      }-${dateTo.getDate()}`;
    
    const values = await this.sessionRepository.getSessionsByDate(
      carId,
      unAvailableDateFrom,
      unAvailablDateTo,
    );

    if (values.length) {
      return null;
    }

    return !values.length;
  }
}
