import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataConf from 'database.config';

@Module({
  imports: [TypeOrmModule.forRoot(DataConf)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
