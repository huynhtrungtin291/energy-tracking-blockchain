import { IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/constants/permissions.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  role: UserRole;

  @IsOptional()
  wallet_address?: string;
}
