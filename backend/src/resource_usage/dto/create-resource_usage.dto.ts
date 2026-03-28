import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class ElectricDto {
  @IsNumber()
  amount_electric: number;

  @IsString()
  invoice_electric: string;
}

class WaterDto {
  @IsNumber()
  amount_water: number;

  @IsString()
  invoice_water: string;
}

export class CreateResourceUsageDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ElectricDto)
  electric: ElectricDto;

  @ValidateNested()
  @Type(() => WaterDto)
  water: WaterDto;

  @IsNotEmpty()
  date: Date;
}
