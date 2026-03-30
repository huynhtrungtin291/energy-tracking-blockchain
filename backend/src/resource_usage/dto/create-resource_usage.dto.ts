import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceUsageDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  electric: string;

  @IsString()
  water: string;

  @IsNotEmpty()
  date: Date;
}
