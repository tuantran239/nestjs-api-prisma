import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { BaseRepository } from '../repository/base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService<
  PD,
  E,
  C,
  U,
  R,
  LA,
  CA,
  RA,
  Q,
  CR extends BaseRepository<PD, E, C, U, R, LA, CA, RA>,
> {
  constructor(
    protected repository: CR,
    protected i18n: I18nCustomService,
    private isDeleteRecord = false,
  ) {
    this.isDeleteRecord = isDeleteRecord;
  }

  async create(payload: C): Promise<E> {
    return this.repository.create(payload);
  }

  async update(id: string, payload: U): Promise<E> {
    return await this.repository.update(id, payload);
  }

  async list(args: LA, countArgs: CA) {
    return await this.repository.list(args, countArgs)
  }

  async retrieve(args: RA) {
    return this.repository.retrieve(args)
  }

  async remove(id: string) {
    return await this.repository.remove(id)
  }

  async delete(id: string) {

    if(!this.isDeleteRecord) {
      throw new Error(this.i18n.getMessage('errors.common.method_not_allow'))
    }

    return await this.repository.delete(id)
  }

  abstract listByQuery(q: Q): Promise<E>;
}
