import { Get, Post, Controller, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createUserDTO } from './dto/user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly usersercice: UserService) {}
  @Get()
  async getListOfUsers(): Promise<User[] | undefined> {
    console.log('called');
    try {
      return this.usersercice.getListOfUsers();
    } catch (err) {
      console.log(err);
    }
  }
  @Post()
  async addUser(@Body() userDTO: createUserDTO): Promise<User | undefined> {
    try {
      return this.usersercice.addUser(userDTO);
    } catch (err) {
      console.log(err);
    }
  }
}
