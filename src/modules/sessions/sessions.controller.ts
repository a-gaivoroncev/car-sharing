import { BadRequestException, Controller, Get, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Post()
  async createSession(
    @Query('carId') carId: string,
    @Query('dateTo') dateTo: string,
    @Query('dateFrom') dateFrom: string,
    @Query('tariffId') tariffId: string, 
    @Query('distance') distance: string
    ) {
    return this.sessionsService.createSession(carId, dateFrom, dateTo, tariffId, +distance)
  }

  @Get('/price')
  async calculatePrice(@Query('fromDate') fromDate: string, @Query('toDate') toDate: string, @Query('tariffName') tariffName: string) {
    try {
      return this.sessionsService.calculatePrice(fromDate, toDate, tariffName)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }


}
