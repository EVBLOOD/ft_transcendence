import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Messages } from './entities/Messages.entity';
import { Members } from './entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Messages, Members])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
