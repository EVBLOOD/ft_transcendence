import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chat])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
