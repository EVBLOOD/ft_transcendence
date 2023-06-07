import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { escape } from 'querystring';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>) {}

  private currentstate = new Map< string, {client: Socket, status: string}[] >(); 
  
  async findAll() {
    const GetUsers : User[] = await this.UserRepo.find();
    // send only the importent data.
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

  AddState(username: string, socket : Socket, type: string)
  {
    console.log(socket.id)
    let colect : {client: Socket, status: string}[];
    if (this.currentstate.has(username))
      colect = this.currentstate.get(username);
    else
      colect = [];
    let i : number = 0;
    for (i; i < colect.length; i++)
    {
      if (colect[i]['client'].id == socket.id)
      {
        colect[i].status = type;
        break;
      }
    }
    if (i != colect.length)
      return;
    colect.push({client: socket, status: type});
    this.currentstate.set(username, colect);
  }

  GetAllCurrentStates(username : string)
  {
    if (!this.currentstate.has(username))
      return null;
    let colect : {client: Socket, status: string}[] = this.currentstate.get(username);
    return colect;
  }

  GetCurrentState(username : string)
  {
    if (!this.currentstate.has(username))
      return null;
    let colect : {client: Socket, status: string}[] = this.currentstate.get(username);
    return colect[colect.length - 1]['status'];
  }
  GetCurrentStateAll()
  {
    console.log(this.currentstate);
    return this.currentstate;
  }

  RemoveState(Socket: Socket, username: string)
  {
    if (!this.currentstate.has(username))
      return null;
    let colect : {client: Socket, status: string}[] = this.currentstate.get(username);
    let newholder : {client: Socket, status: string}[] = [];
    colect.map((col) => { if (col.client.id != Socket.id) newholder.push(col); });
    if (newholder.length == 0)
      this.currentstate.delete(username);
    else
      this.currentstate.set(username, newholder);
  }
  
  PruneUserState(username : string)
  {
    if (!this.currentstate.has(username))
      return null;
    this.currentstate.delete(username);
  }
}
