import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rent_price: string;

  @ApiProperty()
  rent_date_from: Date

  @ApiProperty()
  rent_date_to: Date

  @ApiProperty()
  car_id: string;

  @ApiProperty()
  tariff_name: string;
}
