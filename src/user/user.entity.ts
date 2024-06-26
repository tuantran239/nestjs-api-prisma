import { Role } from '@prisma/client';
import { SoftDeletableEntity } from '../common/entity/solf-deletetable.entity';

export class  User extends SoftDeletableEntity {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  roleId: string;
  role?: Role;
}
