import { BaseEntity } from './base.entity';

export abstract class SoftDeletableEntity extends BaseEntity {
  deletedAt: Date | null;
}
