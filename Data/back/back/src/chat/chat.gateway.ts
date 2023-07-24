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
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: hostSocket,
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService, private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,
  ) { }
  async handleConnection(client: Socket, ...args: any[]) {
    const cookie = client.handshake.headers?.cookie
      ?.split('; ')
      ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
      ?.split('=')[1];
    if (
      !cookie
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      cookie,
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        cookie,
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    return true;
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: any) {
    const cookie = client.handshake.headers?.cookie
      ?.split('; ')
      ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
      ?.split('=')[1];
    if (
      !cookie
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      cookie,
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        cookie,
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    try {
      console.log(payload)
      if (payload?.type !== null && payload?.type !== undefined
        && payload?.message !== null && payload?.message !== undefined) {
        let message = {};
        if (payload?.type) {
          console.log("Channel?")
          message = await this.chatService.postToChatroom(payload?.message, xyz.sub);
        }
        else
          message = await this.chatService.postToDM(payload?.message, xyz.sub);
        console.log(message)
        this.server.emit('recMessage', { sender: xyz.sub, mgs: message });
      }
    } catch (err) {
      console.log(err);
    }
  }

  afterInit(server: Server) {
    // console.log('Init: ', server);
  }
  handleDisconnect(client: Server) {
    // console.log('Disconnect: ', client);
  }
}
