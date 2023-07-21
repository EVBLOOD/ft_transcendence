import {
  Controller,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { createMemberDTO } from './dto/createMember.dto';
import { createAdminDTO } from './dto/createAdmin.dto';
import { SwapOwnerDTO } from './dto/SwapOwner.dto';
import { UpdateChatroomDTO } from './dto/updateChatroom.dto';
import { ValidateUpdateDTO } from './chat.validators';
import { Message } from 'src/message/message.entity';
import { Punishment } from './punishment/punishment.entity';
import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';
import { CommandStartedEvent } from 'typeorm';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';
import { UserService } from 'src/user/user.service';


@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatRoomSevice: ChatService, private readonly userService: UserService) { }

  @Get(':id')
  async getChatRoomByID(@Param('id', ParseIntPipe) id: number): Promise<Chat> {
    return this.chatRoomSevice.GetChatRoomByID(id);
  }
  // returns empty array if no chatrooms are found for the given user
  @Get('user')
  async getChatRoomsOfUser(@Req() req): Promise<Chat[]> {
    return this.chatRoomSevice.getChatRoomOfUsers((await this.userService.findOne(req.new_user.sub)).username); // can return empty array !!
  }

  @Get('DM/:secondUser')
  async findDMChatroom(
    @Req() req,
    @Param('secondUser') user2: string,
  ): Promise<Chat> {
    return this.chatRoomSevice.findDMChatroom((await this.userService.findOne(req.new_user.sub)).username, user2);
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

  @Get('type/:type')
  async getChatroomsByType(@Param('type') type: string): Promise<Chat[]> {
    return this.chatRoomSevice.getChatroomsByType(type);
  }
  @Get(':chatID/messages')
  async getMessagesByChatID(
    @Param('chatID', ParseIntPipe) chatID: number,
  ): Promise<Message[]> {
    return this.chatRoomSevice.getMessagesByChatID(chatID);
  }

  @Get(':chatID/user/:userName/messages')
  async getUserMessagesInChatroom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<Message[]> {
    return this.chatRoomSevice.getUserMessagesInChatroom(chatID, userName);
  }

  @Get(':chatID/punishments')
  async getChatroomPunishments(
    @Param('chatID', ParseIntPipe) chatID: number,
  ): Promise<Punishment[]> {
    return this.chatRoomSevice.getChatroomPunishments(chatID);
  }

  @Post('create')
  async createChatRoom(@Req() req, @Body() chatroom: createChatroomDTO): Promise<Chat> {
    // chatroom.user = (await this.userService.findOne(req.new_user.sub)).username;
    // console.log("hi")
    const newone: createChatroomDTO = { ...chatroom, user: (await this.userService.findOne(req.new_user.sub)).username }
    return this.chatRoomSevice.createChatroom(newone);
  }

  @Post(':chatID/admin/:adminName/punishment')
  async createPunishment(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('adminName') userName: string,
    @Body() punishmentsDTO: createPunishmentDTO,
  ): Promise<Punishment> {
    try {
      return await this.chatRoomSevice.createPunishment(
        chatID,
        userName,
        punishmentsDTO,
      );
    } catch (err) {
      console.log(err);
    }
  }

  @Put(':chatID/admin/:adminName/user/:userName/pardon/:type')
  async clearPunishment(
    @Param('chatID') id: number,
    @Param('adminName') admin: string,
    @Param('userName') user: string,
    @Param('type')
    type: string,
  ) {
    try {
      return this.chatRoomSevice.clearPunishment(id, admin, user, type);
    } catch (err) {
      console.log(err);
    }
  }

  @Put(':chatID/add/member')
  async addMemberToChatRoom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Body() memberDTO: createMemberDTO,
  ): Promise<Chat | null> {
    console.log('adding member: ' + memberDTO.member);
    try {
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

  @Put('update/:chatID/admin/:adminUserName')
  async updateChatroom(
    @Param('chatID') chatID: number,
    @Param('adminUserName') adminName: string,
    @Body() updateChatDTO: UpdateChatroomDTO,
  ): Promise<Chat | null> {
    try {
      ValidateUpdateDTO(updateChatDTO);
      return this.chatRoomSevice.updateChatroom(
        chatID,
        adminName,
        updateChatDTO,
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Put('update/:chatID/admin')
  async updateChatroom_(
    @Param('chatID') chatID: number,
    @Req() req: any,
    @Body() updateChatDTO: UpdateChatroomDTO,
  ): Promise<Chat | null> {
    try {
      ValidateUpdateDTO(updateChatDTO);
      return this.chatRoomSevice.updateChatroom(
        chatID,
        (await this.userService.findOne(req.new_user.sub)).username,
        updateChatDTO,
      );
    } catch (err) {
      console.log(err);
      return null;
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

  // @Delete('delete/:chatroomID/admin/:adminUserName/admin/:userToKick')
  // async removeAdminFromChatroom(
  //   @Param('chatroomID') chatroomID: number,
  //   @Param('adminUserName') adminUserName: string,
  //   @Param('userToKick') userToKick: string,
  // ) {
  //   try {
  //     return this.chatRoomSevice.removeAdminFromChatroom(
  //       chatroomID,
  //       adminUserName,
  //       userToKick,
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

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
