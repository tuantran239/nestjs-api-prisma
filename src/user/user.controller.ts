import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Prisma } from '@prisma/client';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { AuthBaseController } from 'src/common/controller/auth-base.controller';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { RoleCode } from 'src/role/role.type';
import { Controller } from '@nestjs/common';
import { UserRouter } from './user.router';

@Controller(UserRouter.ROOT)
export class UserController extends AuthBaseController<
  Prisma.UserDelegate<DefaultArgs>,
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  Prisma.UserFindManyArgs,
  Prisma.UserCountArgs,
  Prisma.UserFindFirstArgs,
  ListUserQueryDto,
  UserRepository,
  UserService
> {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private i18n: I18nCustomService,
  ) {
    super(
      userService,
      userRepository,
      i18n,
      {
        CreateDto: new CreateUserDto(),
        UpdateDto: new UpdateUserDto(),
        QueryDto: new ListUserQueryDto(),
      },
      {
        create: [RoleCode.SUPER_ADMIN],
        update: [RoleCode.SUPER_ADMIN],
        list: [RoleCode.SUPER_ADMIN],
        retrieve: [RoleCode.SUPER_ADMIN],
        remove: [RoleCode.SUPER_ADMIN],
        delete: [RoleCode.SUPER_ADMIN],
      },
    );
  }
}
