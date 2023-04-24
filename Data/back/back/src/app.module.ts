import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DataBaseConfig from '../DataBaseConfig'
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forRoot(DataBaseConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
