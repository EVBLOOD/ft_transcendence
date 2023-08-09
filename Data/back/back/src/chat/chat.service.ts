import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
// import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { createMemberDTO } from './dto/createMember.dto';
import { createAdminDTO } from './dto/createAdmin.dto';
import { SwapOwnerDTO } from './dto/SwapOwner.dto';
import { UpdateChatroomDTO } from './dto/updateChatroom.dto';
import { PunishmentService } from './punishment/punishment.service';
import { Punishment } from './punishment/punishment.entity';
import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';
import { User } from 'src/user/entities/user.entity';
import { ReadUserMessages } from './readMessages.entity';

export type UserInfo = {
  role: string;
  userID: number;
  chatID: number;
};

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRoomRepo: Repository<Chat>,
    private readonly chatPunishment: PunishmentService,
    private readonly chatHelpers: ChatUtils,
    private readonly messageService: MessageService,
    @InjectRepository(ReadUserMessages)
    private readonly UnreadMessagePepo: Repository<ReadUserMessages>,
  ) {}

  async incrementUnreadMessageCounter(id: number) {
    await this.UnreadMessagePepo.createQueryBuilder('ReadUserMessages')
      .update()
      .where('user.id != id', { id: id })
      .set({ numberOfUnreadMessages: () => `numberOfUnreadMessages + 1` })
      .execute();
  }

  async getChatRoomOfUsers(id: number): Promise<{
    userInfo: UserInfo[][];
    chatrooms: Chat[];
  }> {
    let chatrooms = await this.chatRoomRepo.find({
      order: {
        id: 'desc',
      },
      relations: {
        owner: true,
        member: true,
        admin: true,
        message: {
          userId: true,
        },
      },
      where: {
        member: {
          id: id,
        },
      },
      select: {
        id: true,
        chatRoomName: true,
        type: true,
        owner: {
          id: true,
          username: true,
          avatar: true,
        },
        member: {
          id: true,
          username: true,
          avatar: true,
        },
        message: {
          value: true,
          id: true,
        },
      },
      cache: true,
    });
    for (const chat of chatrooms) {
      if (!chat.member.some((u) => u.id === id)) {
        chatrooms = chatrooms.filter((ID) => ID.id !== chat.id);
      }
    }
    const userInfo: UserInfo[][] = [];
    for (let i = 0; i < chatrooms.length; i++) {
      const chatroomUsers: UserInfo[] = [];
      for (let j = 0; j < chatrooms[i].member.length; j++) {
        let user = chatrooms[i].member[j].id;
        let role;
        if (user === chatrooms[i].owner.id) {
          role = 'owner';
        } else if (chatrooms[i].admin.findIndex((u) => u.id === user) != -1) {
          role = 'admin';
        } else {
          role = 'member';
        }
        const tmp: UserInfo = {
          chatID: chatrooms[i].id,
          role: role,
          userID: chatrooms[i].member[j].id,
        };
        chatroomUsers.push(tmp);
      }
      userInfo.push(chatroomUsers);
    }
    return { userInfo, chatrooms };
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
          id: true,
          username: true,
          avatar: true,
        },
        member: {
          id: true,
          username: true,
          avatar: true,
        },
        admin: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
      },
    });
    if (chatRoom) return chatRoom;
    throw new HttpException('ChatRoom Not Found', HttpStatus.NOT_FOUND);
  }

  async createChatroom(
    userId: number,
    chatroomDTO: createChatroomDTO,
  ): Promise<Chat> {
    if (validateChatDTO(chatroomDTO) === true) {
      const user = await this.chatHelpers.getUser(userId);
      let secondUser: User | undefined = undefined;
      // if (chatroomDTO.otherUser !== '') {
      //   console.log('here', chatroomDTO.otherUser);
      //   secondUser = await this.chatHelpers.getUser(chatroomDTO.otherUser);
      // }
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
    this.chatPunishment.clearOldPunishments();
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

  async findDMChatrooms(id: number): Promise<Chat[]> {
    // returns all chat dms in the database
    let DMS = await this.chatRoomRepo.find({
      relations: {
        member: true,
        message: true,
      },
      where: {
        type: 'DM',
      },
      select: {
        member: {
          username: true,
          id: true,
          avatar: true,
        },
        message: {
          // get the message and the name and id of the sender
          value: true,
          userId: {
            id: true,
            username: true,
          },
        },
      },
    });
    // filters the array for the wanted dms
    for (const dm of DMS) {
      if (!dm.member.some((u) => u.id === id)) {
        DMS = DMS.filter((ID) => ID.id !== dm.id);
      }
    }
    return DMS;
  }

  async findDMChatroom(user1: number, user2: number): Promise<Chat | null> {
    let user1ListOfChatrooms = await this.chatRoomRepo.find({
      relations: {
        member: true,
      },
      where: {
        type: 'DM',
        // member: {
        //   id: user1,
        // },
      },
      select: {
        member: {
          id: true,
        },
      },
    });
    for (const dm of user1ListOfChatrooms) {
      if (!dm.member.some((u) => u.id === user1)) {
        user1ListOfChatrooms = user1ListOfChatrooms.filter(
          (ID) => ID.id !== dm.id,
        );
      }
    }
    let user2ListOfChatrooms = await this.chatRoomRepo.find({
      relations: {
        member: true,
      },
      where: {
        type: 'DM',
        // member: {
        //   id: user2,
        // },
      },
      select: {
        member: {
          username: true,
        },
      },
    });
    for (const dm of user2ListOfChatrooms) {
      if (!dm.member.some((u) => u.id === user2)) {
        user2ListOfChatrooms = user2ListOfChatrooms.filter(
          (ID) => ID.id !== dm.id,
        );
      }
    }
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

  async checkForAdminRoll(chatID: number, id: number): Promise<boolean> {
    return this.chatHelpers.checkForAdminRoll(chatID, id);
  }

  async checkForOwnerRoll(chatID: number, id: number): Promise<boolean> {
    return this.chatHelpers.checkForOwnerRoll(chatID, id);
  }

  async checkForMemberRoll(chatID: number, id: number): Promise<boolean> {
    return this.chatHelpers.checkForMemberRoll(chatID, id);
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
    adminUserName: number,
    userUserName: number,
  ): Promise<Chat | undefined> {
    const chatroom = await this.GetChatRoomByID(chatID);
    if ((await this.checkForAdminRoll(chatID, adminUserName)) == true) {
      if ((await this.checkForOwnerRoll(chatID, userUserName)) == false) {
        if ((await this.checkForAdminRoll(chatID, userUserName)) == false) {
          const newChat = deleteUser(chatroom, userUserName);
          return await this.chatRoomRepo.save(newChat);
        } else {
          const newChat = removeAdminStatus(chatroom, userUserName);
          return await this.chatRoomRepo.save(newChat);
        }
      } else {
        throw new HttpException(
          "you can't kick chatroom owner",
          HttpStatus.BAD_REQUEST,
        );
      }
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
    adminUserName: number,
    userUserName: number,
  ): Promise<Chat | undefined> {
    console.log('chat id : ', chatID);
    console.log('adminUserName : ', adminUserName);
    console.log('userUserName : ', userUserName);
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

  async leaveChat(chatID: number, user: number): Promise<Chat | string> {
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
          if (member.username != chatroom.owner.username) {
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
    adminName: number,
    updateDTO: UpdateChatroomDTO,
  ): Promise<Chat | undefined> {
    console.log('updatedto: ', updateDTO);
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
      }
      console.log('new chatroom: ', chatroom);
      return await this.chatRoomRepo.save(chatroom);
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
          username: true,
        },
      },
      order: {
        id: 'asc',
      },
      //cache: true,
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
    user: number,
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
    id: number,
    punishmentDTO: createPunishmentDTO,
  ): Promise<Punishment> {
    if (
      (await this.chatHelpers.canBePunished(chatID, id, punishmentDTO)) == true
    ) {
      if (
        punishmentDTO.type == 'ban' &&
        (await this.chatPunishment.isBannedInChatroom(chatID, id)) == true
      ) {
        throw new HttpException('User already banned', HttpStatus.BAD_REQUEST);
      } else if (
        punishmentDTO.type == 'mute' &&
        (await this.chatPunishment.isMutedInChatroom(chatID, id)) == true
      ) {
        throw new HttpException('User already muted', HttpStatus.BAD_REQUEST);
      }
      if (punishmentDTO.type == 'ban') {
        this.deleteUserFromChatroom(chatID, id);
      }
      const chat = await this.GetChatRoomByID(punishmentDTO.chatID);
      const user = await this.chatHelpers.getUser(id);
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
  async getUserMessagesInChatroom(
    id: number,
    idUser: number,
  ): Promise<Message[]> {
    const messages = await this.messageService.getMessagesByChatroomID(id);
    // TODO: get blocked users and filter there messages befor returning
    return messages;
  }

  async clearPunishment(id: number, admin: number, user: number, type: string) {
    if ((await this.checkForAdminRoll(id, admin)) == false) {
      throw new HttpException(
        "You don't have the necessary permissions",
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      type === 'ban' &&
      (await this.chatPunishment.checkIfUserBanned(id, user)) == true
    ) {
      return this.chatPunishment.clearUserPunishment(id, user, type);
    } else if (
      type === 'mute' &&
      (await this.chatPunishment.checkIfUserMuted(id, user)) == true
    ) {
      return this.chatPunishment.clearUserPunishment(id, user, type);
    } else {
      throw new HttpException(
        `User is not ` + type === 'ban' ? 'banned' : 'muted',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} // END OF ChatService class
