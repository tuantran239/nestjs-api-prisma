import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseService } from 'src/common/service/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';

@Injectable()
export class UserService extends BaseService<
  Prisma.UserDelegate<DefaultArgs>,
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  Prisma.UserFindManyArgs,
  Prisma.UserCountArgs,
  Prisma.UserFindUniqueArgs,
  ListUserQueryDto,
  UserRepository
> {
  constructor(
    protected userRepository: UserRepository,
    protected i18n: I18nCustomService,
  ) {
    super(userRepository, i18n);
  }

  listByQuery(q: ListUserQueryDto): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
