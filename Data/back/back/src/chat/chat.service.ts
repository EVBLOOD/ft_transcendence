import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepositoryUtils } from 'typeorm';
import { ChatGateway } from './chat.gateway';
import { Chat } from './chat.entity';
import { CreateMessage } from 'src/message/dto/message.dto';
import { Message } from 'src/message/message.entity';
import { ChatUtils } from './chat.utils';
import { MessageService } from 'src/message/message.service';
import { triggerAsyncId } from 'async_hooks';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { validateChatDTO } from './chat.validators';

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
      // stuff
    }
  }

  async createChatroom(chatroomDTO: createChatroomDTO): Promise<Chat> {
    if (validateChatDTO(chatroomDTO) === true) {
      // stuff 
    }
  }

  async postToChatroom(messageDTO: CreateMessage): Promise<Message> {
    // TODO [importent]: check if the user is a memeber of the channel && if he's not muted
    const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
    const user = await this.chatHelpers.getUser(messageDTO.userId);
    return await this.messageService.create(messageDTO, chatRoom, user);
    // if not throw !
  }
}
