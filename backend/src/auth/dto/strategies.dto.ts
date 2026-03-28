import { IsString, IsEmail } from 'class-validator';
import { UserRole } from '../../constants/permissions.enum';

export class StrategiesDto {
  @IsString()
  name: string;

  @IsEmail()
  username: string;

  @IsString()
  role: UserRole;
}
