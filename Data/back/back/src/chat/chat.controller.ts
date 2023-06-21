import {
  Controller,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { createMemberDTO } from './dto/createMember.dto';
import { createAdminDTO } from './dto/createAdmin.dto';
import { SwapOwnerDTO } from './dto/SwapOwner.dto';

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

  @Get('user/:userName')
  async getChatRoomsOfUser(
    @Param('userName') userName: string,
  ): Promise<Chat[]> {
    return this.chatRoomSevice.getChatRoomOfUsers(userName); // can return empty array !!
  }

  @Get('DM/:firstUser/:secondUser')
  async findDMChatroom(
    @Param('firstUser') user1: string,
    @Param('secondUser') user2: string,
  ): Promise<Chat | null> {
    return this.chatRoomSevice.findDMChatroom(user1, user2);
  }

  @Get(':chatID/isAdmin/:userName')
  async checkForAdminRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return this.chatRoomSevice.checkForAdminRoll(chatID, userName);
  }

  @Get(':chatID/isMember/:userName')
  async checkForMemberRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return this.chatRoomSevice.checkForMemberRoll(chatID, userName);
  }

  @Get(':chatID/isOwner/:userName')
  async checkForOwnerRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return this.chatRoomSevice.checkForOwnerRoll(chatID, userName);
  }

  @Post('create')
  async createChatRoom(
    @Body() chatroom: createChatroomDTO,
  ): Promise<Chat> {
    // try {
      return this.chatRoomSevice.createChatroom(chatroom);
    // } catch (err) {
    //   console.log(err);
    // }
    // return null;
  }

  @Put(':chatID/add/member')
  async addMemberToChatRoom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Body() memberDTO: createMemberDTO,
  ): Promise<Chat | null> {
    try {
      // TODO [importent]: check if user in not banned first
      return this.chatRoomSevice.addMemberToChatroom(chatID, memberDTO);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Put(':chatID/add/admin')
  async addAdminToChatRoom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Body() adminDTO: createAdminDTO,
  ): Promise<Chat | null> {
    try {
      return this.chatRoomSevice.addAdminToChatroom(chatID, adminDTO);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Put(':/chatID/changeOwner')
  async changeOwnerOfChatroom(
    @Param('chatID') chatID: number,
    @Body() swapOwnerDto: SwapOwnerDTO,
  ): Promise<Chat | undefined> {
    try {
      return this.chatRoomSevice.changeOwnerOfChatroom(chatID, swapOwnerDto);
    } catch (err) {
      console.log(err);
    }
  }

  @Delete('delete/:chatroomID/admin/:adminUserName/user/:userToKick')
  async kickUserFromChatroom(
    @Param('chatroomID') chatroomID: number,
    @Param('adminUserName') adminUserName: string,
    @Param('userToKick') userToKick: string,
  ) {
    try {
      return this.chatRoomSevice.kickUserFromChatroom(
        chatroomID,
        adminUserName,
        userToKick,
      );
    } catch (err) {
      console.log(err);
    }
  }

  @Delete('delete/:chatroomID/admin/:adminUserName/admin/:userToKick')
  async removeAdminFromChatroom(
    @Param('chatroomID') chatroomID: number,
    @Param('adminUserName') adminUserName: string,
    @Param('userToKick') userToKick: string,
  ) {
    try {
      return this.chatRoomSevice.removeAdminFromChatroom(
        chatroomID,
        adminUserName,
        userToKick,
      );
    } catch (err) {
      console.log(err);
    }
  }

  @Delete('leave/:chatroomID/user/:userName')
  async leaveChat(
    @Param('chatroomID') chatroomID: number,
    @Param('userName') userName: string,
  ): Promise<Chat | undefined | string> {
    try {
      return this.chatRoomSevice.leaveChat(chatroomID, userName);
    } catch (err) {
      console.log(err);
    }
  }
} // end of ChatController class
