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
  ) { }

  async create(id: number, user_target: number) {
    const { UserSending, UserReceiving } = await this.UsersCheckerBothId(
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

  async accepting(id: number, userTo_accept: number) {
    const { UserSending, UserReceiving } = await this.UsersCheckerBothId(
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

  async FriendshipStatus(id: number, lookfor: number) {
    if (!(await this.UserRepo.findOneBy({ id: id }))) return undefined;
    const look = await this.UserRepo.findOneBy({ id: lookfor });
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
  async blockOneEach(id: number) {
    return await this.FriendShipRepo.find({
      where: [
        { sender: id, blocked: true },
        { receiver: id, blocked: true },
      ],
    });
  }
  async WeBlockedEachOther(id0: number, id1: number) {
    return await this.FriendShipRepo.findOne({
      where: [
        { sender: id1, receiver: id0, blocked: true },
        { receiver: id1, sender: id0, blocked: true },
      ],
    });
  }
  async blocklist(id: number, skip: number, take: number) {
    if (!(await this.UserRepo.findOneBy({ id: id }))) return undefined;
    let blocklist = await this.FriendShipRepo.find({
      where: [
        { receiver: id, blocked: true, blocked_by: 'receiver' },
        { sender: id, blocked: true, blocked_by: 'sender' },
      ],
      take: take,
      skip: skip,
    });
    blocklist.forEach((elmnt) => { if (elmnt.sender == id) elmnt.sender = elmnt.receiver })
    return blocklist;
  }

  async UsersCheckerId(username1: number, username2: string) {
    const UserSending: User = await this.UserRepo.findOneBy({ id: username1 });
    const UserReceiving: User = await this.UserRepo.findOneBy({
      username: username2,
    });
    return { UserSending, UserReceiving };
  }

  async UsersCheckerBothId(username1: number, username2: number) {
    const UserSending: User = await this.UserRepo.findOneBy({ id: username1 });
    const UserReceiving: User = await this.UserRepo.findOneBy({
      id: username2,
    });
    return { UserSending, UserReceiving };
  }

  async blocking(id: number, userTo_block: number) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerBothId(id, userTo_block);
    if (UserBlocking === null || UserReceiving === null) return undefined;
    const friendship = await this.FriendShipRepo.find({
      where: [
        { receiver: UserReceiving.id, sender: id },
        { receiver: id, sender: UserReceiving.id },
      ],
    });
    if (friendship.length > 1 || friendship.length == 0) {
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
    if (friendship[0].sender == id)
      friendship[0].blocked_by = 'sender';
    else
      friendship[0].blocked_by = 'receiver';
    return await this.FriendShipRepo.save(friendship[0]);
  }

  async remove(id: number, userBeingRemoved: number) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerBothId(id, userBeingRemoved);
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

  async unblock(user_forgeiving: number, blocked_user: number) {
    const { UserSending: UserBlocking, UserReceiving } =
      await this.UsersCheckerBothId(user_forgeiving, blocked_user);
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

  async friendList(id: number, skip: number, take: number) {
    const user = await this.UserRepo.findOneBy({ id: id });
    if (user == null) return undefined;
    let findList: any;
    if (skip == 0 && take == 0) {
      findList = await this.FriendShipRepo.createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.user1', 'user1')
        .leftJoinAndSelect('friendship.user2', 'user2')
        .where('friendship.receiver = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .orWhere('friendship.sender = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .getMany();
    } else {
      findList = await this.FriendShipRepo.createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.user1', 'user1')
        .leftJoinAndSelect('friendship.user2', 'user2')
        .where('friendship.receiver = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .orWhere('friendship.sender = :id', { id: user.id })
        .andWhere('friendship.blocked = :blocked', { blocked: false })
        .andWhere('friendship.status = :status', { status: 'accepted' })
        .skip(skip)
        .take(take)
        .getMany();
    }
    if (findList == null) return null;
    let friends: Array<User> = [];
    findList.forEach((element) => {
      if (element.user1.id == user.id) friends.push(element.user2);
      else friends.push(element.user1);
    });
    return friends;
  }

  async suggested(id: number, skip: number, take: number) {
    let frindList = await this.friendList(id, 0, 0);
    if (frindList == undefined) return undefined;
    else if (frindList == null) frindList = [];
    let friends_UserName: Array<number> = [];
    friends_UserName.push(id);
    frindList.forEach((element) => {
      friends_UserName.push(element.id);
    });
    return await this.UserRepo.find({
      where: { id: Not(Any(friends_UserName)) },
      take: take,
      skip: skip,
    }); // TODO: I may check next the User if is blockig you..
  }

  async findOne(id: number, userSearching: number) {
    const user1 = await this.UserRepo.findOneBy({ id: id });
    if (!user1) return undefined;
    const user2 = await this.UserRepo.findOneBy({ id: userSearching });
    if (!user2) return undefined;
    return await this.FriendShipRepo.find({
      where: [
        {
          receiver: id,
          sender: user2.id,
          blocked: false,
        },
        { sender: id, receiver: user2.id, blocked: false },
      ],
    });
  }
}
