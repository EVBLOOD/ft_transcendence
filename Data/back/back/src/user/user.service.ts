import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { createUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findUserByUserName(Name: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({
      userName: Name,
    });
    return user;
  }
  async getListOfUsers(): Promise<User[] | undefined> {
    const users = await this.userRepo.find({});
    if (users.length === 0) {
      throw new HttpException(
        'no users in the database',
        HttpStatus.BAD_REQUEST,
      );
    }
    return users;
  }
  async addUser(userdto: createUserDTO): Promise<User | undefined> {
    const user = await this.userRepo.find({
      where: {
        userName: userdto.userName,
      },
    });
    if (user.length !== 0) {
      throw new BadRequestException('user already exist');
    }
    const newUser = new User();
    newUser.userName = userdto.userName;
    return this.userRepo.save(newUser);
  }
}
