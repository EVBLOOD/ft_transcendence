import { JwtService } from '@nestjs/jwt';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { FriendshipService } from '../friendship.service';
import hostSocket from 'src/envirenment';

@WebSocketGateway({
  namespace: 'friendshipSock',
  cors: {
    credentials: true,
    origin: hostSocket,
  },
})
export class FriendshipGateway {


  private connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();

  constructor(private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,
    private readonly friendshipService: FriendshipService) {
  }
  @WebSocketServer()
  myserver: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let userSockets = this.connections.get(xyz.sub);
    if (!userSockets)
      userSockets = new Set<Socket>();
    userSockets.add(client);
    this.connections.set(xyz.sub, userSockets)
  }

  async handleDisconnect(client: Socket) {
    const cookie = client.handshake.headers?.cookie
      ?.split('; ')
      ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
      ?.split('=')[1];
    if (!cookie) {
      return false;
    }
    const xyz: any = this.serviceJWt.decode(cookie);
    if (!xyz)
      return;
    let userSockets = this.connections.get(xyz.sub);
    if (!userSockets)
      return;
    if (userSockets)
      userSockets.delete(client);
    if (!(userSockets?.size))
      this.connections.delete(xyz.sub)
    else
      this.connections.set(xyz.sub, userSockets);
  }

  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay: any;
    try {
      replay = await this.friendshipService.create(
        xyz.sub,
        payload,
      );
      if (!replay) return 'UserNotFound';
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets) {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestReceived', { senderId: xyz.sub });
      });
    }
    // 
    return { sender: xyz.sub, receiver: payload }
  }

  @SubscribeMessage('acceptFriendRequest')
  async handleAcceptFriendRequest(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay: any;
    try {
      replay = await this.friendshipService.accepting(
        xyz.sub,
        payload,
      );
      if (!replay) return 'UserNotFound';
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets) {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestAccepted', { senderId: xyz.sub });
      });
    }
    return { sender: xyz.sub, receiver: payload }
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay: any;
    try {
      replay = await this.friendshipService.blocking(
        xyz.sub,
        payload,
      );
      if (!replay) return 'UserNotFound';
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets) {
      recipientSockets.forEach((socket) => {
        socket.emit('UserBlockedby', { senderId: xyz.sub });
      });
    }
    return { sender: xyz.sub, receiver: payload }
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay: any;
    try {
      replay = await this.friendshipService.unblock(
        xyz.sub,
        payload,
      );
      if (!replay) return 'UserNotFound';
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets) {
      recipientSockets.forEach((socket) => {
        socket.emit('youWereUnblocked', { senderId: xyz.sub });
      });
    }
    return { sender: xyz.sub, receiver: payload }
  }

  @SubscribeMessage('deleteFriendship')
  async handleDeleteFriendship(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay: any;
    try {
      replay = await this.friendshipService.remove(
        xyz.sub,
        payload,
      );
      if (!replay) return 'UserNotFound';
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets) {
      recipientSockets.forEach((socket) => {
        socket.emit('notAnyMore', { senderId: xyz.sub });
      });
    }
    return { sender: xyz.sub, receiver: payload }
  }

  // @SubscribeMessage('statusFriendship')
  // async handleStatusFriendship(client: any, payload: number) {
  //   if (
  //     !client.handshake.headers?.cookie
  //       ?.split('; ')
  //       ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
  //       ?.split('=')[1]
  //   ) {
  //     client.disconnect();
  //     return false;
  //   }
  //   const xyz: any = this.serviceJWt.decode(
  //     client.handshake.headers?.cookie
  //       ?.split('; ')
  //       ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
  //       ?.split('=')[1],
  //   );
  //   if (
  //     !xyz ||
  //     (await this.serviceToken.IsSame(
  //       xyz.sub || '',
  //       client.handshake.headers?.cookie
  //         ?.split('; ')
  //         ?.find((row) => row.startsWith(process.env.TOKEN_NAME + '='))
  //         ?.split('=')[1],
  //     )) == false
  //   ) {
  //     client.disconnect();
  //     return false;
  //   }
  //   const recipientSockets = this.connections.get(payload);
  //   if (recipientSockets)
  //   {
  //     recipientSockets.forEach((socket) => {
  //       socket.emit('notAnyMore', { senderId: xyz.sub });
  //     });
  //   }
  //   return {sender: xyz.sub, receiver: payload}
  // }
}
