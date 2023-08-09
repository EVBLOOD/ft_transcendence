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
import { hostSocket } from 'src/app.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: hostSocket,
    credentials: true,
  },
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
    console.log('message: ', payload);
    try {
      const message = await this.chatService.postToChatroom(payload);
      await this.chatService.incrementUnreadMessageCounter(payload.userName);
      this.server.emit('recMessage', message);
    } catch (err) {
      console.log(err);
    }
  }

  afterInit(server: Server) {
    // console.log('Init: ', server);
  }
  handleConnection(client: Socket) {
    // console.log('Connection: ', client.id);
  }
  handleDisconnect(client: Server) {
    // console.log('Disconnect: ', client);
  }
}
