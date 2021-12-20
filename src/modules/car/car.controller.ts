import { Controller, Get, Param, Query } from '@nestjs/common';
import { SessionsService } from '../sessions/sessions.service';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService, private readonly sessionService: SessionsService) { }
    @Get('/report-by-period')
    async getDaysReportByPeriod(@Query('fromDate') dateFrom: string, @Query('toDate') dateTo: string) {
        return this.carService.createNewReport(dateFrom, dateTo)
    }
}
