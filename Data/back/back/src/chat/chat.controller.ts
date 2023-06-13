import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { GetUser } from './../message/message.controller';
import { User } from 'src/user/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatRoomSevice: ChatService) {}

  @Get(':id')
  async getChatRoomByID(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Chat | undefined> {
    try {
      return this.chatRoomSevice.GetChatRoomByID(id);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/user/:userID')
  async getChatRoomsOfUser(
    @Param('userID', ParseIntPipe) userID: number,
    @GetUser() user: User,
  ): Promise<Chat[]> {
    if (user.id != userID) {
      throw new HttpException("sent user id dosent match current userID", HttpStatus.BAD_REQUEST);
    }
    return await this.chatRoomSevice.getChatRoomOfUsers(userID); // can return empty array !!
  }



} // end of ChatController class
