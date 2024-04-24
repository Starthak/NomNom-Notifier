import { OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '../node_modules/.prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export class PrismaService extends PrismaClient implements OnModuleInit {

  private static instance: PrismaService

  constructor(){
    super(
      {
        log: ['query']
      }
    )
    if (!PrismaService.instance) {
      PrismaService.instance = this;
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.$connect
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }
}