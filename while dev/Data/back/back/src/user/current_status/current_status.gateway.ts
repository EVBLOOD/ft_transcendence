import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import hostSocket from 'src/envirenment';

@WebSocketGateway({
  namespace: 'current_status',
  cors: {
    credentials: true,
    origin: hostSocket,
  },
})
export class CurrentStatusGateway {
  constructor(
    private readonly SaveStatus: UserService,
    private readonly serviceJWt: JwtService,
    private readonly serviceToken: AuthenticatorService,
  ) { }

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
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return this.SaveStatus.GetAllUsersCurrentState();
  }

  @SubscribeMessage('Online')
  async handleOnline(client: any, payload: any) {
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
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return this.SaveStatus.GetAllUsersCurrentState();
  }

  @SubscribeMessage('Offline')
  async handleOffline(client: any, payload: any) {
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
    client.disconnect();
    return 'Tab Disconnect';
  }

  @SubscribeMessage('InGame')
  async handleInGame(client: any, payload: any) {
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
    this.SaveStatus.AddState(xyz.sub, client, 'InGame');
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return 'He is InGame';
  }

  @SubscribeMessage('Disconnect')
  async handleTyping(client: any, payload: any) {
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
    this.SaveStatus.PruneUserState(xyz.sub);
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return 'GoodBay world!';
  }

  @SubscribeMessage('Call')
  async handleCall(client: Socket) {
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
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return 'Hello world!';
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
    this.SaveStatus.RemoveState(client, xyz.sub);
    this.myserver.emit('status', this.SaveStatus.GetAllUsersCurrentState());
    return 'Tab Disconnect';
  }
}
