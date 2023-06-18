import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
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
  await app.listen(3000);
}
bootstrap();
