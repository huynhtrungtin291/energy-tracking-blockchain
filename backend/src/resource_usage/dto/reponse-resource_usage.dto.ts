import { IsOptional } from 'class-validator';

export class ResponseResourceUsageDto {
  username: string;
  electric: {
    amount_electric: number;
    invoice_electric: string;
  };
  water: {
    amount_water: number;
    invoice_water: string;
  };
  carbon: number;
  dataHash: string;
  address_transaction: string;
  date: Date;
}
export class MonthYearRangeQueryDto {
  @IsOptional()
  to?: Date;

  @IsOptional()
  from?: Date;
}
