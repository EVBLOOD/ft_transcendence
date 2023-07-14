import { Get, Post, Controller, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createUserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersercice: UserService) {}
  @Get()
  async getListOfUsers(): Promise<User[] | undefined> {
    try {
      return this.usersercice.getListOfUsers();
    } catch (err) {
      console.log(err);
    }
  }
  @Post()
  async addUser(@Body() user: createUserDTO): Promise<User | undefined> {
    try {
      console.log(
        'user: ', user
      );
      // const userDTO: createUserDTO = {
      //   userName: user,
      // }
      return this.usersercice.addUser(user);
    } catch (err) {
      console.log(err);
    }
  }
}
