import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';

@WebSocketGateway({
  namespace: 'friendshipSock',
  cors: {
    credentials: true,
    origin: 'http://localhost:4200',
  },
})
export class FriendshipGateway {

  private connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();

  constructor(private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,) {}
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
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestReceived', { senderId: xyz.sub });
      });
    }
    client.emit('friendRequestSent');
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
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('friendRequestAccepted', { senderId: xyz.sub });
      });
    }
    client.emit('youveAccepted');
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
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('UserBlockedby', { senderId: xyz.sub });
      });
    }
    client.emit('blockedUser');
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
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('youWereUnblocked', { senderId: xyz.sub });
      });
    }
    client.emit('SuccessUnblock');
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
    const recipientSockets = this.connections.get(payload);
    if (recipientSockets)
    {
      recipientSockets.forEach((socket) => {
        socket.emit('notAnyMore', { senderId: xyz.sub });
      });
    }
    client.emit('Friendshipdeleted');
  }
}
