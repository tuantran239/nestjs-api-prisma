import {
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from 'src/role/role.type';
import { User } from 'src/user/user.entity';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { checkRoleValid } from '../utils/validate';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleCode[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const user = context.switchToHttp().getRequest().user as User;

    return checkRoleValid(requiredRoles, user)
  }
}
