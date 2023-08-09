import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';
// import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatUtils } from './chat.utils';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { PunishmentService } from './punishment/punishment.service';
import { Punishment } from './punishment/punishment.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
import { ReadUserMessages } from './readMessages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      User,
      Chat,
      Punishment,
      ReadUserMessages,
    ]),
    AuthenticatorModule,
  ],
  providers: [
    ChatService,
    ChatUtils,
    ChatGateway,
    MessageService,
    UserService,
    PunishmentService,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
