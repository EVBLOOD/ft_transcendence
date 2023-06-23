import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from 'src/authenticator/socket.guard';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';

@WebSocketGateway({
  namespace: 'current_status',
  cors: {
    credentials: true,
    origin: 'http://localhost:4200',
  },
})
export class CurrentStatusGateway {
  constructor(
    private readonly SaveStatus: UserService,
    private readonly serviceJWt: JwtService,
    private readonly serviceToken: AuthenticatorService,
  ) {}

  @WebSocketServer()
  myserver: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(
      client.handshake.headers?.cookie
        ?.split('; ')
        ?.find((row) => row.startsWith('access_token='))
        ?.split('=')[1],
    );
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
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'He is Online';
  }

  @SubscribeMessage('Online')
  async handleOnline(client: any, payload: any) {
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
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'He is Online';
  }

  @SubscribeMessage('Offline')
  async handleOffline(client: any, payload: any) {
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
    client.disconnect();
    return 'Tab Disconnect';
  }

  @SubscribeMessage('InGame')
  async handleInGame(client: any, payload: any) {
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
    this.SaveStatus.AddState(xyz.sub, client, 'InGame');
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'He is InGame';
  }

  @SubscribeMessage('Disconnect')
  async handleTyping(client: any, payload: any) {
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
    this.SaveStatus.PruneUserState(xyz.sub);
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'GoodBay world!';
  }

  @SubscribeMessage('Call')
  async handleCall(client: Socket) {
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
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'Hello world!';
  }

  async handleDisconnect(client: Socket) {
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
    this.SaveStatus.RemoveState(client, xyz.sub);
    this.myserver.emit(
      'status',
      xyz.sub +
        ' : ' +
        JSON.stringify(this.SaveStatus.GetCurrentState(xyz.sub)),
    );
    return 'Tab Disconnect';
  }
}
