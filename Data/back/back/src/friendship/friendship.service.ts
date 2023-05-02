import { Injectable } from '@nestjs/common';
import { CreateFriendshipDto, DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {


  constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>,
              @InjectRepository(Friendship) private readonly FriendShipRepo : Repository<Friendship>) {}




  async UsersChecker(dealingWithRequestDto: DealingWithRequestDto)
  {
    const UserSending : User = await this.UserRepo.findOneBy({username: dealingWithRequestDto.Userone});
    const UserReceiving : User = await this.UserRepo.findOneBy({username: dealingWithRequestDto.Usertwo});
    return {UserSending, UserReceiving};
  }

  async create(createFriendshipDto: CreateFriendshipDto) {
    console.log(`This action adds a new request sent from ${createFriendshipDto.user1_username}, to ${createFriendshipDto.user2_username}`);
    const stuff : DealingWithRequestDto = {Userone: createFriendshipDto.user1_username, Usertwo: createFriendshipDto.user2_username};
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
    const friendship = await this.FriendShipRepo.findOneBy({user1_username: UsersCencerned.Userone, user2_username: UsersCencerned.Usertwo, status: 'pending', blocked: false}); // UsersCencerned.Userone is the one sent the request
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
        [{user1_username: UsersCencerned.Userone, user2_username: UsersCencerned.Usertwo, blocked_by: "Userone"},
        {user2_username: UsersCencerned.Userone, user1_username: UsersCencerned.Usertwo,blocked: true, blocked_by: "Usertwo"}]
        });
    if (friendship.length > 1 || friendship.length == 0)
    {
      console.log("for some reason friendship.length == 0 | or > 1");
      return undefined;
    }
    return await this.FriendShipRepo.remove(friendship[0]);
  }

  async suggested(User: UserValidatingDto) // TODO: tomorow
  {
    console.log(`Suggestions to ${User.Userone}`);
    if (await this.UserRepo.findOneBy({username: User.Userone}) == null)
    {
      console.log("this User doesn't exist");
      return (undefined);
    }
  //   const result = await this.FriendShipRepo
  // .createQueryBuilder("Friendship")
  // .leftJoinAndSelect("Friendship.username", "user")
  // .where("user.id = :id", { id: 1 })
  // .getMany();
    // this.FriendShipRepo.createQueryBuilder('User').innerJoin('Friendship')
  }
  // findAll() {
  //   return `This action returns all friendship`;
  // }

  findOne(id: string) {
    return `This action returns a #${id} friendship`;
  }

  // update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
  //   return `This action updates a #${id} friendship`;
  // }

}
