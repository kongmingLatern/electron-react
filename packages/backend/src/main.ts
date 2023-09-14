import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3600,
  });
  app.use(
    session({
      secret: 'syj',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 100000,
      },
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
