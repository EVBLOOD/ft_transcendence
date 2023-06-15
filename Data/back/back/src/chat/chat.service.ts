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
import { validateChatDTO, createChatroomEntity } from './chat.validators';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { createMemberDTO } from './dto/createMember.dto';

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

  async getChatRoomOfUsers(userId: number): Promise<Chat[]> {
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
          id: userId,
        },
      },
      select: {
        id: true,
        chatRoomName: true,
        type: true,
        owner: {
          id: true,
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
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
      },
      select: {
        id: true,
        chatRoomName: true,
        type: true,
        owner: {
          id: true,
          userName: true,
        },
        member: {
          id: true,
          userName: true,
        },
        admin: {
          id: true,
          userName: true,
        },
      },
      cache: true,
    });
    if (chatRoom) return chatRoom;
    throw new HttpException('ChatRoom Not Found', HttpStatus.NOT_FOUND);
  }

  async createChatroom(chatroomDTO: createChatroomDTO): Promise<Chat> {
    if (validateChatDTO(chatroomDTO) === true) {
      const user = await this.chatHelpers.getUser(chatroomDTO.otherUser);
      let secondUser: User | undefined = undefined;
      if (chatroomDTO.otherUser != undefined) {
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
    const user = await this.chatHelpers.getUser(messageDTO.userId);
    return await this.messageService.create(messageDTO, chatRoom, user);
    // if not throw !
  }

  async findDMChatroom(user1: number, user2: number): Promise<Chat | null> {
    const user1ListOfChatrooms = await this.chatRoomRepo.find({
      relations: {
        member: true,
      },
      where: {
        type: 'DM',
        member: {
          id: user1,
        },
      },
      select: {
        member: {
          id: true,
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
          id: user2,
        },
      },
      select: {
        member: {
          id: true,
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
    return null;
  }

  async checkForAdminRoll(chatID: number, ID: number): Promise<boolean> {
    return this.chatHelpers.checkForAdminRoll(chatID, ID);
  }

  async checkForOwnerRoll(chatID: number, ID: number): Promise<boolean> {
    return this.chatHelpers.checkForOwnerRoll(chatID, ID);
  }

  async checkForMemberRoll(chatID: number, ID: number): Promise<boolean> {
    return this.chatHelpers.checkForMemberRoll(chatID, ID);
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
      return chatroom;
    }
    const user = await this.chatHelpers.getUser(memberDTO.member);
    // TODO[importent]: check if the user is not banned from the chatroom
    // if (banned == true ) {
    //    throw new HttpException('Can't add currently banned user', HttpStatus.BAD_FORBIDDEN);
    // }
    // else
    chatroom.member.push(user);
    return chatroom;
  }
} // END OF ChatService class
