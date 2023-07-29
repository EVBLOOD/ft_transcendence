import { forwardRef } from '@nestjs/common';
import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { hostSocket } from 'src/app.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: hostSocket,
    credentials: true,
  },
})
export class ChatGateway {
  whatItcosts: Map<string, number> = new Map<string, number>();
  everything: Map<number, Set<string>> = new Map<number, Set<string>>();

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService, private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService, private readonly User: UserService
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
    let themOut = this.everything.get(xyz.sub);
    if (!themOut)
      themOut = new Set<string>();
    themOut.add(client.id)
    this.everything.set(xyz.sub, themOut);
    client.join(xyz.sub);
    return true;
  }

  @SubscribeMessage('privateMessage')
  async privateMessage(client: Socket, payload: any) {
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
    const message = await this.chatService.postToDM(payload?.message, xyz.sub);
    const sender = await this.User.findOne(xyz.sub);
    this.chatService.SeenForDM(xyz.sub, parseInt(payload?.message?.charRoomId), 1)
    this.chatService.SeenForDM(xyz.sub, parseInt(payload?.message?.charRoomId), 0)
    this.server.in(payload?.message?.charRoomId).emit("privateMessage", { sender: xyz.sub, mgs: message, type: 'direct', profile: sender });
    if (xyz.sub != payload?.message?.charRoomId) {
      this.server.in(xyz.sub).emit("privateMessage", { sender: payload?.message?.charRoomId, mgs: message, type: 'direct', profile: sender });
    }
  }


  @SubscribeMessage('ChannelMessages')
  async ChannelMessages(client: Socket, payload: any) {
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
    const isBanned = await this.chatService.isBanned(xyz.sub, parseInt(payload?.message?.charRoomId));
    if (isBanned.length)
      return; // will be removed and added in an other place
    const message: any = await this.chatService.postToChatroom(payload?.message, xyz.sub);
    console.log(message)
    const sender = await this.User.findOne(xyz.sub);
    this.chatService.seenForChannel(xyz.sub, message.chat_id, 1)
    this.chatService.seenForChannel(xyz.sub, message.chat_id, 0)
    if (message)
      this.server.in(message.chat_id.toString()).emit("ChannelMessages", { sender: xyz.sub, mgs: message, type: 'none', profile: sender });
  }

  @SubscribeMessage('join-room')
  async joinRoom(client: Socket, payload: string) {
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
    const isBanned = await this.chatService.isBanned(xyz.sub, parseInt(payload));
    if (!isBanned.length)
      client.join(payload);
    return {}
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(client: Socket, payload: string) {
    client.leave(payload);
    return {}
  }


  // async handleDisconnect(client: Socket) {
  //   const cookie = client.handshake.headers?.cookie
  //     ?.split('; ')
  //     ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
  //     ?.split('=')[1];
  //   const xyz: any = this.serviceJWt.decode(
  //     cookie,
  //   );
  //   if (
  //     !xyz ||
  //     (await this.serviceToken.IsSame(
  //       xyz.sub || '',
  //       cookie,
  //     )) == false
  //   ) {
  //     client.disconnect();
  //     return false;
  //   }
  //   this.everything.delete(xyz.sub);
  // }
}
