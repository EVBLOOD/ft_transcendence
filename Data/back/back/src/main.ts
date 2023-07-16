import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, {
  // cors: {
  //   origin: 'http://localhost:4200',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept',
  //   exposedHeaders: 'Content-Range, X-Content-Range',
  //   credentials: true,
  //   maxAge: 3600,
  // },
  // });
  app.use('/avatar', express.static(join(__dirname, '../../upload/avatars')));
  app.enableCors({
    credentials: true,
    // origin: 'http://0.0.0.0:4200',
    origin: process.env.HOST + ':4200',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
