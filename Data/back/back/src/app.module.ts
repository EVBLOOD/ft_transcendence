import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import DataConf from 'database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataConf),
    UserModule,
    MessageModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
