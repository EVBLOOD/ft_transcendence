import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import  DataConf  from '../data'
@Module({
  imports: [TypeOrmModule.forRoot(DataConf), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
