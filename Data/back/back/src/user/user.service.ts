import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findUserByUserName(userName: string): Promise<User> {
    const user = await this.userRepo.findOneBy({
      userName: userName,
    });
    return user;
  }
}
