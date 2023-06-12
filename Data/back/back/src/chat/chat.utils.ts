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

  async getUser(id: number): Promise<User | undefined> {
    const user = await this.userService.findUserById(id);
    if (user) return user;
    throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  }
} // end of ChatUtils Class
