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




  async UsersChecker(dealingWithRequestDto: DealingWithRequestDto)
  {
    const UserSending : User = await this.UserRepo.findOneBy({username: dealingWithRequestDto.Usertwo});
    const UserReceiving : User = await this.UserRepo.findOneBy({username: dealingWithRequestDto.Userone});
    return {UserSending, UserReceiving};
  }

  async create(createFriendshipDto: DealingWithRequestDto) {
    console.log(`This action adds a new request sent from ${createFriendshipDto.Userone}, to ${createFriendshipDto.Usertwo}`);
    const stuff : DealingWithRequestDto = {Userone: createFriendshipDto.Userone, Usertwo: createFriendshipDto.Usertwo};
    const {UserSending, UserReceiving} = await this.UsersChecker(stuff);
    if (UserSending == null || UserReceiving == null)
      return undefined;
    return await this.FriendShipRepo.save( {user1_username: UserSending.username,
        user2_username: UserReceiving.username,
        blocked: false,
        blocked_by: "",
        updated_at: Date.now(),
        created_at: Date.now(),
        status: "pending"} );
  }

  async accepting(UsersCencerned: DealingWithRequestDto)
  {
    console.log(`This action makes the request sent from ${UsersCencerned.Userone}, to ${UsersCencerned.Usertwo} accepted`);
    const {UserSending, UserReceiving} = await this.UsersChecker(UsersCencerned);
    if (UserSending == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.findOneBy({user2_username: UsersCencerned.Userone, user1_username: UsersCencerned.Usertwo, status: 'pending', blocked: false}); // UsersCencerned.Userone is the one sent the request
    if (friendship == null)
    {
      console.log("this Friendship doesn't exist, not pending, or blocked!");
      return undefined;
    }
    return await this.FriendShipRepo.save({user1_username: UserSending.username, user2_username: UserReceiving.username, updated_at: Date.now(), status: 'accepted'});
  }

  async requestsList(User: UserValidatingDto)
  {
    if (await this.UserRepo.findOneBy({username: User.Userone}) == null)
    {
      console.log("this User doesn't exist");
      return (undefined);
    }
    const friendship = await this.FriendShipRepo.findOneBy({user2_username: User.Userone, status: 'pending', blocked: false});
    return (friendship);
  }

  async blocklist(User: UserValidatingDto)
  {
    if (await this.UserRepo.findOneBy({username: User.Userone}) == null)
    {
      console.log("this User doesn't exist");
      return (undefined);
    }
    const friendship = await this.FriendShipRepo.find({where: [{user1_username: User.Userone, blocked: true, blocked_by: "Userone"},
          {user2_username: User.Userone, blocked: true, blocked_by: "Usertwo"}]});
    return (friendship);
  }


  async blocking(UsersCencerned: DealingWithRequestDto)
  {
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(UsersCencerned);
    if (UserBlocking == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{user1_username: UsersCencerned.Userone, user2_username: UsersCencerned.Usertwo},
          {user2_username: UsersCencerned.Userone, user1_username: UsersCencerned.Usertwo}]
        });
    if (friendship.length > 1 || friendship.length == 0)
    {
      if (friendship.length == 0)
      {
        console.log("for some reason friendship.length == 0 | or > 1");
        return undefined;
      }
      console.log("Not found adding and blocking");
      return await this.FriendShipRepo.save( {user2_username: UserBlocking.username,
        user1_username: UserReceiving.username,
        blocked: true,
        blocked_by: "Userone", // this one is tricky!
        updated_at: Date.now(),
        created_at: Date.now(),
        status: "pending"} );
    }
    friendship[0].blocked = true;
    if (friendship[0].user1_username === UsersCencerned.Userone)
      friendship[0].blocked_by = "Userone";
    else
      friendship[0].blocked_by = "Usertwo";
    return await this.FriendShipRepo.save(friendship[0]);
  }
  
  async remove(UsersCencerned: DealingWithRequestDto) {
    console.log(`Removing friendship between ${UsersCencerned.Userone} and ${UsersCencerned.Usertwo}`);
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(UsersCencerned);
    if (UserBlocking == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{user1_username: UsersCencerned.Userone, user2_username: UsersCencerned.Usertwo},
          {user2_username: UsersCencerned.Userone, user1_username: UsersCencerned.Usertwo}]
        });
    if (friendship.length > 1 || friendship.length == 0){
        console.log("for some reason friendship.length == 0 | or > 1");
        return undefined;
      }
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async unblock(UsersCencerned: DealingWithRequestDto)
  {
    // first one want to unblock two
    const {UserSending: UserBlocking, UserReceiving} = await this.UsersChecker(UsersCencerned);
    if (UserBlocking == null || UserReceiving == null)
      return undefined;
    const friendship = await this.FriendShipRepo.find({where:
        [{user1_username: UsersCencerned.Userone, user2_username: UsersCencerned.Usertwo, blocked: true, blocked_by: "Userone"},
        {user2_username: UsersCencerned.Userone, user1_username: UsersCencerned.Usertwo,blocked: true, blocked_by: "Usertwo"}]
        });
    if (friendship.length > 1 || friendship.length == 0)
    {
      console.log("for some reason friendship.length == 0 | or > 1");
      return undefined;
    }
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async friendList(User: UserValidatingDto)
  {
    console.log(`Suggestions to ${User.Userone}`);
    if (await this.UserRepo.findOneBy({username: User.Userone}) == null)
    {
      console.log("this User doesn't exist");
      return (undefined);
    }
    const findList = await this.FriendShipRepo.find({where: [
      {user1_username: User.Userone, blocked: false},
      {user2_username: User.Userone, blocked: false}
    ],
    })
    if (findList == null)
      return findList;
    let lastone: Array<User>;
    findList.forEach(element => {
      if (element.user1_username == User.Userone)
        lastone.push(element.user2);
      else
        lastone.push(element.user1);
    });
    return lastone;
  }

  async suggested(User: UserValidatingDto)
  {
    const frindList = await this.friendList(User);
    if (frindList == undefined)
      return undefined;
    else if (frindList == null)
      return {};
    let lastone: Array<string>;
    frindList.forEach(element => {
      lastone.push(element.user);
    });
    return await this.UserRepo.find({where: {username: Any(lastone)}});
  }

  // findAll() {
  //   return `This action returns all friendship`;
  // }

  async findOne(id: string) {
    return await this.UserRepo.find({where: {username: id}});
  }

  // update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
  //   return `This action updates a #${id} friendship`;
  // }

}
