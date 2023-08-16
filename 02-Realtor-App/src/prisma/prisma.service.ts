import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Whenever we run our nestjs application we make call to database to connect to the database
  async onModuleInit() {
    await this.$connect;
  }
  // And whenever an termination signal is received we disconnect the databased before killing the application 
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
