import { Module } from '@nestjs/common';

import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaClient, Listing as PrismaListing } from '../../node_modules/.prisma/client';

@Module({
  imports: [HttpModule],
  controllers: [ListingsController],
  providers: [ListingsService, PrismaClient],
})
export class AppModule { }
