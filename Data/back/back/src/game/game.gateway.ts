import { WebSocketGateway, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
    credentials: true,
  }
})
export class GameGateway
  implements OnGatewayDisconnect {

  constructor(private gameService: GameService) { }

  handleDisconnect(socket: any) {
    this.gameService.handleDisconnect(socket);
  }

  @SubscribeMessage('createGame')
  create(socket: Socket, payload: string) {
    this.gameService.createGame(socket, payload);
  }
}


