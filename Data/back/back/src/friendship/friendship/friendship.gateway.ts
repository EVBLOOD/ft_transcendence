import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { FriendshipService } from '../friendship.service';

@WebSocketGateway({
  namespace: 'friendshipSock',
  cors: {
    credentials: true,
    origin: 'http://localhost:4200',
  },
})
export class FriendshipGateway {

  private connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();

  constructor(private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,
     private readonly friendshipService: FriendshipService) {}
  @WebSocketServer()
  myserver: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
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

  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay : any;
    try {
      console.log(": PAYLOAD :")
      console.log(payload);
          replay = await this.friendshipService.create(
            xyz.sub,
            payload,
          );
          // if (replay) return replay;
        } catch (err) {
          return 'UserNotFound';
        }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestReceived', { senderId: xyz.sub });
      });
    }
    // 
    return {sender: replay.sender, receiver: replay.receiver}
  }
  @SubscribeMessage('acceptFriendRequest')
  async handleAcceptFriendRequest(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay : any;
    try {
      replay = await this.friendshipService.accepting(
        xyz.sub,
        payload,
      );
      // if (replay) return replay;
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestAccepted', { senderId: xyz.sub });
      });
    }
    return {sender: replay.sender, receiver: replay.receiver}
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay : any;
    try {
      replay = await this.friendshipService.blocking(
        xyz.sub,
        payload,
      );
      // if (replay) return replay;
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('UserBlockedby', { senderId: xyz.sub });
      });
    }
    return {sender: replay.sender, receiver: replay.receiver}
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay : any;
    try {
      replay = await this.friendshipService.unblock(
        xyz.sub,
        payload,
      );
      // if (replay) return replay;
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('youWereUnblocked', { senderId: xyz.sub });
      });
    }
    return {sender: replay.sender, receiver: replay.receiver}
  }

  @SubscribeMessage('deleteFriendship')
  async handleDeleteFriendship(client: any, payload: number) {
    if (
      !client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1]
    ) {
      client.disconnect();
      return false;
    }
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
    if (
      !xyz ||
      (await this.serviceToken.IsSame(
        xyz.sub || '',
        client.handshake.headers?.cookie
          ?.split('; ')
          ?.find((row) => row.startsWith('access_token='))
          ?.split('=')[1],
      )) == false
    ) {
      client.disconnect();
      return false;
    }
    let replay : any;
    try {
      replay = await this.friendshipService.remove(
        xyz.sub,
        payload,
      );
      // if (replay) return replay;
    } catch (err) {
      return 'UserNotFound';
    }
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('notAnyMore', { senderId: xyz.sub });
      });
    }
    return {sender: replay.sender, receiver: replay.receiver}
  }

  // @SubscribeMessage('statusFriendship')
  // async handleStatusFriendship(client: any, payload: number) {
  //   if (
  //     !client.handshake.headers?.cookie
  //       ?.split('; ')
  //       ?.find((row) => row.startsWith('access_token='))
  //       ?.split('=')[1]
  //   ) {
  //     client.disconnect();
  //     return false;
  //   }
  //   const xyz: any = this.serviceJWt.decode(
  //     client.handshake.headers?.cookie
  //       ?.split('; ')
  //       ?.find((row) => row.startsWith('access_token='))
  //       ?.split('=')[1],
  //   );
  //   if (
  //     !xyz ||
  //     (await this.serviceToken.IsSame(
  //       xyz.sub || '',
  //       client.handshake.headers?.cookie
  //         ?.split('; ')
  //         ?.find((row) => row.startsWith('access_token='))
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
  //   return {sender: replay.sender, receiver: replay.receiver}
  // }
}
