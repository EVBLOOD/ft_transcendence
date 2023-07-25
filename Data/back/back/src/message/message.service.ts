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

  async getMessageByUserId(userName: number) {
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
          id: userName,
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
    // throw new NotFoundException(`No messages found for user ${userName}`);
    return [];
  }

  async getMessagesByChatroomID(chatID: number) {
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
  ) {
    if (validateMessage(messageDTO.value) == false)
      return [];
    // throw new BadRequestException('connot send empty message');
    const message = createNewMessage(messageDTO.value, chatRoom, user);
    return this.messageRepo.save(message);
  }
  async getMessagesByChatID(chatID: number, id?: number) {
    // check if this Id is allowed to see. TODO: ALI
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
        id: true,
        userId: {
          id: true,
          name: true,
          // username: true,
          avatar: true,
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
    return messages.sort((item1, item2) => { return item2.id - item1.id });
  }

  // async getDmsMessagesByUserID(chatID: number, id?: number) {
  //   const messages = await this.messageRepo
  //     .createQueryBuilder('message')
  //     .leftJoinAndSelect('message.chatRoomId', 'chat')
  //     .leftJoinAndSelect('chat.member', 'member')
  //     .where('(member.id = :userA AND member.id = :userB) AND chat.type = :chatType', { userA: chatID, userB: id, chatType: 'DM' })
  //     .getMany();
  //   // check if this Id is allowed to see. TODO: ALI
  //   // const messages = await this.messageRepo.createQueryBuilder('messages').leftJoinAndSelect('messages.chatRoomIdId', 'chat').leftJoinAndSelect('chat.userIdId', 'Users').
  //   //   leftJoinAndSelect('messages.userIdId', 'Users').leftJoinAndSelect('chat.messages', 'user').where('user.id = :id1 and (user.id = :id2 or user.id = :id1)', { id1: chatID, id2: chatID }).getMany();
  //   console.log('messages')
  //   const messages = await this.messageRepo
  //     .createQueryBuilder('message')
  //     .leftJoinAndSelect('message.chatRoomId', 'chat')
  //     .leftJoinAndSelect('chat.member', 'member')
  //     .where('(member.id = :userA AND member.id = :userB) AND chat.type = :chatType', { userA: chatID, userB: id, chatType: 'DM' })
  //     .getMany();
  //   // const messages = await this.messageRepo.createQueryBuilder('messages').leftJoinAndSelect('messages.chatRoomId', 'Chat').leftJoinAndSelect('Chat.chatRoomMember', 'member')
  //   //   .where('member.id = :userId1 AND member.id = :userId2', { userId1: chatID, userId2: id }).getMany();
  //   console.log(messages)
  //   console.log('message')
  //   return messages;
  // }

  async getMessagesForDms(id1: number, id2: number) {
    // check if this Id is allowed to see. TODO: ALI
    const messages = await this.messageRepo.find({
      relations: {
        chatRoomId: true,
        userId: true,
      },
      where: {
        userId: {
          id: id1
        }
      },
      select: {
        userId: {
          id: true,
          name: true,
          // username: true,
          avatar: true,
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
