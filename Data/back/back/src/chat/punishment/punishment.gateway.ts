import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PunishmentService } from './punishment.service';
import { createPunishmentDTO } from './dto/createPunishment.dto';
import { KickUserDto } from './dto/kickUser.dto';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: ['http://localhost:4200', 'http://localhost:3000'],
  },
  namespace: 'punishment',
})
export class PunishmentGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly PunishmentService: PunishmentService) {}

  @SubscribeMessage('userState')
  async joinChat(client: Socket, chatID: number) {
    this.server.emit('userUpdate', chatID);
  }

  @SubscribeMessage('chatBan')
  async checkBan(client: Socket, dto: createPunishmentDTO) {
    try {
      console.log(dto);
      this.server.emit('gotBanned', dto);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('kickUser')
  async handleKick(client: Socket, dto: KickUserDto) {
    this.server.emit('kickUser', dto);
  }
}
