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
import { MessageService } from 'src/message/message.service';


@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {

  constructor(private readonly chatRoomSevice: ChatService, private readonly messageService: MessageService,) { }


  @Get('find/:id')
  async getChatRoomByID(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomSevice.GetChatRoomByID(id);
  }
  @Get('user')
  async getChatRoomsOfUser(@Req() req) {
    return this.chatRoomSevice.getChatRoomOfUsers(req.new_user.sub); // can return empty array !!
  }


  @Get('DM')
  async findDMChatrooms(
    @Req() req,
  ) {
    return this.chatRoomSevice.findDMChatrooms(req.new_user.sub);
  }

  @Get('DM/:secondUser')
  async findDMChatroom(
    @Req() req: any,
    @Param('secondUser', ParseIntPipe) user2: number,
  ) {
    return this.chatRoomSevice.findDMChatroom(req.new_user.sub, user2);
  }

  @Get('membersFor/:id')
  getMembers(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.chatRoomSevice.getChatRoomMembers(req.new_user.sub, id);
  }

  @Get(':chatID/isAdmin/')
  async checkForAdminRoll(
    @Req() req: any,
    @Param('chatID', ParseIntPipe) chatID: number,
  ) {
    return this.chatRoomSevice.checkForAdminRoll(chatID, req.new_user.sub);
  }

  @Get(':chatID/isMember')
  async checkForMemberRoll(
    @Req() req: any,
    @Param('chatID', ParseIntPipe) chatID: number
  ) {
    return this.chatRoomSevice.checkForMemberRoll(chatID, req.new_user.sub);
  }

  @Get(':chatID/isOwner')
  async checkForOwnerRoll(
    @Req() req: any,
    @Param('chatID', ParseIntPipe) chatID: number,
  ) {
    return this.chatRoomSevice.checkForOwnerRoll(chatID, req.new_user.sub);
  }

  @Get('type/:type')
  async getChatroomsByType(@Param('type') type: string) {
    return this.chatRoomSevice.getChatroomsByType(type);
  }
  @Get(':chatID/messages')
  async getMessagesByChatID(
    @Param('chatID', ParseIntPipe) chatID: number,
  ) {
    return this.chatRoomSevice.getMessagesByChatID(chatID);
  }
  @Get(':chatID/Dms')
  async getDmsMessagesByUserID(@Req() req: any,
    @Param('chatID', ParseIntPipe) chatID: number,
  ) {
    return this.chatRoomSevice.betweenDM(chatID, req.new_user.sub)
  }

  @Get(':chatID/user/:userName/messages')
  async getUserMessagesInChatroom(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName', ParseIntPipe) userName: number,
  ) {
    return this.chatRoomSevice.getUserMessagesInChatroom(chatID, userName);
  }
  @Get(':chatID/punishments')
  async getChatroomPunishments(
    @Param('chatID', ParseIntPipe) chatID: number,
  ) {
    return this.chatRoomSevice.getChatroomPunishments(chatID);
  }



  @Post('create')
  async createChatRoom(@Req() req, @Body() chatroom: createChatroomDTO) {
    return this.chatRoomSevice.createChatroom(req.new_user.sub, chatroom);
  }

  @Post(':chatID/admin/:adminName/punishment')
  async createPunishment(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('adminName', ParseIntPipe) userName: number,
    @Body() punishmentsDTO: createPunishmentDTO,
  ) {
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
    @Param('adminName', ParseIntPipe) admin: number,
    @Param('userName', ParseIntPipe) user: number,
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
  ) {
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
  ) {
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
  ) {
    try {
      return this.chatRoomSevice.changeOwnerOfChatroom(chatID, swapOwnerDto);
    } catch (err) {
      console.log(err);
    }
  }

  @Put('update/:chatID/admin/:adminUserName')
  async updateChatroom(
    @Param('chatID') chatID: number,
    @Param('adminUserName') adminName: number,
    @Body() updateChatDTO: UpdateChatroomDTO,
  ) {
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
  ) {
    try {
      ValidateUpdateDTO(updateChatDTO);
      return this.chatRoomSevice.updateChatroom(
        chatID,
        req.new_user.sub,
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
    @Param('adminUserName') adminUserName: number,
    @Param('userToKick') userToKick: number,
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

  @Delete('leave/:chatroomID/user/:userName')
  async leaveChat(
    @Param('chatroomID') chatroomID: number,
    @Param('userName') userName: number,
  ) {
    try {
      return this.chatRoomSevice.leaveChat(chatroomID, userName);
    } catch (err) {
      console.log(err);
    }
  }
} // end of ChatController class
