import { User } from '@prisma/client';
import { SoftDeletableEntity } from 'src/common/entity/solf-deletetable.entity';

export class Role extends SoftDeletableEntity {
    name: string;
    code: string;
    users: User[]
}
