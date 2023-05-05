import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Messages } from './entities/Messages.entity';
import { Members } from './entities/membership.entity';
import { ChatController } from './chat/chat.controller';
import { User } from 'src/user/entities/user.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Friendship } from 'src/friendship/entities/friendship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Messages, Members, User, Friendship])],
  providers: [ChatGateway, ChatService, FriendshipService],
  controllers: [ChatController]
})
export class ChatModule {}
