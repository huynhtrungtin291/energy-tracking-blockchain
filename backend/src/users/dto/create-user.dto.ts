import { IsOptional } from 'class-validator';
import { UserRole } from 'src/constants/permissions.enum';

export class CreateUserDto {
  username: string;
  name: string;
  password: string;
  role: UserRole;

  @IsOptional()
  wallet_address?: string;
}
