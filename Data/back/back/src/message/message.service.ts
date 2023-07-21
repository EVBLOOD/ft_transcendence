import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessage } from './dto/message.dto';
import { Chat } from 'src/chat/chat.entity';
// import { User } from 'src/user/user.entity';
import { createNewMessage, validateMessage } from './message.utils';
import { User } from 'src/user/entities/user.entity';

//https://typeorm.io/find-options

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) { }

  async getMessageByUserId(userName: string) {
    const message = await this.messageRepo.find({
      order: {
        // get messages in ascending order
        id: 'asc',
      },
      relations: {
        // load the userId and chatroom entity in a singel query
        userId: true,
        chatRoomId: true,
      },
      where: {
        // only care bout the with the passed ID
        userId: {
          username: userName,
        },
      },
      select: {
        // we only care about these values
        userId: {
          // id: true,
          username: true,
        },
        chatRoomId: {
          id: true,
          chatRoomName: true,
          type: true,
        },
        value: true,
      },
      //cache: true, // store resoltes in memory for future use
    });
    if (message.length !== 0) {
      return message;
    }
    throw new NotFoundException(`No messages found for user ${userName}`);
  }

  async getMessagesByChatroomID(chatID: number): Promise<Message[]> {
    const messages = await this.messageRepo.find({
      where: {
        chatRoomId: {
          id: chatID,
        },
      },
      select: {
        userId: {
          // id: true,
          username: true,
        },
        chatRoomId: {
          type: true,
          id: true,
          chatRoomName: true,
        },
        value: true,
      },
      relations: {
        chatRoomId: true,
        userId: true,
      },
      order: {
        id: 'asc',
      },
      //cache: true,
    });
    return messages;
  }

  async create(
    messageDTO: CreateMessage,
    chatRoom: Chat,
    user: User,
  ): Promise<Message> {
    if (validateMessage(messageDTO.value) == false)
      throw new BadRequestException('connot send empty message');
    const message = createNewMessage(messageDTO.value, chatRoom, user);
    return this.messageRepo.save(message);
  }
  async getMessagesByChatID(chatID: number): Promise<Message[]> {
    const messages = await this.messageRepo.find({
      where: {
        chatRoomId: {
          id: chatID,
        },
      },
      relations: {
        chatRoomId: true,
        userId: true,
      },
      select: {
        userId: {
          username: true,
        },
        chatRoomId: {
          id: true,
          chatRoomName: true,
          type: true,
        },
        value: true,
      },
      //cache: true,
    });
    return messages;
  }

  // async getUserMessagesInChatroom(chatID: number, userName: string) : Promise<Message[]> {
  //   const messages = await this.messageRepo.find({
  //     order: {
  //       id: 'asc'
  //     },
  //     where: {
  //       chatRoomId: {
  //         id: chatID,
  //       },
  //       userId: {
  //         userName: userName,
  //       },
  //     },
  //     relations: {
  //       chatRoomId: true,
  //       userId: true,
  //     },
  //     select: {
  //       userId: {
  //         userName: true,
  //       },
  //       chatRoomId: {
  //         id :true,
  //         chatRoomName: true,
  //         type: true,
  //       },
  //       value: true,
  //     },
  //     //cache: true,
  //   })
  //   return messages;
  // }
} // END OF MessageService Class
