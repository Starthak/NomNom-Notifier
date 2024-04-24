import { NestFactory } from '@nestjs/core';
import { UsersModule } from './app/users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'server/email-template'));
  app.setViewEngine('ejs');

  app.enableCors({
    origin: "*"
  });
  const maxHeaderSize = process.env.HTTP_SERVER_MAX_HEADER_SIZE;

  if (maxHeaderSize) {
    app.getHttpServer().maxHeadersCount = parseInt(maxHeaderSize, 10);
  }
  const http2 = require('http2');

  const server = http2.createSecureServer({
    // ... other server options
    settings: {
      // Increase the maximum frame size (recommended value is a multiple of 16384)
      maxFrameSize: 131072 // 128 KB (example)
    }
  });
  const port = process.env.PORT || 4001;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/users`
  );
}
bootstrap();
