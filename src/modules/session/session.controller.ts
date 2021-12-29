import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSessionResponseDto } from './dto/create-session-response.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  GetSessionPriceRequestDto,
  GetSessionPriceResponseDto,
} from './dto/get-session-price.dto';
import { SessionsService } from './session.service';

@Controller('session')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiOperation({
    summary: 'Create a car rental session',
    description: 'Create new session. Can validate dates and other sessions',
  })
  @ApiResponse({ status: 201, type: CreateSessionResponseDto })
  @Post()
  async createSession(@Query() createSessionDto: CreateSessionDto) {
    return this.sessionsService.createSession(createSessionDto);
  }

  @ApiOperation({
    summary: 'Calculate price by time period and tariff',
    description: 'preliminary calculation of the cost of renting a car',
  })
  @ApiResponse({ status: 201, type: GetSessionPriceResponseDto })
  @Get('/price')
  async calculatePrice(
    @Query() getSessionPriceDto: GetSessionPriceRequestDto,
  ): Promise<GetSessionPriceResponseDto> {
    try {
      return this.sessionsService.calculatePrice(getSessionPriceDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
