import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { abortOnError: false });
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      exposedHeaders: 'Content-Range, X-Content-Range',
      credentials: true,
      maxAge: 3600,
    },
  });

  // const config = new DocumentBuilder()
  // .setTitle('transcendence')
  // .setDescription('transcendence APIs description')
  // .setVersion('0.1')
  // .addTag('transcendence')
  // .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  // app.use(passper)
  // app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
