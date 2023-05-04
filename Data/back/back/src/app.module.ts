import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import  DataConf  from '../data'
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [TypeOrmModule.forRoot(DataConf), UserModule, AuthModule, ConfigModule.forRoot(), PassportModule.register({session: true}), FriendshipModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
