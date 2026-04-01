export interface ResponseResourceUsageDto {
  username: string;
  name: string;
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
  dataToHash: string;
  address_transaction: string;
  date: string | Date;
}

export interface MonthYearRangeQueryDto {
  from?: Date;
  to?: Date;
  username?: string;
}

export interface CreateResourceUsageDto {
  electric: string;
  water: string;
  date: string;
}
