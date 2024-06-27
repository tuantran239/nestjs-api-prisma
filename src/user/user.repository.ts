import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaDelegate } from 'src/common/prisma';
import { BaseRepository } from 'src/common/repository/base.repository';
import { generateEntityId } from 'src/common/utils/generate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { hashPassword } from 'src/common/utils/hash';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';

@Injectable()
export class UserRepository extends BaseRepository<
  Prisma.UserDelegate<DefaultArgs>,
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  Prisma.UserFindManyArgs,
  Prisma.UserCountArgs,
  Prisma.UserFindUniqueArgs
> {
  constructor(
    prismaService: PrismaService,
    private i18n: I18nCustomService,
  ) {
    super(prismaService, PrismaDelegate.user, 'User');
  }

  async create(payload: CreateUserDto): Promise<User> {
    payload.password = await hashPassword(payload.password);

    return await this.getDelegate().create({
      data: {
        ...payload,
        id: generateEntityId('user'),
      },
    });
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const userDelegate = this.getDelegate();

    await this.findByOrThrow<Prisma.UserInclude>(
      id,
      'id',
      null,
      this.i18n.getMessage('errors.user.not_found'),
    );

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    await userDelegate.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });

    return (await userDelegate.findUnique({
      where: { id },
      include: { role: true },
    })) as User;
  }

  async remove(id: string): Promise<User> {
    const userDelegate = this.getDelegate();

    await this.findByOrThrow<Prisma.UserInclude>(
      id,
      'id',
      null,
      this.i18n.getMessage('errors.user.not_found'),
    );

    await userDelegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return (await userDelegate.findUnique({
      where: { id },
      include: { role: true },
    })) as User;
  }

  async delete(id: string): Promise<User> {
    const userDelegate = this.getDelegate();

    const user = await this.findByOrThrow<Prisma.UserInclude>(
      id,
      'id',
      null,
      this.i18n.getMessage('errors.user.not_found'),
    );

    await userDelegate.delete({ where: { id } });

    return user;
  }

  async list(
    args: Prisma.UserFindManyArgs<DefaultArgs>,
    countArgs: Prisma.UserCountArgs
  ): Promise<{ results: User[]; total: number }> {
    const userDelegate = this.getDelegate();

    const users = await userDelegate.findMany(args);
    const total = await userDelegate.count(countArgs);

    const results = users.map((user) => this.mapToResponse(user));

    return { results, total }
  }

  async retrieve(args: Prisma.UserFindUniqueArgs<DefaultArgs>): Promise<User> {
    const userDelegate = this.getDelegate()

    const result = await userDelegate.findUnique(args)

    return this.mapToResponse(result)
  }

  mapToResponse(model: User): UserResponseDto {
    return model;
  }
}
