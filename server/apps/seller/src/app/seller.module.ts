import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SellerService } from './seller.service';
// import { PrismaService } from 'apps/seller/prisma/Prisma.service';
import { SellerResolver } from './seller.resolver';
import { EmailModule } from './email/email.module';
import { PrismaClient, Seller as PrismaListing } from '../../node_modules/.prisma/client';



@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    EmailModule
  ],
  controllers: [],
  providers: [SellerService, ConfigService, JwtService, PrismaClient, SellerResolver],
})
export class sellerModule {}
