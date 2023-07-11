import { forwardRef } from '@nestjs/common';
import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { CreateMessage } from 'src/message/dto/message.dto';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ["http://localhost:4200", "http://localhost:3000"],
    credentials: true,
  }

})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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

  afterInit(server: Server) {
    console.log('Init: ', server);
  }
  handleConnection(client: Socket) {
    console.log('Connection: ', client);
  }
  handleDisconnect(client: Server) {
    console.log('Disconnect: ', client);
  }
}
