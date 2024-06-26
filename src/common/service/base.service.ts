import {
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';

export abstract class BaseService<E, C, U> {
  protected abstract manager: EntityManager;
  constructor() {}

  abstract create(payload: C): Promise<E>;

  abstract update(id: string, payload: U): Promise<E>;

  abstract delete(id: string): Promise<DeleteResult>;

  abstract list(options: FindManyOptions<E>): Promise<E[]>;

  abstract retrieve(options: FindOneOptions<E>): Promise<E>;
}
