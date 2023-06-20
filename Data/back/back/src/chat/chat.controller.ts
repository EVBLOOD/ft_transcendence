import {
  Controller,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { createMemberDTO } from './dto/createMember.dto';
import { createAdminDTO } from './dto/createAdmin.dto';

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

  @Get('/user/:userName')
  async getChatRoomsOfUser(
    @Param('userName') userName: string,
  ): Promise<Chat[]> {
    return await this.chatRoomSevice.getChatRoomOfUsers(userName); // can return empty array !!
  }

  @Get('DM/:firstUser/:secondUser')
  async findDMChatroom(
    @Param('firstUser') user1: string,
    @Param('secondUser') user2: string,
  ): Promise<Chat | null> {
    return await this.chatRoomSevice.findDMChatroom(user1, user2);
  }

  @Get(':chatID/isAdmin/:userName')
  async checkForAdminRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForAdminRoll(chatID, userName);
  }

  @Get(':chatID/isMember/:userName')
  async checkForMemberRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForMemberRoll(chatID, userName);
  }

  @Get(':chatID/isOwner/:userName')
  async checkForOwnerRoll(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return await this.chatRoomSevice.checkForOwnerRoll(chatID, userName);
  }

  @Post('create')
  async createChatRoom(
    @Body() chatroom: createChatroomDTO,
  ): Promise<Chat | null> {
    try {
      return this.chatRoomSevice.createChatroom(chatroom);
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

  @Put(':chatID/add/admin')
  async addAdminToChatRoom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Body() adminDTO: createAdminDTO,
  ): Promise<Chat | null> {
    try {
      return await this.chatRoomSevice.addAdminToChatroom(chatID, adminDTO);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // @Put(':/chatID/changeOwner')
  // async changeOwnerOfChatroom(
  //   @Param('chatID') chatID: number,
  //   @Body() swapOwnerDto: SwapOwnerDTO,
  //   @GetUser() user: User
  // ): Promise<Chat | undefined> {
  //   try {
  //     if (user.userName !== swapOwnerDto.roleGiver){
  //       throw new HttpException("Sent User ID is not the current user", HttpStatus.BAD_REQUEST);
  //     }
  //     // return this.chatRoomSevice.changeOwnerOfChatroom(chatID, swapOwnerDto);
  //   }
  // }
} // end of ChatController class
