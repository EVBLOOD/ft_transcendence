import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/avatar', express.static(join(__dirname, '../../upload/avatars')));
  app.enableCors({
    credentials: true,
    origin: process.env.HOST + ':4200',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
