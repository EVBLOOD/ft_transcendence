import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PunishmentService } from './punishment.service';
import { createPunishmentDTO } from './dto/createPunishment.dto';
import { KickUserDto } from './dto/kickUser.dto';
import { ChatService } from '../chat.service';
import { Inject, forwardRef } from '@nestjs/common';
import { hostSocket } from 'src/app.service';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: hostSocket,
  },
  namespace: 'punishment',
})
export class PunishmentGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly PunishmentService: PunishmentService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) { }

  @SubscribeMessage('userState')
  async joinChat(client: Socket, chatID: number) {
    this.server.emit('userUpdate', chatID);
  }

  @SubscribeMessage('chatBan')
  async checkBan(client: Socket, dto: createPunishmentDTO) {
    try {
      console.log('called~~');
      console.log(dto[1], '=====', dto[0]);
      const punishment = await this.chatService.createPunishment(
        dto.chatID,
        dto[1],
        dto[0],
      );
      this.server.emit('gotBanned', `Banned user ${dto[0].user}`, punishment);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('chatMute')
  async checkMute(client: Socket, dto: createPunishmentDTO) {
    try {
      const punishment = await this.chatService.createPunishment(
        dto.chatID,
        dto[1],
        dto[0],
      );
      this.server.emit('gotMuted', `Banned user ${dto[0].user}`, punishment);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('kickUser')
  async handleKick(client: Socket, dto: KickUserDto) {
    this.server.emit('kickUser', dto);
  }
}
