import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Admin, Repository, ReturnDocument } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/user.entity';
import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';
import { throws } from 'assert';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatUtils {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRoomRepo: Repository<Chat>,
    private readonly userService: UserService,
  ) { }

  async getUser(userName: string): Promise<User | undefined> {
    if (userName) {
      const user = await this.userService.findUserByUserName(userName);
      if (user) return user;
    }
    throw new HttpException(`User ${userName} Not Found`, HttpStatus.NOT_FOUND);
  }
  async checkForAdminRoll(chatID: number, Name: string): Promise<boolean> {
    const admin = await this.chatRoomRepo.findOne({
      relations: {
        admin: true,
      },
      where: {
        id: chatID,
        admin: {
          username: Name,
        },
      },
    });
    if (admin) return true;
    return false;
  }

  async checkForMemberRoll(chatID: number, Name: string): Promise<boolean> {
    const chatroom = await this.chatRoomRepo.findOne({
      relations: {
        member: true,
      },
      where: {
        id: chatID,
        member: {
          username: Name,
        },
      },
    });
    if (chatroom) {
      // if (
      //   chatroom.member.some((user: User) => {
      //     user.userName === Name;
      //   })
      // ) {
      return true;
      // }
    }
    return false;
  }

  async checkForOwnerRoll(chatID: number, Name: string): Promise<boolean> {
    const owner = await this.chatRoomRepo.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: chatID,
        owner: {
          username: Name,
        },
      },
    });
    if (owner) return true;
    return false;
  }
  async isMoreThenOneAdminInChatroom(chatID: number): Promise<boolean> {
    const chatroom = await this.chatRoomRepo.findOne({
      where: {
        id: chatID,
      },
      relations: {
        admin: true,
      },
    });
    if (chatroom) {
      if (chatroom.admin.length > 1) {
        return true;
      }
    }
    return false;
  }

  async isMoreThenOneMemberInChatroom(chatID: number): Promise<boolean> {
    const chatroom = await this.chatRoomRepo.findOne({
      where: {
        id: chatID,
      },
      relations: {
        member: true,
      },
    });
    if (chatroom) {
      if (chatroom.member.length > 1) {
        return true;
      }
    }
    return false;
  }
  async onlyOneUserInChatroom(chatID: number): Promise<boolean> {
    if (
      (await this.isMoreThenOneAdminInChatroom(chatID)) == true ||
      (await this.isMoreThenOneMemberInChatroom(chatID)) == true
    ) {
      return false;
    }
    return true;
  }
  async canBePunished(
    chatID: number,
    userName: string,
    punishmentDTO: createPunishmentDTO,
  ): Promise<boolean> {
    if ((await this.checkForAdminRoll(chatID, userName)) == false) {
      console.log('admin', userName);
      console.log('chatid', chatID);
      throw new HttpException(
        'Not allowed to Punishe users',
        HttpStatus.FORBIDDEN,
      );
    }
    if ((await this.checkForOwnerRoll(chatID, punishmentDTO.user)) == true) {
      throw new HttpException(
        'Cannot Punishment the chatroom owner',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
} // end of ChatUtils Class
