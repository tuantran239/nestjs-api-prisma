import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDelegate } from 'src/common/prisma';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository<Prisma.UserDeleteArgs, > {
  constructor(private prismaService: PrismaService) {
    super(prismaService, PrismaDelegate.user);
  }

  async create() {
    
  }
}
