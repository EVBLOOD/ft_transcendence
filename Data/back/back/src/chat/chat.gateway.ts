// import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
// import { ChatService } from './chat.service';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';

// @WebSocketGateway()
// export class ChatGateway {
//   constructor(private readonly chatService: ChatService) {}

//   @SubscribeMessage('createChat')
//   create(@MessageBody() createChatDto: CreateChatDto) {
//     return this.chatService.create(createChatDto);
//   }

//   @SubscribeMessage('findAllChat')
//   findAll() {
//     return this.chatService.findAll();
//   }

//   @SubscribeMessage('findOneChat')
//   findOne(@MessageBody() id: number) {
//     return this.chatService.findOne(id);
//   }

//   @SubscribeMessage('updateChat')
//   update(@MessageBody() updateChatDto: UpdateChatDto) {
//     return this.chatService.update(updateChatDto.id, updateChatDto);
//   }

//   @SubscribeMessage('removeChat')
//   remove(@MessageBody() id: number) {
//     return this.chatService.remove(id);
//   }
// }


import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io'
import { UseGuards } from '@nestjs/common';
import { IsauthGuard } from 'src/auth/isauth.guard';
// import { AuthService } from 'src/auth/auth.service';

// cors origins
@WebSocketGateway({namespace: 'chat'})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {} //  to check if a user exist -> yoou will have to enable the second constractor.. parse data and send it to auth to check if the user is logged or valid
  // constructor(private readonly chatService: ChatService, private readonly auth: AuthService) {} // before this I'll have to test Guards

  // @UseGuards(IsauthGuard)
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // this.server.send("hello from the server ;")
    console.log("init Connection");
    return client.id;
  }
  // @UseGuards(IsauthGuard)
  @SubscribeMessage('createChat')
  createChat(@MessageBody() body: string, @ConnectedSocket() client: Socket) : string {
    console.log("createChat : called");
    console.log(body);    // this.server.send("hello from the server ;")
    console.log(client);
    // Server.c
    client.emit('createChat', "emit? was reieved");
    return "body was reieved";
    // await this.server.in(payload.user.socketId).socketsJoin(payload.roomName)
    // return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    // return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    // return this.chatService.findOne(id);
  }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   // return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    // return this.chatService.remove(id);
  }
  // sync handleDisconnect(socket: Socket)
  // handleSetClientDataEvent
}
