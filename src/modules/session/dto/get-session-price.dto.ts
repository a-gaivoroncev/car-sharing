import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';


export class GetSessionPriceRequestDto {
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

export class GetSessionPriceResponseDto {
  @ApiProperty()
  carRentPrice: number
}