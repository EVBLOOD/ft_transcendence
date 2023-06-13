import { Injectable } from '@nestjs/common';
import { CreateFriendshipDto, DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Any, Not, Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {


  constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>,
              @InjectRepository(Friendship) private readonly FriendShipRepo : Repository<Friendship>) {}


  async UsersChecker(username1: string, username2: string)
  {
    const UserSending : User = await this.UserRepo.findOneBy({username: username1});
    const UserReceiving : User = await this.UserRepo.findOneBy({username: username2});
    return {UserSending, UserReceiving};
  }

  async create(user_sending: string, user_target: string) {
    const {UserSending, UserReceiving} = await this.UsersChecker(user_sending, user_target);
    if (!UserSending || !UserReceiving)
      return undefined;
    return await this.FriendShipRepo.save( {sender: UserSending.username,
        receiver: UserReceiving.username,
        blocked: false,
        blocked_by: "",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        status: "pending"} );
  }

  async accepting(user_accepting: string, userTo_accept: string)
  {
    const {UserSending, UserReceiving} = await this.UsersChecker(user_accepting, userTo_accept);
    if (UserSending == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.findOneBy({sender: userTo_accept, receiver: user_accepting, status: 'pending', blocked: false}); // UsersCencerned.Userone is the one sent the request
    if (!friendship)
      return undefined;
    return await this.FriendShipRepo.save({receiver: user_accepting, sender:userTo_accept, updated_at: new Date().toISOString(), status: 'accepted'});
  }

  async requestsList(username: string, skip: number, take: number)
  {
    if (!(await this.UserRepo.findOneBy({username: username})))
      return (undefined);
    return await this.FriendShipRepo.find({where: {receiver: username, status: 'pending', blocked: false}, take: take, skip: skip});
  }

  async blocklist(username: string, skip: number, take: number)
  {
    if (!(await this.UserRepo.findOneBy({username: username})))
      return (undefined);
    return await this.FriendShipRepo.find({where: [{receiver: username, blocked: true, blocked_by: "receiver"},
          {sender: username, blocked: true, blocked_by: "sender"}], take: take, skip: skip});
  }


  async blocking(user_blocking: string, userTo_block: string)
  {
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(user_blocking, userTo_block);
    if (UserBlocking === null || UserReceiving === null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{receiver: userTo_block, sender: user_blocking},
          {sender: user_blocking, receiver: userTo_block}]
        });
    if (friendship.length > 1 || friendship.length === 0)
    {
      if (friendship.length != 0)
        return undefined;
      return await this.FriendShipRepo.save( {sender: user_blocking,
        receiver: userTo_block,
        blocked: true,
        blocked_by: "sender",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        status: "pending"} );
    }
    friendship[0].blocked = true;
    if (friendship[0].receiver === user_blocking)
      friendship[0].blocked_by = "receiver";
    else
      friendship[0].blocked_by = "sender";
    return await this.FriendShipRepo.save(friendship[0]);
  }
  
  async remove(user_willingRemoval: string, userBeingRemoved: string) {
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(user_willingRemoval, userBeingRemoved);
    if (UserBlocking == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{receiver: user_willingRemoval, sender: userBeingRemoved},
          {sender: user_willingRemoval, receiver: userBeingRemoved}]
        });
    if (friendship.length > 1 || friendship.length == 0)
        return null;
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async unblock(user_forgeiving : string, blocked_user : string)
  {
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(user_forgeiving, blocked_user);
    if (UserBlocking === null || UserReceiving === null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{receiver: blocked_user, sender: user_forgeiving, blocked: true, blocked_by: "sender"},
        {sender: blocked_user, receiver: user_forgeiving ,blocked: true, blocked_by: "receiver"}]
        });
    if (friendship.length > 1 || friendship.length === 0)
      return undefined;
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async friendList(username: string, skip : number, take: number)
  {
    if (await this.UserRepo.findOneBy({username: username}) == null)
      return (undefined);
    let findList : any;
    if (skip == 0 && take == 0)
    { 
      findList = await this.FriendShipRepo
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user1', 'user1')
      .leftJoinAndSelect('friendship.user2', 'user2')
      .where('friendship.receiver = :username', {username: username})
      .orWhere('friendship.sender = :username', {username: username})
      .andWhere('friendship.blocked = :blocked', {blocked: false})
      .andWhere('friendship.status = :status', {status: 'accepted'}).getMany();
    }
    else
    {
      findList = await this.FriendShipRepo
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user1', 'user1')
      .leftJoinAndSelect('friendship.user2', 'user2')
      .where('friendship.receiver = :username', {username: username})
      .orWhere('friendship.sender = :username', {username: username})
      .andWhere('friendship.blocked = :blocked', {blocked: false})
      .andWhere('friendship.status = :status', {status: 'accepted'}).take(take).skip(skip).getMany();
    }
    if (findList == null)
      return null;
    let friends: Array<User> = [];
    findList.forEach(element => {
      if (element.receiver == username)
        friends.push(element.user2);
      else
        friends.push(element.user1);
    });
    return friends;
  }

  async suggested(username: string, skip : number, take: number)
  {
    let frindList = await this.friendList(username, 0 , 0);
    if (frindList == undefined)
      return undefined;
    else if (frindList == null)
      frindList = [];
    let friends_UserName: Array<string> = [];
    friends_UserName.push(username);
    frindList.forEach(element => {
      friends_UserName.push(element.username);
    });
    return await this.UserRepo.find({where: {username: Not(Any(friends_UserName))}, take: take, skip: skip});  // TODO: I may check next the User if is blockig you..
  }

  async findOne(id: string, username: string) {
     // TODO: I may check next the User if is blockig you..
    return await this.UserRepo.find({where: {username: id}});
  }
}
