import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { abortOnError: false });
  const app = await NestFactory.create(AppModule);

  // const config = new DocumentBuilder()
  // .setTitle('transcendence')
  // .setDescription('transcendence APIs description')
  // .setVersion('0.1')
  // .addTag('transcendence')
  // .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  // app.use(passper)
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
