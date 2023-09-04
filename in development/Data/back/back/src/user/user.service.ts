import { FileTypeValidator, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
  ) { }

  private currentstate = new Map<
    number,
    { client: string; status: string; lastupdate: string }[]
  >();

  async findAll(skip: number, take: number) {
    return await this.UserRepo.find({ skip: skip, take: take });
  }

  getAllCurrentStates() {
    this.currentstate;
  }
  async findOne(id: number) {
    return await this.UserRepo.findOneBy({ id: id });
  }

  async findUserByUserName(id: string) {
    return await this.UserRepo.findOneBy({ username: id });

  }
  // async findMe(id: number) {
  //   return await this.UserRepo.findOneBy({ id: id });
  // }
  async UpdateAvatar(id: number, path: string) {
    return await this.UserRepo.save({ id: id, avatar: path });
  }

  async updateSimpleInfo(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepo.save({
      id: id,
      username: updateUserDto.username,
      name: updateUserDto.name,
      avatar: updateUserDto.avatar,
      TwoFAenabled: updateUserDto.twofactor,
      theme: updateUserDto.theme
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepo.save({
      id: id,
      name: updateUserDto.name,
    });
  }

  AddState(id: number, socket: Socket, type: string) {
    let colect: { client: string; status: string; lastupdate: string }[];
    if (this.currentstate.has(id)) colect = this.currentstate.get(id);
    else colect = [];
    let i: number = 0;
    for (i; i < colect.length; i++) {
      if (colect[i]['client'] == socket.id) {
        colect[i].status = type;
        colect[i].lastupdate = Date().toString();
        break;
      }
    }
    if (i != colect.length) return;
    colect.push({
      client: socket.id,
      status: type,
      lastupdate: Date().toString(),
    });
    this.currentstate.set(id, colect);
  }

  GetAllUsersCurrentState() {
    let n: { id: number; status: string }[] = [];
    this.currentstate.forEach((value: any, key: number) => {
      n.push({ id: key, status: this.GetCurrentState(key).status });
    });
    return n;
  }

  GetAllCurrentStates(id: number) {
    if (!this.currentstate.has(id)) return null;
    return this.currentstate.get(id);
  }

  GetCurrentState(id: number) {
    if (!this.currentstate.has(id)) return null;
    let colect: { client: string; status: string; lastupdate: string }[] =
      this.currentstate.get(id);
    let col: { client: string; status: string; lastupdate: string } =
      colect[colect.length - 1];
    for (let i: number = 0; i < colect.length - 1; i++) {
      if (new Date(colect[i].lastupdate) > new Date(col.lastupdate))
        col = colect[i];
    }
    return col;
  }

  RemoveState(Socket: Socket, id: number) {
    // console.info(this.currentstate);
    if (!this.currentstate.has(id)) return null;
    let colect: { client: string; status: string; lastupdate: string }[] =
      this.currentstate.get(id);
    let newholder: { client: string; status: string; lastupdate: string }[] =
      [];
    colect.map((col) => {
      if (col.client != Socket.id) newholder.push(col);
    });
    if (newholder.length == 0) this.currentstate.delete(id);
    else this.currentstate.set(id, newholder);
  }

  PruneUserState(id: number) {
    if (!this.currentstate.has(id)) return null;
    this.currentstate.delete(id);
  }

  async findUsersByUserName(username: string) {
    return await this.UserRepo.find({ where: { username: username } })
  }
}
