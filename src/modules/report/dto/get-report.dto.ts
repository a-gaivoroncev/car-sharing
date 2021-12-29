import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';

class ICarReport {
  @ApiProperty()
  numberOfDays: number;
}

class CarReport {
  @ApiProperty()
  carStateNumber: ICarReport
}

export class GetReportDto {
  @ApiProperty()
  @IsNotEmpty()
  dateFrom: string;
  
  @ApiProperty()
  @IsNotEmpty()
  dateTo: string;
}



export class GetReportResponseDto {
  @ApiProperty()
  averageOfAll: number
  
  @ApiProperty({
    isArray: true,
    type: 'array',
  })
  cars: [CarReport]
}