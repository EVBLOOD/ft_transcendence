import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import DataConf from 'database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataConf),
    MessageModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
