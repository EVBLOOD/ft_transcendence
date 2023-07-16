import { WebSocketGateway, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';

@WebSocketGateway({
  namespace: "game",
  cors: {
    credentials: true,
    // origin: 'http://0.0.0.0:4200',

    origin: 'http://10.13.3.9:4200',
  },
})
export class GameGateway
  implements OnGatewayDisconnect {

  constructor(private gameService: GameService, private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,) { }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("Hello world");
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
    this.gameService.onlineUsers.push({ id: xyz.sub, socket: client })
    return true;
  }
  @SubscribeMessage('createGame')
  async create(client: Socket, payload?: number) {
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
    if (!payload)
      this.gameService.createGame(client, { id1: xyz.sub });
    else
      this.gameService.createGame(client, { id1: xyz.sub, id2: payload })
  }

  handleDisconnect(socket: any) {
    this.gameService.handleDisconnect(socket);
  }
}


