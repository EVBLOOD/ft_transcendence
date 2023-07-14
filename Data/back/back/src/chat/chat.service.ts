import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UsingJoinColumnOnlyOnOneSideAllowedError } from 'typeorm';
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
import { SwapOwnerDTO } from './dto/SwapOwner.dto';
import { UpdateChatroomDTO } from './dto/updateChatroom.dto';
import { PunishmentService } from './punishment/punishment.service';
import { Punishment } from './punishment/punishment.entity';
import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRoomRepo: Repository<Chat>,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateaway: ChatGateway,
    private readonly chatPunishment: PunishmentService,
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
        admin: true,
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
      if (chatroomDTO.otherUser !== "" ) {
        console.log(
          "here", chatroomDTO.otherUser
        )
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
    if (
      (await this.chatHelpers.checkForMemberRoll(
        messageDTO.charRoomId,
        messageDTO.userName,
      )) == true &&
      (await this.chatPunishment.isMutedInChatroom(
        messageDTO.charRoomId,
        messageDTO.userName,
      )) == false
    ) {
      const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
      const user = await this.chatHelpers.getUser(messageDTO.userName);
      return await this.messageService.create(messageDTO, chatRoom, user);
    }
    throw new HttpException("Can't send messages here", HttpStatus.FORBIDDEN);
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
    if (
      (await this.chatPunishment.isBannedInChatroom(
        chatID,
        memberDTO.member,
      )) == false
    ) {
      chatroom.member.push(user);
      return this.chatRoomRepo.save(chatroom);
    }
    throw new HttpException(
      'You are banned from joining this chatroom',
      HttpStatus.FORBIDDEN,
    );
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
      if (
        (await this.chatPunishment.isBannedInChatroom(
          chatID,
          adminDTO.roleReceiver,
        )) == false
      ) {
        const admin = await this.chatHelpers.getUser(adminDTO.roleReceiver);
        chatroom.admin.push(admin);
        return await this.chatRoomRepo.save(chatroom);
      }
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
        true &&
      (await this.chatPunishment.isBannedInChatroom(
        chatID,
        swapDTO.roleReciver,
      )) == false
    ) {
      const newOwner = await this.chatHelpers.getUser(swapDTO.roleReciver);
      chatroom.owner = newOwner;
      const newChat = chatroom;
      this.chatRoomRepo.save(newChat);
      return newChat;
    }
    throw new HttpException(
      "Can't change channel ownership",
      HttpStatus.BAD_REQUEST,
    );
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
  async updateChatroom(
    chatID: number,
    adminName: string,
    updateDTO: UpdateChatroomDTO,
  ): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if (chatroom.type === 'DM') {
      throw new HttpException(
        "Chat room of type DM can't be chnged!",
        HttpStatus.BAD_REQUEST,
      );
    }
    if ((await this.checkForAdminRoll(chatID, adminName)) === true) {
      if (updateDTO.newChatroomName) {
        chatroom.chatRoomName = updateDTO.newChatroomName;
      }
      if (updateDTO.newType) {
        chatroom.type = updateDTO.newType;
        if (updateDTO.newType === 'password') {
          const passwordHash = await bcrypt.hash(updateDTO.newPassword, 10);
          chatroom.password = passwordHash;
        }
        return await this.chatRoomRepo.save(chatroom);
      }
    }
    throw new HttpException(
      "You don't have permission to update this chatroom",
      HttpStatus.FORBIDDEN,
    );
  }

  async getChatroomsByType(type: string): Promise<Chat[]> {
    const chatrooms = await this.chatRoomRepo.find({
      where: {
        type: type,
      },
      relations: {
        owner: true,
      },
      select: {
        chatRoomName: true,
        id: true,
        type: true,
        owner: {
          userName: true,
        },
      },
      order: {
        id: 'asc',
      },
      cache: true,
    });
    return chatrooms;
  }
  async getMessagesByChatID(chatID: number): Promise<Message[]> {
    return this.messageService.getMessagesByChatID(chatID);
  }
  async getChatroomPunishments(chatID: number): Promise<Punishment[]> {
    return this.chatPunishment.getChatroomPunishments(chatID);
  }

  async deleteUserFromChatroom(
    chatroomId: number,
    user: string,
  ): Promise<Chat> {
    const chatroom = await this.GetChatRoomByID(chatroomId);
    if (await this.chatHelpers.checkForOwnerRoll(chatroomId, user)) {
      throw new HttpException(
        'Cannot remove owner of chatroom',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedChatroom = deleteUser(chatroom, user);
    return await this.chatRoomRepo.save(updatedChatroom);
  }

  async createPunishment(
    chatID: number,
    userName: string,
    punishmentDTO: createPunishmentDTO,
  ): Promise<Punishment> {
    if (
      (await this.chatHelpers.canBePunished(chatID, userName, punishmentDTO)) ==
      true
    ) {
      if (
        punishmentDTO.type == 'ban' &&
        (await this.chatPunishment.isBannedInChatroom(
          chatID,
          punishmentDTO.user,
        )) == true
      ) {
        throw new HttpException('User already banned', HttpStatus.BAD_REQUEST);
      } else if (
        punishmentDTO.type == 'mute' &&
        (await this.chatPunishment.isMutedInChatroom(
          chatID,
          punishmentDTO.user,
        )) == true
      ) {
        throw new HttpException('User already muted', HttpStatus.BAD_REQUEST);
      }
      if (punishmentDTO.type == 'ban') {
        this.deleteUserFromChatroom(chatID, punishmentDTO.user);
      }
      const chat = await this.GetChatRoomByID(punishmentDTO.chatID);
      const user = await this.chatHelpers.getUser(punishmentDTO.user);
      return await this.chatPunishment.createPunishment(
        chat,
        user,
        punishmentDTO,
      );
    }
    throw new HttpException(
      'Unable to create Punishment',
      HttpStatus.BAD_REQUEST,
    );
  }
} // END OF ChatService class
