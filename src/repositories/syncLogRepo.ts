import { PrismaClient, SyncLog, Prisma } from '@prisma/client';

export interface ISyncLogRepo {
  create(entry: Omit<Prisma.SyncLogCreateInput, 'id'>): Promise<SyncLog>;
}

export class PrismaSyncLogRepo implements ISyncLogRepo {
  constructor(private prisma: PrismaClient) {}

  async create(entry: Omit<Prisma.SyncLogCreateInput, 'id'>) {
    return this.prisma.syncLog.create({ data: entry });
  }
}
