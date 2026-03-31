export interface ResponseResourceUsageDto {
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
  date: string | Date;
}

export interface MonthYearRangeQueryDto {
  to?: Date;
  from?: Date;
}

export interface CreateResourceUsageDto {
  electric: string;
  water: string;
  date: string;
}
