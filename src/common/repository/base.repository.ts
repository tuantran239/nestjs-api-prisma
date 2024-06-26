import { PrismaService } from 'src/prisma/prisma.service';

export abstract class BaseRepository<PD, RA, E, C, U, Q, R> {
  constructor(
    private prismaService: PrismaService,
    private model: string,
  ) {}

  getDelegate() {
    const delegate = this.prismaService[this.model];

    if (!delegate) {
      throw new Error('Invalid Prisma Delegate');
    }

    return delegate as PD;
  }

  abstract create(payload: C): Promise<E>;

  abstract list(payload: Q): Promise<R[]>;

  abstract update(payload: U): Promise<E>;

  abstract retrieve(args: RA): Promise<R>;

  abstract remove(id: string): Promise<E>;

  abstract delete(id: string): Promise<E>;

  abstract mapToResponse(model: E): R;
}
