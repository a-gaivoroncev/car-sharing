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
