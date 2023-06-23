import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGateway } from './chat.gateway';
import { Chat } from './chat.entity';
import { CreateMessage } from 'src/message/dto/message.dto';
import { Message } from 'src/message/message.entity';
import { ChatUtils } from './chat.utils';
import { MessageService } from 'src/message/message.service';
import { createChatroomDTO } from './dto/createChatroom.dto';
import {
  validateChatDTO,
  createChatroomEntity,
  deleteUser,
  removeAdminStatus,
} from './chat.validators';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { createMemberDTO } from './dto/createMember.dto';
import { createAdminDTO } from './dto/createAdmin.dto';
import { promises } from 'dns';
import { SwapOwnerDTO } from './dto/SwapOwner.dto';
import { LargeNumberLike } from 'crypto';
import { constrainedMemory } from 'process';
import { UpdateChatroomDTO } from './dto/updateChatroom.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRoomRepo: Repository<Chat>,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
    private readonly chatHelpers: ChatUtils,
    private readonly messageService: MessageService,
  ) {}

  async getChatRoomOfUsers(userName: string): Promise<Chat[]> {
    const chatroom = await this.chatRoomRepo.find({
      order: {
        id: 'desc',
      },
      relations: {
        owner: true,
        member: true,
      },
      where: {
        member: {
          userName: userName,
        },
      },
      select: {
        id: true,
        chatRoomName: true,
        type: true,
        owner: {
          // userName: true,
          userName: true,
        },
      },
      cache: true,
    });
    return chatroom;
  }

  async GetChatRoomByID(id: number): Promise<Chat> {
    const chatRoom = await this.chatRoomRepo.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        chatRoomName: true,
        type: true,
        owner: {
          // id: true,
          userName: true,
        },
        member: {
          // id: true,
          userName: true,
        },
        admin: {
          // id: true,
          userName: true,
        },
      },
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
      },
      cache: true,
    });
    if (chatRoom) return chatRoom;
    throw new HttpException('ChatRoom Not Found', HttpStatus.NOT_FOUND);
  }

  async createChatroom(chatroomDTO: createChatroomDTO): Promise<Chat> {
    if (validateChatDTO(chatroomDTO) === true) {
      const user = await this.chatHelpers.getUser(chatroomDTO.user);
      let secondUser: User | undefined = undefined;
      if (chatroomDTO.otherUser !== undefined) {
        secondUser = await this.chatHelpers.getUser(chatroomDTO.otherUser);
      }
      if (chatroomDTO.type === 'password') {
        const passwordHash = await bcrypt.hash(chatroomDTO.password, 10);
        chatroomDTO.password = passwordHash;
      }
      const chatroom = createChatroomEntity(chatroomDTO, user, secondUser);
      const newChatroom = this.chatRoomRepo.create(chatroom);
      return await this.chatRoomRepo.save(newChatroom);
    }
    throw new HttpException("Can't create Chatroom!", HttpStatus.BAD_REQUEST);
  }

  async postToChatroom(messageDTO: CreateMessage): Promise<Message> {
    // TODO [importent]: check if the user is a memeber of the channel && if he's not muted
    const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
    const user = await this.chatHelpers.getUser(messageDTO.userName);
    return await this.messageService.create(messageDTO, chatRoom, user);
    // if not throw !
  }

  async findDMChatroom(user1: string, user2: string): Promise<Chat | null> {
    const user1ListOfChatrooms = await this.chatRoomRepo.find({
      relations: {
        member: true,
      },
      where: {
        type: 'DM',
        member: {
          userName: user1,
        },
      },
      select: {
        member: {
          userName: true,
        },
      },
    });
    const user2ListOfChatrooms = await this.chatRoomRepo.find({
      relations: {
        member: true,
      },
      where: {
        type: 'DM',
        member: {
          userName: user2,
        },
      },
      select: {
        member: {
          userName: true,
        },
      },
    });
    if (user1ListOfChatrooms && user2ListOfChatrooms) {
      for (const user1_Iterator of user1ListOfChatrooms) {
        for (const user2_Iterator of user2ListOfChatrooms) {
          if (user1_Iterator.id == user2_Iterator.id) {
            return user1_Iterator;
          }
        }
      }
    }
    // return null;
    throw new HttpException("Can't find DM", HttpStatus.NOT_FOUND);
  }

  async checkForAdminRoll(chatID: number, userName: string): Promise<boolean> {
    return this.chatHelpers.checkForAdminRoll(chatID, userName);
  }

  async checkForOwnerRoll(chatID: number, userName: string): Promise<boolean> {
    return this.chatHelpers.checkForOwnerRoll(chatID, userName);
  }

  async checkForMemberRoll(chatID: number, userName: string): Promise<boolean> {
    return this.chatHelpers.checkForMemberRoll(chatID, userName);
  }

  async getChatroomPassword(id: number): Promise<string> {
    const chatRoom = await this.chatRoomRepo.findOne({
      where: {
        id: id,
      },
      select: {
        password: true,
      },
    });
    if (chatRoom === null) {
      throw new HttpException(
        `Chatroom with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return chatRoom.password;
  }

  async addMemberToChatroom(
    chatID: number,
    memberDTO: createMemberDTO,
  ): Promise<Chat> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (chatroom.type === 'password') {
      const password = await this.getChatroomPassword(chatID);
      if (
        (memberDTO.password != undefined &&
          (await bcrypt.compare(memberDTO.password, password)) == false) ||
        memberDTO.password == undefined ||
        !(memberDTO.password && memberDTO.password.trim())
      ) {
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }
    }
    if (
      (await this.chatHelpers.checkForMemberRoll(chatID, memberDTO.member)) ==
      true
    ) {
      return await this.GetChatRoomByID(chatID);
    }
    const user = await this.chatHelpers.getUser(memberDTO.member);
    // TODO[importent]: check if the user is not banned from the chatroom
    // if (banned == true ) {
    //    throw new HttpException('Can't add currently banned user', HttpStatus.FORBIDDEN);
    // }
    // else
    // if ()
    chatroom.member.push(user);
    return chatroom;
  }

  async addAdminToChatroom(
    chatID: number,
    adminDTO: createAdminDTO,
  ): Promise<Chat> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (
      (await this.chatHelpers.checkForAdminRoll(chatID, adminDTO.roleGiver)) ==
      true
    ) {
      if (
        (await this.chatHelpers.checkForAdminRoll(
          chatID,
          adminDTO.roleReceiver,
        )) == true
      ) {
        return await this.GetChatRoomByID(chatID);
      }
      // TODO [importent] : check if the user is not banned b4 getting admin status
      // if (banned == true ) {
      //    throw new HttpException('You are banned', HttpStatus.FORBIDDEN);
      // }
      // else
      const admin = await this.chatHelpers.getUser(adminDTO.roleReceiver);
      chatroom.admin.push(admin);
      return await this.chatRoomRepo.save(chatroom);
    }
    throw new HttpException(
      "You can't assign a new admin",
      HttpStatus.FORBIDDEN,
    );
  }
  async changeOwnerOfChatroom(
    chatID: number,
    swapDTO: SwapOwnerDTO,
  ): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (
      (await this.chatHelpers.checkForAdminRoll(chatID, swapDTO.roleReciver)) ==
        true &&
      (await this.chatHelpers.checkForOwnerRoll(chatID, swapDTO.roleReciver)) ==
        true
    ) {
      // TODO [importent]: check if the user is not banned in the chatroom
      const newOwner = await this.chatHelpers.getUser(swapDTO.roleReciver);
      chatroom.owner = newOwner;
      const newChat = chatroom;
      this.chatRoomRepo.save(newChat);
      return newChat;
    } else {
      throw new HttpException(
        "Can't change channel ownership",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async kickUserFromChatroom(
    chatID: number,
    adminUserName: string,
    userUserName: string,
  ): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if ((await this.checkForAdminRoll(chatID, adminUserName)) == true) {
      const newChat = deleteUser(chatroom, userUserName);
      return await this.chatRoomRepo.save(newChat);
    }
    throw new HttpException(
      'you need administrator permission to kick users',
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteChat(chatID: number): Promise<void> {
    await this.chatRoomRepo
      .createQueryBuilder('chatroom')
      .delete()
      .from(Chat)
      .where('id = :id', { id: chatID })
      .execute();
  }

  async removeAdminFromChatroom(
    chatID: number,
    adminUserName: string,
    userUserName: string,
  ): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (
      (await this.chatHelpers.checkForAdminRoll(chatID, adminUserName)) &&
      (await this.chatHelpers.isMoreThenOneAdminInChatroom(chatID)) &&
      (await this.chatHelpers.checkForOwnerRoll(chatID, userUserName)) == false
    ) {
      const newChatroom = removeAdminStatus(chatroom, userUserName);
      return this.chatRoomRepo.save(newChatroom);
    } else {
      throw new HttpException(
        'you need administrator permission to remove admins',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async leaveChat(chatID: number, user: string): Promise<Chat | string> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if ((await this.chatHelpers.onlyOneUserInChatroom(chatID)) == true) {
      this.deleteChat(chatID);
      console.log(
        `Deleted chatroom with ID: ${chatroom.id}, Title: ${chatroom.chatRoomName}`,
      );
      return 'Chatroom has been deleted';
    }
    if ((await this.chatHelpers.checkForOwnerRoll(chatID, user)) == true) {
      if (
        (await this.chatHelpers.isMoreThenOneAdminInChatroom(chatID)) == true
      ) {
        chatroom.owner = chatroom.admin[1];
      } else if (
        (await this.chatHelpers.isMoreThenOneMemberInChatroom(chatID)) == true
      ) {
        for (const member of chatroom.member) {
          if (member.userName != chatroom.owner.userName) {
            chatroom.owner = member;
            chatroom.admin.push(member);
            break;
          }
        }
      } else {
        this.deleteChat(chatID);
      }
    }
    const newChat = deleteUser(chatroom, user);
    return await this.chatRoomRepo.save(newChat);
  }
  async updateChatroom(chatID: number, adminName: string, updateDTO: UpdateChatroomDTO): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (chatroom.type === "DM") {
      throw new HttpException("Chat room of type DM can't be chnged!", HttpStatus.BAD_REQUEST);
    }
    if (await this.checkForAdminRoll(chatID, adminName) === true) {
      if (updateDTO.newChatroomName) {
        chatroom.chatRoomName = updateDTO.newChatroomName;
      }
      if (updateDTO.newType) {
        chatroom.type = updateDTO.newType;
        if (updateDTO.newType === "password") {
          const passwordHash = await bcrypt.hash(updateDTO.newPassword, 10);
          chatroom.password = passwordHash;
        }
        return await this.chatRoomRepo.save(chatroom);
      }
    }
    throw new HttpException("You don't have permission to update this chatroom", HttpStatus.FORBIDDEN);
  }

} // END OF ChatService class
