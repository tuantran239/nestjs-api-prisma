import { PrismaService } from 'src/prisma/prisma.service';
export abstract class BaseRepository<PD, E, C, U, R> {
  constructor(
    protected prismaService: PrismaService,
    private model: string,
  ) {
    this.model = model;
  }

  getDelegate() {
    const delegate = this.prismaService[this.model];

    if (!delegate) {
      throw new Error('Invalid Prisma Delegate');
    }

    return delegate as PD;
  }

  abstract create(payload: C): Promise<E>;

  abstract update(id: string, payload: U): Promise<E>;

  abstract remove(id: string): Promise<E>;

  abstract mapToResponse(model: E): R;
}
