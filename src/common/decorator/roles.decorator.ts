import { SetMetadata } from '@nestjs/common';
import { RoleCode } from 'src/role/role.type';

export const ROLES_KEY = 'roles';
export const CheckRoles = (...roles: RoleCode[]) =>
  SetMetadata(ROLES_KEY, roles);
