import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { GetUser } from './../message/message.controller';
import { User } from 'src/user/user.entity';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { createMemberDTO } from './dto/createMember.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatRoomSevice: ChatService) {}

  @Get(':id')
  async getChatRoomByID(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Chat | undefined> {
    try {
      return await this.chatRoomSevice.GetChatRoomByID(id);
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
      throw new HttpException(
        'sent user id dosent match current userID',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatRoomSevice.getChatRoomOfUsers(userID); // can return empty array !!
  }

  // @Get('type/:type')
  // async getChatroomType(@Param('type') type: string) : Promise<ChatRoom>
  @Get('DM/:firstUser/:secondUser')
  async findDMChatroom(
    @Param('firstUser', ParseIntPipe) user1: number,
    @Param('secondUser', ParseIntPipe) user2: number,
  ): Promise<Chat | null> {
    return await this.chatRoomSevice.findDMChatroom(user1, user2);
  }

  @Get(':chatID/is_admin/:id')
  async checkForAdminRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('id', ParseIntPipe) ID: number,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForAdminRoll(chatID, ID);
  }

  @Get(':chatID/is_member/:id')
  async checkForMemberRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('id', ParseIntPipe) ID: number,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForMemberRoll(chatID, ID);
  }

  @Get(':chatID/is_owner/:id')
  async checkForOwnerRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('id', ParseIntPipe) ID: number,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForOwnerRoll(chatID, ID);
  }

  @Post('create')
  async createChatRoom(
    @Body() chatroom: createChatroomDTO,
    @GetUser() user: User,
  ): Promise<Chat | null> {
    try {
      if (user.id !== chatroom.user) {
        throw new HttpException(
          'user ID dose not match current user ID',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.chatRoomSevice.createChatroom(chatroom);
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  @Put(':chatID/add/member')
  async addMemberToChatRoom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Body() memberDTO: createMemberDTO,
  ): Promise<Chat | null> {
    try {
      // TODO [importent]: check if user in not banned first
      return await this.chatRoomSevice.addMemberToChatroom(chatID, memberDTO);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
} // end of ChatController class
