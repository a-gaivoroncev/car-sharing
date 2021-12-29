import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  carId: string;

  @ApiProperty()
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty()
  @IsNotEmpty()
  toDate: string;

  @ApiProperty()
  @IsNotEmpty()
  tariffId: string;
}


export class CreateSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rent_price: string;

  @ApiProperty()
  rent_date_from: Date;

  @ApiProperty()
  rent_date_to: Date;

  @ApiProperty()
  car_id: string;

  @ApiProperty()
  tariff_name: string;
}
