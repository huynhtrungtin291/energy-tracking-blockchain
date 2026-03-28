import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/constants/permissions.enum';

export const ROLES_KEY = 'CHỉ có admin mới có quyển tạo tài khoản';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
