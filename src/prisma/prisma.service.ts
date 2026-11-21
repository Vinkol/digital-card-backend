import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db';
import { seedDatabase } from './seed';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly orm = db.orm;

  async onModuleInit(): Promise<void> {
    await seedDatabase();
  }

  async onModuleDestroy(): Promise<void> {
    await db.close();
  }
}
