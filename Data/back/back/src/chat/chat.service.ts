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
import * as bcrypt from "bcrypt";

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

  async getChatRoomOfUsers(userId: number) : Promise<Chat[]> {
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
    })
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
        secondUser = await this.chatHelpers.getUser(chatroomDTO.otherUser)
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
}
