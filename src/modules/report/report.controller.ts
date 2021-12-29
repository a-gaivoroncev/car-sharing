import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetReportResponseDto } from './dto/get-report.dto';
import { GetReportDto } from './dto/get-report.dto';
import { ReportService } from './report.service';

@Controller('car')
export class CarController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({
    summary: 'Get report by time period',
    description: 'Get average values of all, by even car',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetReportResponseDto,
  })
  @Get('/report-by-period')
  async getDaysReportByPeriod(@Query() getReportDto: GetReportDto) {
    return this.reportService.createNewReport(getReportDto);
  }
}
