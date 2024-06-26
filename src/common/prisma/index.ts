import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();

export enum PrismaDelegate {
  user = 'user',
  role = 'role',
}

export const getPrismaDelegate = (model: string) => {
  switch (model) {
    case PrismaDelegate.user:
      return prismaClient.user;
    case PrismaDelegate.role:
      return prismaClient.role;
    default:
      throw new Error(`Invalid Prisma Delegate`);
  }
};
