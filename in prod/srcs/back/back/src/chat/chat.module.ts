import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
import { Messages } from './entities/Messages.entity';
import { Members } from './entities/membership.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { FriendshipService } from 'src/friendship/friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, User, Chat, Members, Friendship]), AuthenticatorModule,],
  providers: [
    ChatService,
    ChatGateway,
    UserService,
    FriendshipService
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule { }
