import { forwardRef } from '@nestjs/common';
import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { CreateMessage } from 'src/message/dto/message.dto';
@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('sendMessage')
  async sendMessage(clisnt: Socket, payload: CreateMessage): Promise<void> {
    try {
      const message = await this.chatService.postToChatroom(payload);
      this.server.emit('recMessage', message);
    } catch (err) {
      console.log(err);
    }
  }
}
