import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>) {}

  async findAll() {
    const GetUsers : User[] = await this.UserRepo.find();
    return GetUsers;
  }

  async findOne(id: string) {
    console.log(`This action returns a #${id} user`);
    const GetUser = await this.UserRepo.findOneBy({username: id});
    if (GetUser == null)
      console.log("User null 404");
    return GetUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(`This action updates a #${id} user`);
    return (
      await this.UserRepo.save(
      { username: id,
        name: updateUserDto.name,
        avatar: updateUserDto.avatar,
        email: updateUserDto.email,
        two_factor_authentication_state: updateUserDto.two_factor_authentication_state }
      ));
  }

}
