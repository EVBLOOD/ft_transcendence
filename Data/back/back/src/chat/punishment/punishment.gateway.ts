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

  constructor(private readonly PunishmentService: PunishmentService,
    @Inject(forwardRef(() => ChatService)) private readonly chatService: ChatService) {}

  @SubscribeMessage('userState')
  async joinChat(client: Socket, chatID: number) {
    this.server.emit('userUpdate', chatID);
  }

  @SubscribeMessage('chatBan')
  async checkBan(client: Socket, dto: createPunishmentDTO) {
    try {
      console.log("called!!")
      console.log("dto: ", dto[0]);
      console.log("admin: ",dto[1]);
      const punishment = await this.chatService.createPunishment(dto.chatID, dto[1], dto[0]);
      this.server.emit('gotBanned', `Banned user ${dto[0].user}`, punishment);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('kickUser')
  async handleKick(client: Socket, dto: KickUserDto) {
    this.server.emit('kickUser', dto);
  }
}
