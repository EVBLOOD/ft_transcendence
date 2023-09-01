import { WebSocketGateway, SubscribeMessage, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import hostSocket from 'src/envirenment';

@WebSocketGateway({
  namespace: "game",
  cors: {
    credentials: true,
    origin: hostSocket,
  },
})
export class GameGateway
  implements OnGatewayDisconnect {

  constructor(private gameService: GameService, private readonly serviceJWt: JwtService, private readonly serviceToken: AuthenticatorService,) { }

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
    let userSockets = this.gameService.onlineUsers.get(xyz.sub);
    if (!userSockets)
      userSockets = new Set<Socket>();
    userSockets.add(client);
    this.gameService.onlineUsers.set(xyz.sub, userSockets)
    return true;
  }
  @SubscribeMessage('createGame')
  async create(client: Socket, payload?: number) {
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
      cookie
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
    if (!payload)
      this.gameService.createGame(client, { id1: xyz.sub });
    else
      this.gameService.createGame(client, { id1: xyz.sub, id2: payload })
  }

  async handleDisconnect(client: any) {
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
    let userSockets = this.gameService.onlineUsers.get(xyz.sub);
    if (!userSockets)
      return;
    if (userSockets)
      userSockets.delete(client);
    if (userSockets?.size)
      this.gameService.onlineUsers.set(xyz.sub, userSockets)
    else
      this.gameService.onlineUsers.delete(xyz.sub)

  }
}


