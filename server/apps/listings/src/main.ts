/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/listings.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'listings';
  //app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4002;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/listings`
  );
}

bootstrap();
