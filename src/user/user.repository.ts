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
  UserResponseDto
> {
  constructor(
    prismaService: PrismaService,
    private i18n: I18nCustomService,
  ) {
    super(prismaService, PrismaDelegate.user);
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

    const user = await userDelegate.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      this.i18n.getMessage('errors.user.not_found');
    }

    await userDelegate.update({ where: { id }, data: { ...payload } });

    return await userDelegate.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  remove(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  mapToResponse(model: User): UserResponseDto {
    throw new Error('Method not implemented.');
  }
}
