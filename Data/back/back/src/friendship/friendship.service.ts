import { Injectable } from '@nestjs/common';
import {
  CreateFriendshipDto,
  DealingWithRequestDto,
  UserValidatingDto,
} from './dto/create-friendship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Any, Not, Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    @InjectRepository(Friendship)
    private readonly FriendShipRepo: Repository<Friendship>,
  ) {}

  async create(id: number, user_target: string) {
    const { UserSending, UserReceiving } = await this.UsersCheckerId(
      id,
      user_target,
    );
    if (!UserSending || !UserReceiving) return undefined;
    const Getstatus = await this.FriendShipRepo.findOne({
      where: [
        { receiver: UserSending.id, sender: UserReceiving.id },
        { receiver: UserReceiving.id, sender: UserSending.id },
      ],
    });
    if (Getstatus) return null;
    return await this.FriendShipRepo.save({
      sender: UserSending.id,
      receiver: UserReceiving.id,
      blocked: false,
      blocked_by: '',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: 'pending',
    });
  }

  async accepting(id: number, userTo_accept: string) {
    const { UserSending, UserReceiving } = await this.UsersCheckerId(
      id,
      userTo_accept,
    );
    if (UserSending == null || UserReceiving == null) return undefined;
    const friendship = await this.FriendShipRepo.findOneBy({
      sender: UserReceiving.id,
      receiver: id,
      status: 'pending',
      blocked: false,
    }); // UsersCencerned.Userone is the one sent the request
    if (!friendship) return undefined;
    return await this.FriendShipRepo.save({
      receiver: id,
      sender: UserReceiving.id,
      updated_at: new Date().toISOString(),
      status: 'accepted',
    });
  }

  async requestsList(id: number, skip: number, take: number) {
    if (!(await this.UserRepo.findOneBy({ id: id }))) return undefined;
    return await this.FriendShipRepo.find({
      where: { receiver: id, status: 'pending', blocked: false },
      take: take,
      skip: skip,
    });
  }

  async FriendshipStatus(id: number, lookfor: string) {
    if (!(await this.UserRepo.findOneBy({ id: id }))) return undefined;
    const look = await this.UserRepo.findOneBy({ username: lookfor });
    if (!look) return undefined;
    const Getstatus = await this.FriendShipRepo.findOne({
      where: [
        { receiver: id, sender: look.id },
        { receiver: look.id, sender: id },
      ],
    });
    if (!Getstatus) return null;

    if (Getstatus.sender == id) {
      if (Getstatus.blocked) {
        if (Getstatus.blocked_by == 'sender') return { status: 'you blocked' };
        return { status: 'you are blocked' };
      } else if (Getstatus.status == 'pending')
        return { status: 'you are on pending' };
      else if (Getstatus.status == 'accepted')
        return { status: 'you are accepted' };
    } else {
      if (Getstatus.blocked) {
        if (Getstatus.blocked_by == 'sender')
          return { status: 'you are blocked' };
        return { status: 'you blocked' };
      } else if (Getstatus.status == 'pending') return { status: 'accept?' };
      else if (Getstatus.status == 'accepted')
        return { status: 'you are accepted' };
    }
  }

  async blocklist(id: number, skip: number, take: number) {
    if (!(await this.UserRepo.findOneBy({ id: id }))) return undefined;
    return await this.FriendShipRepo.find({
      where: [
        { receiver: id, blocked: true, blocked_by: 'receiver' },
        { sender: id, blocked: true, blocked_by: 'sender' },
      ],
      take: take,
      skip: skip,
    });
  }

  async UsersCheckerId(username1: number, username2: string) {
    const UserSending: User = await this.UserRepo.findOneBy({ id: username1 });
    const UserReceiving: User = await this.UserRepo.findOneBy({
      username: username2,
    });
    return { UserSending, UserReceiving };
  }

  async blocking(id: number, userTo_block: string) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerId(id, userTo_block);
    if (UserBlocking === null || UserReceiving === null) return undefined;
    const friendship = await this.FriendShipRepo.find({
      where: [
        { receiver: UserReceiving.id, sender: id },
        { sender: id, receiver: UserReceiving.id },
      ],
    });
    if (friendship.length > 1 || friendship.length === 0) {
      if (friendship.length != 0) return undefined;
      return await this.FriendShipRepo.save({
        sender: id,
        receiver: UserReceiving.id,
        blocked: true,
        blocked_by: 'sender',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        status: 'pending',
      });
    }
    if (friendship[0].blocked) return false;
    friendship[0].blocked = true;
    if (friendship[0].receiver === id) friendship[0].blocked_by = 'receiver';
    else friendship[0].blocked_by = 'sender';
    return await this.FriendShipRepo.save(friendship[0]);
  }

  async remove(id: number, userBeingRemoved: string) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerId(id, userBeingRemoved);
    if (UserBlocking == null || UserReceiving == null) return undefined;
    const friendship = await this.FriendShipRepo.find({
      where: [
        { receiver: id, sender: UserReceiving.id },
        { sender: id, receiver: UserReceiving.id },
      ],
    });
    if (friendship.length > 1 || friendship.length == 0) return null;
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async unblock(user_forgeiving: number, blocked_user: string) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerId(user_forgeiving, blocked_user);
    if (UserBlocking == null || UserReceiving == null) return undefined;
    const friendship = await this.FriendShipRepo.find({
      where: [
        {
          receiver: UserReceiving.id,
          sender: user_forgeiving,
          blocked: true,
          blocked_by: 'sender',
        },
        {
          sender: UserReceiving.id,
          receiver: user_forgeiving,
          blocked: true,
          blocked_by: 'receiver',
        },
      ],
    });
    if (friendship.length > 1 || friendship.length === 0) return undefined;
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async friendList(username: string, skip: number, take: number) {
    const user = await this.UserRepo.findOneBy({ username: username });
    if (user == null) return undefined;
    let findList: any;
    if (skip == 0 && take == 0) {
      findList = await this.FriendShipRepo.createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.user1', 'user1')
        .leftJoinAndSelect('friendship.user2', 'user2')
        .where('friendship.receiver = :id', { id: user.id })
        .orWhere('friendship.sender = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .getMany();
    } else {
      findList = await this.FriendShipRepo.createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.user1', 'user1')
        .leftJoinAndSelect('friendship.user2', 'user2')
        .where('friendship.receiver = :id', { id: user.id })
        .orWhere('friendship.sender = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .take(take)
        .skip(skip)
        .getMany();
    }
    if (findList == null) return null;
    let friends: Array<User> = [];
    findList.forEach((element) => {
      if (element.receiver == user.id) friends.push(element.user2);
      else friends.push(element.user1);
    });
    return friends;
  }

  async suggested(username: string, skip: number, take: number) {
    let frindList = await this.friendList(username, 0, 0);
    if (frindList == undefined) return undefined;
    else if (frindList == null) frindList = [];
    let friends_UserName: Array<string> = [];
    friends_UserName.push(username);
    frindList.forEach((element) => {
      friends_UserName.push(element.username);
    });
    return await this.UserRepo.find({
      where: { username: Not(Any(friends_UserName)) },
      take: take,
      skip: skip,
    }); // TODO: I may check next the User if is blockig you..
  }

  async findOne(id: number, userSearching: string) {
    const user1 = await this.UserRepo.findOneBy({ id: id });
    if (!user1) return undefined;
    const user2 = await this.UserRepo.findOneBy({ username: userSearching });
    if (!user2) return undefined;
    const retur = await this.FriendShipRepo.find({
      where: [
        {
          receiver: id,
          sender: user2.id,
          blocked: true,
          blocked_by: 'receiver',
        },
        { receiver: id, sender: user2.id, blocked: true, blocked_by: 'sender' },
      ],
    });
    if (retur.length == 0)
      return await this.UserRepo.find({ where: { username: userSearching } });
    return {};
  }
}
