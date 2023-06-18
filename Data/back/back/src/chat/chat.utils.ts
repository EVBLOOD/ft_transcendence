import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatUtils {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRoomRepo: Repository<Chat>,
    private readonly userService: UserService,
  ) {}

  async getUser(userName: string): Promise<User | undefined> {
    const user = await this.userService.findUserByUserName(userName);
    if (user) return user;
    throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  }
  async checkForAdminRoll(chatID: number, userName: string): Promise<boolean> {
    const admin = await this.chatRoomRepo.findOne({
      relations: {
        admin: true,
      },
      where: {
        id: chatID,
        admin: {
          userName: userName,
        },
      },
    });
    if (admin) return true;
    return false;
  }

  async checkForMemberRoll(chatID: number, userName: string): Promise<boolean> {
    const member = await this.chatRoomRepo.findOne({
      relations: {
        member: true,
      },
      where: {
        id: chatID,
        member: {
          userName: userName,
        },
      },
    });
    if (member) return true;
    return false;
  }

  async checkForOwnerRoll(chatID: number, userName: string): Promise<boolean> {
    const owner = await this.chatRoomRepo.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: chatID,
        owner: {
          userName: userName,
        },
      },
    });
    if (owner) return true;
    return false;
  }
} // end of ChatUtils Class
