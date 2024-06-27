import { PrismaService } from 'src/prisma/prisma.service';

type FinByOrThrowType = 'id' | 'code' | 'status';

export abstract class BaseRepository<PD, E, C, U, R, LA, CA, RA> {
  constructor(
    protected prismaService: PrismaService,
    private model: string,
    public name: string,
  ) {
    this.model = model;
    this.name = name;
  }

  getDelegate() {
    const delegate = this.prismaService[this.model];

    if (!delegate) {
      throw new Error('Invalid Prisma Delegate');
    }

    return delegate as PD;
  }

  async findByOrThrow<I>(
    by: string,
    type: FinByOrThrowType,
    include?: I,
    message?: string,
  ): Promise<E> {
    const query = {
      id: type === 'id' ? by : undefined,
      code: type === 'code' ? by : undefined,
      status: type === 'status',
    };

    const delegate = this.getDelegate() as any;

    const record = (await delegate.findUniqueOrThrow({
      where: query,
      include,
    })) as E;

    if (!record) {
      throw new Error(message ?? 'Data not found');
    }

    return record;
  }

  abstract create(payload: C): Promise<E>;

  abstract update(id: string, payload: U): Promise<E>;

  abstract remove(id: string): Promise<E>;

  abstract delete(id: string): Promise<E>;

  abstract list(
    args: LA,
    countArgs: CA,
  ): Promise<{ results: E[]; total: number }>;

  abstract retrieve(args: RA): Promise<E>;

  abstract mapToResponse(model: E): R;
}
