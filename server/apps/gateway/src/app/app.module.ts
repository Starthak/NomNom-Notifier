import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: 'http://localhost:4001/graphql',
            },
            {
              name: 'listings',
              url: 'http://localhost:4002/listings',
            },
            {
              name: 'seller',
              url: 'http://localhost:4003/graphql',
            },
          ],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
