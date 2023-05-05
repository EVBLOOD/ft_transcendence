import { Inject, Injectable } from '@nestjs/common';
import { ChatPrimariesDto, ChatRecieveMSGDto, ChatintochanellsDto, CreateChatDto, OperatingChatDto, OperatingMuteChatDto, UpdateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Any, Not, Repository } from 'typeorm';
import { Members } from './entities/membership.entity';
import { Messages } from './entities/Messages.entity';
import { User } from 'src/user/entities/user.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { array, bool, boolean, object, when } from 'joi';
import { Friendship } from 'src/friendship/entities/friendship.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private readonly ChatRepo : Repository<Chat>,
    @InjectRepository(Members) private readonly MembersRepo : Repository<Members>,
    @InjectRepository(Messages) private readonly MessagesRepo : Repository<Messages>,
    @InjectRepository(User) private readonly UserRepo : Repository<User>,
    private readonly Friendship : FriendshipService) {}
/*
  if (await this.UserRepo.find({where: {username: data.data1.username}}) == null
        || await this.ChatRepo.find({where: {id: data.data1.id}}) == null
        || 
*/

  async SendMessage(data: ChatRecieveMSGDto)
  {
    if(await this.MembersRepo.find({where: {chatID: data.data1.id, username: data.data1.username}}))
      return undefined;
    const time = new Date();
    return await this.MessagesRepo.save({chat_id: data.data1.id, username: data.data1.username, content: data.data2.messaegbody, time: time.toISOString()});
  }

  async LoadMessages(data: ChatPrimariesDto)
  {
    const blocklist = await this.Friendship.blocklist({Userone: data.username}) as Friendship[];
    if (blocklist == undefined || blocklist == null)  
      return blocklist;
    let filtering : Array<string> = [];
    blocklist.forEach(element => {
      if (element.user1_username == data.username)
      filtering.push(element.user2_username);
      else
        filtering.push(element.user1_username);
    });
    let messages = await this.MessagesRepo.find({where: {chat_id: data.id, username: Not(Any(filtering))}});
    // messages.sort((a, b) => a.time > b.time ? a : b); // I shouls sort with date
    return messages;
  }

  async CreateChannel(data: CreateChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username}}) == null)
      return undefined;
    const chatBase = await this.ChatRepo.save({name: data.name, type: data.type, password: data.password});
    await this.MembersRepo.save({chatID: chatBase.id, username: data.username, role: "owner", state: true});
    return chatBase;
  }

  async RemoveChannel(data: ChatPrimariesDto)
  {
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username}});
    if (member == null)
      return undefined;
    else if (member[0].role != 'owner')
      return undefined;
    return await this.ChatRepo.delete({id: data.id});
  }

  async UpdateChannelName(data : UpdateChatDto)
  {
    const member = await this.MembersRepo.find({where: {chatID: data.chat.id, username: data.chat.username}});
    if (member == null)
      return undefined;
    else if (member[0].role != 'owner' && member[0].role != 'admin')
      return undefined;
    const obj = await this.ChatRepo.findOneBy({id: data.chat.id});
    if (obj == null)
      return undefined;
    obj.name = data.data.name;
    console.log("--------- Obj -------------");
    console.log(obj);
    console.log("---------------------------");
    return this.ChatRepo.save(obj);
  }

  async UpdateChannelPrivacy(data : UpdateChatDto)
  {
    const member = await this.MembersRepo.find({where: {chatID: data.chat.id, username: data.chat.username}});
    if (member == null)
      return undefined;
    else if (member[0].role != 'owner' && member[0].role != 'admin')
      return undefined;
    const obj = await this.ChatRepo.findOneBy({id: data.chat.id});
    if (obj == null)
      return undefined;
    if (obj.type == data.data.type)
      return undefined;
    if (data.data.type == 'protected' && data.data.password.length == 0)
      return undefined;
    obj.type = data.data.type;
    console.log("--------- Obj -------------");
    console.log(obj);
    console.log("---------------------------");
    return this.ChatRepo.save(obj);
  }

  async UpdateChannelPassword(data : UpdateChatDto)
  {
    const member = await this.MembersRepo.find({where: {chatID: data.chat.id, username: data.chat.username}});
    if (member == null)
      return undefined;
    else if (member[0].role != 'owner')
      return undefined;
    const obj = await this.ChatRepo.findOneBy({id: data.chat.id});
    if (obj == null || obj.type != 'protected')
      return undefined;
    if (obj.password == data.data.password) 
      return undefined;
    obj.password = data.data.password; // I'm not sure if I have to use let -=> So to test
    console.log("--------- Obj -------------");
    console.log(obj);
    console.log("---------------------------");
    return this.ChatRepo.save(obj);
  }

  async GetIntoChannel(data: ChatintochanellsDto) // same as add members the only diff is in the parameters passed by controlers
  {
    const chat = await this.ChatRepo.find({where: {id: data.id}});
    if (await this.UserRepo.find({where: {username: data.username}}) == null || chat == null)
      return undefined;
    if (chat[0].type == 'protected' && (data.password == undefined || data.password != chat[0].password))
      return undefined;
    return await this.MembersRepo.save({chatID: chat[0].id, username: data.username, role: 'member', state: true});
  }

  async GetOutChannel(data: ChatPrimariesDto)
  {
    if (await this.UserRepo.find({where: {username: data.username}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
      return undefined;
    const id = {username: data.username, id: data.id}; // I'm not sure
    
    return this.MembersRepo.delete(id);
    // return this.ChatRepo.delete({id: {id: data.id, username: data.username}});
  }

  async GetMembers(data: ChatPrimariesDto)
  {
    if (await this.UserRepo.find({where: {username: data.username}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
      return undefined;
    const blocklist = await this.Friendship.blocklist({Userone: data.username}) as Friendship[];
    if (blocklist == undefined || blocklist == null)  
      return blocklist;
    let filtering : Array<string> = [];
    blocklist.forEach(element => {
      if (element.user1_username == data.username)
      filtering.push(element.user2_username);
      else
        filtering.push(element.user1_username);
    });
    return await this.MembersRepo.find({where: {chatID: data.id, username: Not(Any(filtering))}});
  }

  async MarkasAdmin(data : OperatingChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username_doing}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
      return undefined;
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    const membertochange = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    if (member == null)
      return null;
    if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner')
    {
      membertochange[0].role = 'admin';
      return this.MembersRepo.save(membertochange[0]);
    }
    return null;
  }

  async exemptAdmin(data : OperatingChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username_doing}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
      return undefined;
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    const membertochange = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    if (member == null)
      return null;
    if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner')
    {
      membertochange[0].role = 'member';
      return this.MembersRepo.save(membertochange[0]);
    }
    return null;
  }

  async BlockMember(data : OperatingChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username_doing}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
      return undefined;
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    const membertochange = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    if (member == null)
      return null;
    if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner')
    {
      membertochange[0].state = false;
      return this.MembersRepo.save(membertochange[0]);
    }
    return null;
  }

  async MuteMember(data : OperatingMuteChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username_doing}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
    return undefined;
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    const membertochange = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    if (member == null)
      return null;
    if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner')
    {
      const time_now = new Date();
      const time_expected = new Date();
      time_expected.setHours(time_now.getHours() + data.time);
      return await this.MembersRepo.save({chatID: membertochange[0].chatID, mute: time_expected.toISOString()});
    }
    return null;
  }

  async KickMember(data : OperatingChatDto)
  {
    if (await this.UserRepo.find({where: {username: data.username_doing}}) == null || await this.ChatRepo.find({where: {id: data.id}}) == null)
    return undefined;
    const member = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    const membertochange = await this.MembersRepo.find({where: {chatID: data.id, username: data.username_doing}});
    if (member == null)
      return null;
    if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner')
    {
      return await this.GetOutChannel({username: data.username_target, id: data.id});
    }
    return null;
  }

  // async findProtectedgroup(data: ChatPrimariesDto) 
  // {
    
  // }
}
