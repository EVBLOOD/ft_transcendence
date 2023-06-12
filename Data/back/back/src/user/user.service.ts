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

  private currentstate = new Map< string, {client: string, status: string, lastupdate: string}[] >(); 
  
  async findAll() {
    return await this.UserRepo.find();
  }

  async findOne(id: string) {
    return await this.UserRepo.findOneBy({username: id});
  }

  async UpdateAvatar(id: string, path: string)
  {
    return (
      await this.UserRepo.save(
        { username: id,
          avatar: path
        })
      );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return (
      await this.UserRepo.save(
      { username: id,
        name: updateUserDto.name,
        avatar: updateUserDto.avatar,
        email: updateUserDto.email,
        TwoFAenabled: updateUserDto.TwoFAenabled,
        TwoFAsecret: updateUserDto.TwoFAsecret }
      ));
  }

  AddState(username: string, socket : Socket, type: string)
  {
    let colect : {client: string, status: string, lastupdate: string}[];
    if (this.currentstate.has(username))
      colect = this.currentstate.get(username);
    else
      colect = [];
    let i : number = 0;
    for (i; i < colect.length; i++)
    {
      if (colect[i]['client'] == socket.id)
      {
        colect[i].status = type;
        colect[i].lastupdate = Date().toString();
        break;
      }
    }
    if (i != colect.length)
      return;
    colect.push({client: socket.id, status: type, lastupdate: Date().toString()});
    this.currentstate.set(username, colect);
  }

  GetAllCurrentStates(username : string)
  {
    if (!this.currentstate.has(username))
      return null;
    return this.currentstate.get(username);;
  }
  
  GetCurrentState(username : string)
  {
    if (!this.currentstate.has(username))
      return null;
    let colect : {client: string, status: string, lastupdate: string}[] = this.currentstate.get(username);
    let col : {client: string, status: string, lastupdate: string} = colect[colect.length - 1];
    for (let i : number = 0; i < colect.length - 1; i++)
    {
      if ((new Date(colect[i].lastupdate)) > (new Date(col.lastupdate)))
        col = colect[i];
    }
    return col;
  }

  RemoveState(Socket: Socket, username: string)
  {
    if (!this.currentstate.has(username))
      return null;
    let colect : {client: string, status: string, lastupdate: string}[] = this.currentstate.get(username);
    let newholder : {client: string, status: string, lastupdate: string}[] = [];
    colect.map((col) => { if (col.client != Socket.id) newholder.push(col); });
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
