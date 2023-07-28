import { Inject, Injectable } from '@nestjs/common';
// import { ChatPrimariesDto, ChatRecieveMSGDto, ChatintochanellsDto, CreateChatDto, OperatingChatDto, OperatingMuteChatDto, UpdateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
// import { Any, Not, Repository } from 'typeorm';
import { Members } from './entities/membership.entity';
import { Messages } from './entities/Messages.entity';
import { User } from 'src/user/entities/user.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Repository } from 'typeorm';
import { CreateMessage } from './dto/CreateMessage.dto';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UpdateChatroomDTO } from './dto/updateChatroom.dto';

// import { Friendship } from 'src/friendship/entities/friendship.entity';
// import { CreateMessage } from './dto/CreateMessage.dto';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private readonly ChatRepo: Repository<Chat>,
    @InjectRepository(Members) private readonly MembersRepo: Repository<Members>,
    @InjectRepository(Messages) private readonly MessagesRepo: Repository<Messages>,
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    private readonly Friendship: FriendshipService,
    private readonly users: UserService) { }

  async getChatRoomOfUsers(userId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type != :type AND Members.state = :active", { userId, type: 'direct', active: 1 }).getMany();
    return rooms;
  }

  async findDMChatrooms(userId: number) {
    const roomsIds = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type = :type", { userId, type: 'direct' }).getRawMany()
    if (!roomsIds || roomsIds.length == 0)
      return [];
    console.log(roomsIds)
    const ret = roomsIds.map((item) => { return item.chatID_id })
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: userId }).getMany()
    console.log(rooms)
    return rooms;
  }
  async findDMChatroomId(user1: number, user2: number) {
    const room = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :user1 AND chatID.type = :type", { user1, type: 'direct' }).getRawMany();
    if (!room || room.length == 0)
      return -1;
    const ret = room.map((item) => { return item.chatID_id })
    if (user1 == user2) {
      const roomDM = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid")
        .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: user2 }).getRawMany();
      const ret_: any[] = roomDM.map((item) => { return item.chatID_id })
      const newf = ret.filter((item) => { return !ret_.find((itm) => item == itm) })
      if (newf.length == 0)
        return -1;
      return newf[0];
    }
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :user1 AND chatID.id IN (:...ids)", { user1: user2, ids: ret }).getOne();
    console.log('found chat', rooms);
    if (rooms)
      return rooms.chat.id;
    return -1;
  }
  validateChatName(chatRoomName: string): boolean {
    if (chatRoomName == null || !(chatRoomName && chatRoomName.trim())) {
      return false;
    }
    return true;
  }

  validateChatType(chatRoomType: string): boolean {
    switch (chatRoomType) {
      case 'public':
        return true;
      case 'protected':
        return true;
      case 'private':
        return true;
      case 'DM':
        return true;
      default:
        return false
    }
  }

  validateChatPassword(ChatroomPassword: string): boolean {
    if (!(ChatroomPassword && ChatroomPassword.trim())) {
      return false;
    }
    return true;
  }


  validateChatDTO(chatDTO: createChatroomDTO): boolean {
    return this.validateChatName(chatDTO.chatroomName) && this.validateChatType(chatDTO.type)
      && chatDTO.type == 'protected' ? this.validateChatPassword(chatDTO.password) : true;
  }
  async isMemberbyName(userId: number, channelName: string) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.name = :channelId AND Members.state = :active AND Userid.id = :userId", { type: 'direct', channelId: channelName, active: 1, userId })
      .getMany();
    return rooms;
  }

  async JoinChatroom(userId: number, chatroomDTO: createChatroomDTO) {
    if ((await this.isMemberbyName(userId, chatroomDTO.chatroomName)).length)
      return {};
    const room = await this.ChatRepo.createQueryBuilder('chat').where("chat.name = :name", { name: chatroomDTO.chatroomName }).getOne();
    if (!room)
      return {};
    const findUser = await this.users.findOne(userId);
    if (!findUser)
      return {};
    if (room.type == 'protected') {
      if (await bcrypt.compare(chatroomDTO.password, room.password) == false)
        return {}
      return this.MembersRepo.save({ chatID: room.id, role: 'none', state: 1, Userid: userId, });
    }
    return this.MembersRepo.save({ chatID: room.id, role: 'none', state: 1, Userid: userId, });
  }

  async createChatroom(userId: number, chatroomDTO: createChatroomDTO) {
    if (!this.validateChatDTO(chatroomDTO))
      return undefined;
    if (chatroomDTO.type == 'DM') {
      chatroomDTO.type = 'direct';
      const user = await this.users.findOne(parseInt(chatroomDTO.chatroomName));
      if (!user)
        return undefined;
    }
    if (chatroomDTO.type === 'protected') {
      console.log("welcome!")
      const passwordHash = await bcrypt.hash(chatroomDTO.password, 10);
      chatroomDTO.password = passwordHash;
    }
    let room: any;
    if (chatroomDTO.type == 'direct')
      room = await this.ChatRepo.save({ type: chatroomDTO.type, password: chatroomDTO.password, });
    else
      room = await this.ChatRepo.save({ name: chatroomDTO.chatroomName, type: chatroomDTO.type, password: chatroomDTO.password, });
    if (chatroomDTO.type == 'direct')
      await this.MembersRepo.save({ chatID: room.id, Userid: userId, role: 'none', state: 1 })
    else
      await this.MembersRepo.save({ chatID: room.id, Userid: userId, role: 'owner', state: 1 })

    console.log("--room---")
    console.log(room)
    if (chatroomDTO.type == 'direct' && userId != parseInt(chatroomDTO.chatroomName))
      await this.MembersRepo.save({ chatID: room.id, Userid: parseInt(chatroomDTO.chatroomName), role: 'none', state: 1 })
    return room;
  }

  async GetChatRoomByID_(id: number) {
    const counter = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id = :id", { id }).getCount();
    return { rooms: await this.GetChatRoomByID(id), count: counter }
  }
  async GetChatRoomByID(id: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id = :id", { id }).getOne();
    console.log('GetChatRoomByID', rooms);
    return rooms;
  }

  async postToDms(messageDTO: CreateMessage, id: number) {
    const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
    if (!chatRoom)
      return {}
    return await this.MessagesRepo.save({ sender: id, chat_id: chatRoom.chat.id, time: (new Date()).toISOString(), content: messageDTO.value });
  }

  async postToDM(messageDTO: CreateMessage, current: number) {
    const channelId = await this.findDMChatroomId(messageDTO.charRoomId, current);
    if (channelId < 0) {
      const chatroom = await this.createChatroom(current, { type: 'DM', chatroomName: messageDTO.charRoomId.toString(), password: '' })
      return await this.postToDms({ charRoomId: chatroom.id, value: messageDTO.value }, current);
    }
    return await this.postToDms({ charRoomId: channelId, value: messageDTO.value }, current);
  }

  async findDMChatroom(user1: number, user2: number) {
    const roomsIds = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type = :type", { userId: user1, type: 'direct' }).getRawMany()
    if (!roomsIds || roomsIds.length == 0)
      return []
    const ret: any[] = roomsIds.map((item) => { return item.chatID_id })
    if (user1 == user2) {
      const roomDM = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid")
        .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: user2 }).getRawMany();
      const ret_: any[] = roomDM.map((item) => { return item.chatID_id })
      const newf = ret.filter((item) => { return !ret_.find((itm) => item == itm) })
      if (newf.length == 0)
        return [];
      return await this.MessagesRepo.createQueryBuilder("messages").leftJoinAndSelect('messages.chat_id', 'chat')
        .leftJoinAndSelect('messages.sender', 'user')
        .where("chat.id = :chatID", { chatID: newf[0] }).getMany();
    }
    const roomDM = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id IN (:...ids) AND Userid.id = :Userid", { ids: ret, Userid: user2 }).getOne()
    if (!roomDM)
      return []
    const messages = await this.MessagesRepo.createQueryBuilder("messages").leftJoinAndSelect('messages.chat_id', 'chat')
      .leftJoinAndSelect('messages.sender', 'user')
      .where("chat.id = :chatID", { chatID: roomDM.chat.id }).getMany();
    return messages;

  }
  async isMember(userId: number, channelId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.id = :channelId AND Members.state = :active AND Userid.id = :userId", { type: 'direct', channelId: channelId, active: 1, userId })
      .getMany();
    return rooms;
  }
  async MyOwnRole(userId: number, channelId: number) {
    if (!(await this.isMember(userId, channelId)).length)
      return [];
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.id = :channelId AND Userid.id = :id", { type: 'direct', channelId: channelId, id: userId })
      .getOne();
    // console.log('1312', rooms)
    return rooms;
  }
  async getChatRoomMembers(userId: number, channelId: number) {
    if (!(await this.isMember(userId, channelId)).length)
      return [];
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.id = :channelId", { type: 'direct', channelId: channelId, })
      .getMany();
    console.log("Room's Memebers", rooms)
    return rooms;
  }
  async getMessagesByChatID(userId: number, channelId: number) {
    if (await this.isMember(userId, channelId)) {
      return await this.MessagesRepo.createQueryBuilder("messages").leftJoinAndSelect('messages.chat_id', 'chat')
        .leftJoinAndSelect('messages.sender', 'user').where("chat.id = :channelId", { channelId }).orderBy('messages.time', 'DESC').getMany();
    }
    return {};
  }

  async isMod(userId: number, channelId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type != :type AND chatID.id = :channelId AND Members.state = :active AND Members.role != :role", { userId, type: 'direct', channelId, active: 1, role: 'none' }).getOne();
    return rooms;
  }

  async updateChatroom(
    chatID: number,
    adminName: number,
    updateDTO: UpdateChatroomDTO,
  ) {
    let chatroom = await this.isMod(adminName, chatID);
    if (!chatroom)
      return undefined;
    if (updateDTO.newChatroomName) {
      chatroom.chat.name = updateDTO.newChatroomName;
    }
    if (updateDTO.newType) {
      if (updateDTO.newType != 'DM')
        chatroom.chat.type = updateDTO.newType;
      else
        chatroom.chat.type = 'direct';
      if (updateDTO.newType === 'protected') {
        const passwordHash = await bcrypt.hash(updateDTO.newPassword, 10);
        chatroom.chat.password = passwordHash;
      }
    }
    return await this.ChatRepo.save(chatroom.chat);
  }

  async postToChatroom(messageDTO: CreateMessage, id: number) { // TODO: throw's exeptions -
    if (!(await this.isMember(id, messageDTO.charRoomId)))
      return {}
    console.log(messageDTO)
    return await this.MessagesRepo.save({ content: messageDTO.value, sender: id, time: (new Date()).toISOString(), chat_id: messageDTO.charRoomId })
  }

  async sendAnInvite(channelId: number, currentUser: number, theInvitedOne: number) {
    if (!(await this.isMember(currentUser, channelId)) || (await this.isMember(theInvitedOne, channelId)))
      return {}
    return await this.MembersRepo.save({ chatID: channelId, role: 'none', Userid: theInvitedOne, state: 2, });
  }

  async checkInviteExists(channelId: number, currentUser: number) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.id = :channelId AND chatID.type != :type AND Members.state = :active",
        { userId: currentUser, type: 'direct', channelId, active: 2 }).getOne();
  }

  async AcceptAnInvite(channelId: number, currentUser: number) {
    if (await this.checkInviteExists(channelId, currentUser))
      return await this.MembersRepo.save({ chatID: channelId, Userid: currentUser, state: 0, });
    return {};
  }

  async DeleteAnInvite(channelId: number, currentUser: number) {
    if (await this.checkInviteExists(channelId, currentUser))
      return await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
    return {};
  }

  async getInvites(id: number) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type != :type AND Members.state = :active",
        { userId: id, type: 'direct', active: 2, }).getMany();
  }

  async checkforRole(channelId: number, currentUser: number, role: any[]) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.id = :channelId AND chatID.type != :type AND Members.state = :active AND Members.role IN (:...roles)",
        { userId: currentUser, type: 'direct', channelId, active: 1, roles: role }).getOne();
  }

  async kickUser(channelId: number, currentUser: number, theOneToKick: number) {
    if (!(await this.checkforRole(channelId, currentUser, ['owner', 'admin'])) || !(await this.checkforRole(channelId, currentUser, ['admin', 'none'])))
      return {}
    return await this.MembersRepo.delete({ chatID: channelId, Userid: theOneToKick, });
  }
  async LeaveChannel(channelId: number, currentUser: number) {
    if (await this.checkforRole(channelId, currentUser, ['admin', 'none']))
      return await this.kickUser(channelId, currentUser, currentUser)
    if (await this.checkforRole(channelId, currentUser, ['owner'])) {
      let nextOwner = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid").where("chatID.id = :channelId AND Members.role = :admin AND Members.state = :active", { channelId: channelId, admin: 'admin', active: 1 }).getOne();
      if (!nextOwner)
        nextOwner = await this.MembersRepo.createQueryBuilder('Members')
          .leftJoinAndSelect("Members.chat", "chatID")
          .leftJoinAndSelect("Members.user", "Userid").where("chatID.id = :channelId AND Members.role = :admin AND Members.state = :active", { channelId: channelId, admin: 'none', active: 1 }).getOne();
      if (nextOwner) {
        await this.MembersRepo.save({ chatID: channelId, Userid: nextOwner.Userid, role: 'owner', state: 1 })
        return await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
      }
      await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
      await this.MessagesRepo.delete({ chat_id: channelId, });
      return await this.ChatRepo.delete({ id: channelId });
    }
  }
  // async findDMChatroomId(user1 : number, user2: number)
  // {
  // const chatroom = await this.ChatRepo.createQueryBuilder('chats').
  // leftJoinAndSelect("Members","chats.")
  // return -1;
  // }
  /*
  if (await this.UserRepo.find({where: {username: data.data1.username}}) == null
        || await this.ChatRepo.find({where: {id: data.data1.id}}) == null
        || 
*/
  // async postToDM(messageDTO: CreateMessage, current: number) {
  // const channelId = await this.findDMChatroomId(messageDTO.charRoomId, current);
  // let chatroom: any = [];
  // if (channelId < 0) {
  // chatroom = await this.createChatroom(current, { type: 'DM', chatroomName: 'abc', password: '' })
  //   if (chatroom)
  //     await this.addMemberToChatroom(chatroom.id, { member: messageDTO.charRoomId, password: '' });
  //   return await this.postToDms({ charRoomId: chatroom.id, value: messageDTO.value }, current);
  // }
  //   return await this.postToDms({ charRoomId: channelId, value: messageDTO.value }, current);

  // }
  // // async SendMessage(data: ChatRecieveMSGDto) {
  // //   if (await this.MembersRepo.find({ where: { chatID: data.data1.id, username: data.data1.username } }))
  // //     return undefined;
  // //   const time = new Date();
  // //   return await this.MessagesRepo.save({ chat_id: data.data1.id, username: data.data1.username, content: data.data2.messaegbody, time: time.toISOString() });
  // // }

  // async LoadMessages(data: ChatPrimariesDto) {
  //   const blocklist = await this.Friendship.blocklist({ Userone: data.username }, 0, 0) as Friendship[];
  //   if (blocklist == undefined || blocklist == null)
  //     return blocklist;
  //   let filtering: Array<string> = [];
  //   blocklist.forEach(element => {
  //     if (element.user1_username == data.username)
  //       filtering.push(element.user2_username);
  //     else
  //       filtering.push(element.user1_username);
  //   });
  //   let messages = await this.MessagesRepo.find({ where: { chat_id: data.id, username: Not(Any(filtering)) } });
  //   // messages.sort((a, b) => a.time > b.time ? a : b); // I shouls sort with date
  //   return messages;
  // }

  // async CreateChannel(data: CreateChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username } }) == null)
  //     return undefined;
  //   const chatBase = await this.ChatRepo.save({ name: data.name, type: data.type, password: data.password });
  //   await this.MembersRepo.save({ chatID: chatBase.id, username: data.username, role: "owner", state: true });
  //   return chatBase;
  // }

  // async RemoveChannel(data: ChatPrimariesDto) {
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username } });
  //   if (member == null)
  //     return undefined;
  //   else if (member[0].role != 'owner')
  //     return undefined;
  //   return await this.ChatRepo.delete({ id: data.id });
  // }

  // async UpdateChannelName(data: UpdateChatDto) {
  //   const member = await this.MembersRepo.find({ where: { chatID: data.chat.id, username: data.chat.username } });
  //   if (member == null)
  //     return undefined;
  //   else if (member[0].role != 'owner' && member[0].role != 'admin')
  //     return undefined;
  //   const obj = await this.ChatRepo.findOneBy({ id: data.chat.id });
  //   if (obj == null)
  //     return undefined;
  //   obj.name = data.data.name;
  //   console.log("--------- Obj -------------");
  //   console.log(obj);
  //   console.log("---------------------------");
  //   return this.ChatRepo.save(obj);
  // }

  // async UpdateChannelPrivacy(data: UpdateChatDto) {
  //   const member = await this.MembersRepo.find({ where: { chatID: data.chat.id, username: data.chat.username } });
  //   if (member == null)
  //     return undefined;
  //   else if (member[0].role != 'owner' && member[0].role != 'admin')
  //     return undefined;
  //   const obj = await this.ChatRepo.findOneBy({ id: data.chat.id });
  //   if (obj == null)
  //     return undefined;
  //   if (obj.type == data.data.type)
  //     return undefined;
  //   if (data.data.type == 'protected' && data.data.password.length == 0)
  //     return undefined;
  //   obj.type = data.data.type;
  //   console.log("--------- Obj -------------");
  //   console.log(obj);
  //   console.log("---------------------------");
  //   return this.ChatRepo.save(obj);
  // }

  // async UpdateChannelPassword(data: UpdateChatDto) {
  //   const member = await this.MembersRepo.find({ where: { chatID: data.chat.id, username: data.chat.username } });
  //   if (member == null)
  //     return undefined;
  //   else if (member[0].role != 'owner')
  //     return undefined;
  //   const obj = await this.ChatRepo.findOneBy({ id: data.chat.id });
  //   if (obj == null || obj.type != 'protected')
  //     return undefined;
  //   if (obj.password == data.data.password)
  //     return undefined;
  //   obj.password = data.data.password; // I'm not sure if I have to use let -=> So to test
  //   console.log("--------- Obj -------------");
  //   console.log(obj);
  //   console.log("---------------------------");
  //   return this.ChatRepo.save(obj);
  // }

  // async GetIntoChannel(data: ChatintochanellsDto) // same as add members the only diff is in the parameters passed by controlers
  // {
  //   const chat = await this.ChatRepo.find({ where: { id: data.id } });
  //   if (await this.UserRepo.find({ where: { username: data.username } }) == null || chat == null)
  //     return undefined;
  //   if (chat[0].type == 'protected' && (data.password == undefined || data.password != chat[0].password))
  //     return undefined;
  //   return await this.MembersRepo.save({ chatID: chat[0].id, username: data.username, role: 'member', state: true });
  // }

  // async GetOutChannel(data: ChatPrimariesDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const id = { username: data.username, id: data.id }; // I'm not sure

  //   return this.MembersRepo.delete(id);
  //   // return this.ChatRepo.delete({id: {id: data.id, username: data.username}});
  // }

  // async GetMembers(data: ChatPrimariesDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const blocklist = await this.Friendship.blocklist({ Userone: data.username }) as Friendship[];
  //   if (blocklist == undefined || blocklist == null)
  //     return blocklist;
  //   let filtering: Array<string> = [];
  //   blocklist.forEach(element => {
  //     if (element.user1_username == data.username)
  //       filtering.push(element.user2_username);
  //     else
  //       filtering.push(element.user1_username);
  //   });
  //   return await this.MembersRepo.find({ where: { chatID: data.id, username: Not(Any(filtering)) } });
  // }

  // async MarkasAdmin(data: OperatingChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username_doing } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   const membertochange = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   if (member == null)
  //     return null;
  //   if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner') {
  //     membertochange[0].role = 'admin';
  //     return this.MembersRepo.save(membertochange[0]);
  //   }
  //   return null;
  // }

  // async exemptAdmin(data: OperatingChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username_doing } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   const membertochange = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   if (member == null)
  //     return null;
  //   if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner') {
  //     membertochange[0].role = 'member';
  //     return this.MembersRepo.save(membertochange[0]);
  //   }
  //   return null;
  // }

  // async BlockMember(data: OperatingChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username_doing } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   const membertochange = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   if (member == null)
  //     return null;
  //   if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner') {
  //     membertochange[0].state = false;
  //     return this.MembersRepo.save(membertochange[0]);
  //   }
  //   return null;
  // }

  // async MuteMember(data: OperatingMuteChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username_doing } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   const membertochange = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   if (member == null)
  //     return null;
  //   if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner') {
  //     const time_now = new Date();
  //     const time_expected = new Date();
  //     time_expected.setHours(time_now.getHours() + data.time);
  //     return await this.MembersRepo.save({ chatID: membertochange[0].chatID, mute: time_expected.toISOString() });
  //   }
  //   return null;
  // }

  // async KickMember(data: OperatingChatDto) {
  //   if (await this.UserRepo.find({ where: { username: data.username_doing } }) == null || await this.ChatRepo.find({ where: { id: data.id } }) == null)
  //     return undefined;
  //   const member = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   const membertochange = await this.MembersRepo.find({ where: { chatID: data.id, username: data.username_doing } });
  //   if (member == null)
  //     return null;
  //   if ((member[0].role == 'owner' || member[0].role == 'admin') && membertochange[0].role != 'owner') {
  //     return await this.GetOutChannel({ username: data.username_target, id: data.id });
  //   }
  //   return null;
  // }

  // async findProtectedgroup(data: ChatPrimariesDto) 
  // {

  // }
}

  // import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
  // import { InjectRepository } from '@nestjs/typeorm';
  // import { Not, Repository } from 'typeorm';
  // import { Chat } from './entities/chat.entity';
  // // import { CreateMessage } from 'src/message/dto/message.dto';
  // // import { Message } from 'src/message/message.entity';
  // import { ChatUtils } from './chat.utils';
  // import { MessageService } from 'src/message/message.service';
  // import { createChatroomDTO } from './dto/createChatroom.dto';
  // import {
  //   validateChatDTO,
  //   createChatroomEntity,
  //   deleteUser,
  //   removeAdminStatus,
  // } from './chat.validators';
  // // import { User } from 'src/user/user.entity';
  // import * as bcrypt from 'bcrypt';
  // import { createMemberDTO } from './dto/createMember.dto';
  // import { createAdminDTO } from './dto/createAdmin.dto';
  // import { SwapOwnerDTO } from './dto/SwapOwner.dto';
  // import { UpdateChatroomDTO } from './dto/updateChatroom.dto';
  // // import { PunishmentService } from './punishment/punishment.service';
  // // import { Punishment } from './punishment/punishment.entity';
  // // import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';
  // import { triggerAsyncId } from 'async_hooks';
  // import { User } from 'src/user/entities/user.entity';
  // import { map } from 'rxjs';
  // import { Messages } from './entities/Messages.entity';
  // export type UserInfo = {
  //   role: string;
  //   userID: User;
  //   chatID: number;
  // };

  // @Injectable()
  // export class ChatService {
  //   constructor(
  //     @InjectRepository(Chat)
  //     private readonly chatRoomRepo: Repository<Chat>,
  //     @InjectRepository(Messages)
  //     private readonly messageRepo: Repository<Messages>,
  //     // private readonly MessgafRoomRepo: Repository<Chat>,
  //     // private readonly chatPunishment: PunishmentService,
  //     private readonly chatHelpers: ChatUtils,
  //     private readonly messageService: MessageService,
  //   ) { }

  //   async getChatRoomOfUsers(id: number) {

  //     const result = (await this.getChatRoomOfUsersANDRooles(id)).chatrooms;
  //     if (result && Array.isArray(result))
  //       return result;
  //     return []
  //   }
  //   async getChatRoomOfUsersANDRooles(id: number): Promise<{
  //     userInfo: UserInfo[][];
  //     chatrooms: Chat[];
  //   }> {
  //     let chatrooms = await this.chatRoomRepo.find({
  //       order: {
  //         id: 'desc',
  //       },
  //       relations: {
  //         owner: true,
  //         member: true,
  //         admin: true,
  //         message: {
  //           userId: true,
  //         },
  //       },
  //       where: {
  //         type: Not('DM'),
  //         member: {
  //           id: id,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         chatRoomName: true,
  //         type: true,
  //         owner: {
  //           id: true,
  //           username: true,
  //           avatar: true,
  //           name: true
  //         },
  //         member: {
  //           id: true,
  //           username: true,
  //           avatar: true,
  //           name: true
  //         },
  //         message: {
  //           value: true,
  //           id: true,
  //         },
  //       },
  //       cache: true,
  //     });
  //     for (const chat of chatrooms) {
  //       if (!chat.member.some((u) => u.id === id)) {
  //         chatrooms = chatrooms.filter((ID) => ID.id !== chat.id);
  //       }
  //     }
  //     const userInfo: UserInfo[][] = [];
  //     for (let i = 0; i < chatrooms.length; i++) {
  //       const chatroomUsers: UserInfo[] = [];
  //       for (let j = 0; j < chatrooms[i].member.length; j++) {
  //         let user = chatrooms[i].member[j].id;
  //         let role;
  //         if (user === chatrooms[i].owner.id) {
  //           role = 'owner';
  //         } else if (chatrooms[i].admin.findIndex((u) => u.id === user) != -1) {
  //           role = 'admin';
  //         } else {
  //           role = 'member';
  //         }
  //         const tmp: UserInfo = {
  //           chatID: chatrooms[i].id,
  //           role: role,
  //           userID: chatrooms[i].member[j],
  //         };
  //         chatroomUsers.push(tmp);
  //       }
  //       userInfo.push(chatroomUsers);
  //     }
  //     return { userInfo, chatrooms };
  //   }
  //   // async getChatRoomOfUsers(id: number) {
  //   //   const chatroom = await this.chatRoomRepo.find({
  //   //     order: {
  //   //       id: 'desc',
  //   //     },
  //   //     relations: {
  //   //       owner: true,
  //   //       member: true,
  //   //       admin: true,
  //   //       message: {
  //   //         userId: true,
  //   //       },
  //   //     },
  //   //     where: [
  //   //       {
  //   //         member: {
  //   //           id: id,
  //   //         },
  //   //         type: 'public'
  //   //       },
  //   //       {
  //   //         member: {
  //   //           id: id,
  //   //         },
  //   //         type: 'private'
  //   //       },
  //   //       {
  //   //         member: {
  //   //           id: id,
  //   //         },
  //   //         type: 'password'
  //   //       }
  //   //     ],
  //   //     select: {
  //   //       id: true,
  //   //       chatRoomName: true,
  //   //       type: true,
  //   //       owner: {
  //   //         id: true,
  //   //         username: true,
  //   //         avatar: true,
  //   //       },
  //   //       member: {
  //   //         id: true,
  //   //         username: true,
  //   //         avatar: true,
  //   //       },
  //   //       message: {
  //   //         value: true,
  //   //         id: true,
  //   //       },
  //   //     },
  //   //     //cache: true,
  //   //   });
  //   //   return chatroom;
  //   // }

  //   async GetChatRoomByID(id: number) {
  //     const chatRoom = await this.chatRoomRepo.findOne({
  //       where: {
  //         id: id,
  //       },
  //       select: {
  //         id: true,
  //         chatRoomName: true,
  //         type: true,
  //         owner: {
  //           id: true,
  //           username: true,
  //           avatar: true,
  //         },
  //         member: {
  //           id: true,
  //           username: true,
  //           avatar: true,
  //         },
  //         admin: {
  //           id: true,
  //           username: true,
  //           avatar: true,
  //         },
  //       },
  //       relations: {
  //         message: true,
  //         owner: true,
  //         admin: true,
  //         member: true,
  //       },
  //     });
  //     if (chatRoom) return chatRoom;
  //     throw new HttpException('ChatRoom Not Found', HttpStatus.NOT_FOUND);
  //   }

  //   async createChatroom(userId: number, chatroomDTO: createChatroomDTO) {
  //     if (validateChatDTO(chatroomDTO) === true) {
  //       const user = await this.chatHelpers.getUser(userId);
  //       let secondUser: User | undefined = undefined;
  //       // if (chatroomDTO.otherUser !== '') {
  //       //   console.log('here', chatroomDTO.otherUser);
  //       //   secondUser = await this.chatHelpers.getUser(chatroomDTO.otherUser);
  //       // }
  //       if (chatroomDTO.type === 'password') {
  //         const passwordHash = await bcrypt.hash(chatroomDTO.password, 10);
  //         chatroomDTO.password = passwordHash;
  //       }
  //       const chatroom = createChatroomEntity(chatroomDTO, user, secondUser);
  //       const newChatroom = this.chatRoomRepo.create(chatroom);
  //       return await this.chatRoomRepo.save(newChatroom);
  //     }
  //     throw new HttpException("Can't create Chatroom!", HttpStatus.BAD_REQUEST);
  //   }

  //   async findDMChatroomId(user1: number, user2: number) {
  //     let user1ListOfChatrooms = await this.findDMChatroomsANDmsgs(user1);
  //     let chatId: number = -1;
  //     user1ListOfChatrooms.filter((item: Chat) => {
  //       if ((item.member.length == 1 && user1 == user2) || (user2 != user1 && item.member.length == 2 && (item.member[1].id == user2 || item.member[0].id == user2)))
  //         chatId = item.id;
  //     })
  //     return chatId;
  //   }

  //   async getChatRoomMembers(userId: number, channelId: number) {
  //     return (await this.getChatRoomOfUsersANDRooles(userId)).userInfo.find((chat) => { return chat.find((item) => { return item.chatID == channelId }) })
  //   }

  //   async postToDM(messageDTO: CreateMessage, current: number) {
  //     const channelId = await this.findDMChatroomId(messageDTO.charRoomId, current);
  //     let chatroom: any = [];
  //     if (channelId < 0) {
  //       chatroom = await this.createChatroom(current, { type: 'DM', chatroomName: 'abc', password: '' })
  //       if (chatroom)
  //         await this.addMemberToChatroom(chatroom.id, { member: messageDTO.charRoomId, password: '' });
  //       return await this.postToDms({ charRoomId: chatroom.id, value: messageDTO.value }, current);
  //     }
  //     return await this.postToDms({ charRoomId: channelId, value: messageDTO.value }, current);

  //   }

  //   async betweenDMAndChannel(id: number, id2: number) {
  //     const replaying = await this.chatRoomRepo
  //       .createQueryBuilder('chats').leftJoinAndSelect('chats.member', 'members').leftJoinAndSelect('chats.message', 'messages')
  //       .where('members.id = :Userid AND members.id = :Userid1 AND chats.type = :type', { Userid: id, Userid1: id2, type: 'DM' }).getMany();
  //     return replaying;
  //   }

  //   async betweenDM(id: number, id2: number) {
  //     // console.log("JE RE")
  //     // let replaying = await this.chatRoomRepo
  //     //   .createQueryBuilder('chats').leftJoinAndSelect('chats.member', 'members').leftJoinAndSelect('chats.message', 'messages').leftJoinAndSelect('messages.userId', 'Theuser').groupBy('chats.id, members.id, messages.messageID, Theuser.id').where('members.id = ANY(:Ids) AND chats.type = :type', { Ids: [id, id2], type: 'DM' }).getMany();
  //     // // .where('members.id = :Userid AND members.id = :Userid1 AND chats.type = :type', { Userid: id, Userid1: id2, type: 'DM' }).getOne();
  //     // console.log(replaying)
  //     // replaying.map((chat) => {
  //     //   console.log(chat)
  //     // })
  //     // return replaying[0].message
  //     // findDMChatrooms(id)
  //   }


  //   async postToDms(messageDTO: CreateMessage, id: number) {
  //     const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
  //     if (!chatRoom)
  //       return {}
  //     const user = await this.chatHelpers.getUser(id);
  //     if (!user)
  //       return {}
  //     const newMessage = new Message();
  //     newMessage.chatRoomId = chatRoom;
  //     newMessage.value = messageDTO.value;
  //     newMessage.userId = user;
  //     return await this.messageRepo.save(newMessage)
  //   }

  //   async findDM(id: number) {
  //     return await this.chatRoomRepo.find({
  //       relations: {
  //         member: true,
  //       },
  //       where: {
  //         type: 'DM',
  //         member: {
  //           id: id,
  //         },
  //       },
  //       select: {
  //         member: {
  //           avatar: true,
  //           id: true,
  //           name: true,
  //         },
  //       },
  //     });
  //   }
  //   async postToChatroom(messageDTO: CreateMessage, id: number) { // TODO: throw's exeptions -
  //     this.chatPunishment.clearOldPunishments();
  //     if (
  //       (await this.chatHelpers.checkForMemberRoll(
  //         messageDTO.charRoomId,
  //         id,
  //       )) == true &&
  //       (await this.chatPunishment.isMutedInChatroom(
  //         messageDTO.charRoomId,
  //         id,
  //       )) == false
  //     ) {
  //       const chatRoom = await this.GetChatRoomByID(messageDTO.charRoomId);
  //       const user = await this.chatHelpers.getUser(id);
  //       return await this.messageService.create(messageDTO, chatRoom, user);
  //     }
  //     return {}
  //   }

  //   // async findDMChatrooms(id: number) {
  //   // console.log('                    -chatDms                               ')
  //   // let data: Array<any> = [];
  //   // const chatDms = await this.chatRoomRepo
  //   //   .createQueryBuilder('chats').leftJoinAndSelect('chats.member', 'members').leftJoinAndSelect('chats.message', 'messages').leftJoinAndSelect('messages.userId', 'Theuser').getMany()
  //   // console.log(chatDms)
  //   // chatDms.map((item) => {
  //   //   if (item.type == 'DM') {
  //   //     if (item.member.length == 1 || item.member[1].id == id) {
  //   //       data.push({ name: item.member[0].name, id: item.member[0].id, avatar: item.member[0].avatar });
  //   //     }
  //   //     else
  //   //       data.push({ name: item.member[1].name, id: item.member[1].id, avatar: item.member[1].avatar });
  //   //   }
  //   // })
  //   // return data;
  //   // }
  //   async findDMChatrooms(id: number) {
  //     let vrbl: Map<number, any> = new Map<number, any>();
  //     let replay: any = await this.findDMChatroomsANDmsgs(id);
  //     // TODO: date adding - >
  //     // replay.sort((item1: Chat, item2: Chat) => { return item1.message[item1.message.length - 1].date > item2.message[item2.message.length - 1].date ? item1 : item2 })
  //     replay.map((item: any) => {
  //       if (item.member.length == 1 || item.member[1].id == id)
  //         vrbl.set(item.member[0].id, item.member[0]);
  //       else
  //         vrbl.set(item.member[1].id, item.member[1]);
  //     })
  //     return Array.from(vrbl.values());
  //   }
  //   async findDMChatroomsANDmsgs(id: number): Promise<Chat[]> {
  //     // returns all chat dms in the database
  //     let DMS = await this.chatRoomRepo.find({
  //       relations: {
  //         member: true,
  //         message: true,
  //       },
  //       where: {
  //         type: 'DM',
  //       },
  //       select: {
  //         member: {
  //           username: true,
  //           id: true,
  //           avatar: true,
  //           name: true
  //         },
  //         message: {
  //           // get the message and the name and id of the sender
  //           value: true,
  //           userId: {
  //             id: true,
  //             username: true,
  //           },
  //         },
  //       },
  //     });
  //     // filters the array for the wanted dms
  //     for (const dm of DMS) {
  //       if (!dm.member.some((u) => u.id === id)) {
  //         DMS = DMS.filter((ID) => ID.id !== dm.id);
  //       }
  //     }
  //     return DMS;
  //   }

  //   // async findDMChatroom(user1: number, user2: number) {
  //   //   const user1ListOfChatrooms = await this.chatRoomRepo.find({
  //   //     relations: {
  //   //       member: true,
  //   //     },
  //   //     where: {
  //   //       type: 'DM',
  //   //       member: {

  //   //         id: user1,
  //   //       },
  //   //     },
  //   //     select: {
  //   //       member: {
  //   //         id: true,
  //   //       },
  //   //     },
  //   //   });
  //   //   const user2ListOfChatrooms = await this.chatRoomRepo.find({
  //   //     relations: {
  //   //       member: true,
  //   //     },
  //   //     where: {
  //   //       type: 'DM',
  //   //       member: {
  //   //         id: user2,
  //   //       },
  //   //     },
  //   //     select: {
  //   //       member: {
  //   //         username: true,
  //   //       },
  //   //     },
  //   //   });
  //   //   if (user1ListOfChatrooms && user2ListOfChatrooms) {
  //   //     for (const user1_Iterator of user1ListOfChatrooms) {
  //   //       for (const user2_Iterator of user2ListOfChatrooms) {
  //   //         if (user1_Iterator.id == user2_Iterator.id) {
  //   //           return user1_Iterator;
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   //   // return null;
  //   //   throw new HttpException("Can't find DM", HttpStatus.NOT_FOUND);
  //   // }


  //   async findDMChatroom(user1: number, user2: number) {
  //     let user1ListOfChatrooms = await this.findDMChatroomsANDmsgs(user1);
  //     let chatId: number = -1;
  //     user1ListOfChatrooms.filter((item: Chat) => {
  //       if ((item.member.length == 1 && user1 == user2) || (user2 != user1 && item.member.length == 2 && (item.member[1].id == user2 || item.member[0].id == user2)))
  //         chatId = item.id;
  //     })
  //     if (chatId > 0)
  //       return await this.getMessagesByChatID(chatId)
  //     return [];
  //   }

  //   async checkForAdminRoll(chatID: number, id: number) {
  //     return this.chatHelpers.checkForAdminRoll(chatID, id);
  //   }

  //   async checkForOwnerRoll(chatID: number, id: number) {
  //     return this.chatHelpers.checkForOwnerRoll(chatID, id);
  //   }

  //   async checkForMemberRoll(chatID: number, id: number) {
  //     return this.chatHelpers.checkForMemberRoll(chatID, id);
  //   }

  //   async getChatroomPassword(id: number) {
  //     const chatRoom = await this.chatRoomRepo.findOne({
  //       where: {
  //         id: id,
  //       },
  //       select: {
  //         password: true,
  //       },
  //     });
  //     if (chatRoom === null) {
  //       throw new HttpException(
  //         `Chatroom with ID ${id} not found`,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     return chatRoom.password;
  //   }

  //   async addMemberToChatroom(
  //     chatID: number,
  //     memberDTO: createMemberDTO,
  //   ) {
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if (chatroom.type === 'password') {
  //       const password = await this.getChatroomPassword(chatID);
  //       if (
  //         (memberDTO.password != undefined &&
  //           (await bcrypt.compare(memberDTO.password, password)) == false) ||
  //         memberDTO.password == undefined ||
  //         !(memberDTO.password && memberDTO.password.trim())
  //       ) {
  //         throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
  //       }
  //     }
  //     if (
  //       (await this.chatHelpers.checkForMemberRoll(chatID, memberDTO.member)) ==
  //       true
  //     ) {
  //       return await this.GetChatRoomByID(chatID);
  //     }
  //     const user = await this.chatHelpers.getUser(memberDTO.member);
  //     if (
  //       (await this.chatPunishment.isBannedInChatroom(
  //         chatID,
  //         memberDTO.member,
  //       )) == false
  //     ) {
  //       chatroom.member.push(user);
  //       return this.chatRoomRepo.save(chatroom);
  //     }
  //     throw new HttpException(
  //       'You are banned from joining this chatroom',
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }

  //   async addAdminToChatroom(
  //     chatID: number,
  //     adminDTO: createAdminDTO,
  //   ) {
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if (
  //       (await this.chatHelpers.checkForAdminRoll(chatID, adminDTO.roleGiver)) ==
  //       true
  //     ) {
  //       if (
  //         (await this.chatHelpers.checkForAdminRoll(
  //           chatID,
  //           adminDTO.roleReceiver,
  //         )) == true
  //       ) {
  //         return await this.GetChatRoomByID(chatID);
  //       }
  //       if (
  //         (await this.chatPunishment.isBannedInChatroom(
  //           chatID,
  //           adminDTO.roleReceiver,
  //         )) == false
  //       ) {
  //         const admin = await this.chatHelpers.getUser(adminDTO.roleReceiver);
  //         chatroom.admin.push(admin);
  //         return await this.chatRoomRepo.save(chatroom);
  //       }
  //     }
  //     throw new HttpException(
  //       "You can't assign a new admin",
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  //   async changeOwnerOfChatroom(
  //     chatID: number,
  //     swapDTO: SwapOwnerDTO,
  //   ) {
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if (
  //       (await this.chatHelpers.checkForAdminRoll(chatID, swapDTO.roleReciver)) ==
  //       true &&
  //       (await this.chatHelpers.checkForOwnerRoll(chatID, swapDTO.roleReciver)) ==
  //       true &&
  //       (await this.chatPunishment.isBannedInChatroom(
  //         chatID,
  //         swapDTO.roleReciver,
  //       )) == false
  //     ) {
  //       const newOwner = await this.chatHelpers.getUser(swapDTO.roleReciver);
  //       chatroom.owner = newOwner;
  //       const newChat = chatroom;
  //       this.chatRoomRepo.save(newChat);
  //       return newChat;
  //     }
  //     throw new HttpException(
  //       "Can't change channel ownership",
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   async kickUserFromChatroom(
  //     chatID: number,
  //     adminUserName: number,
  //     userUserName: number,
  //   ) {
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if ((await this.checkForAdminRoll(chatID, adminUserName)) == true) {
  //       if ((await this.checkForOwnerRoll(chatID, userUserName)) == false) {
  //         if ((await this.checkForAdminRoll(chatID, userUserName)) == false) {
  //           const newChat = deleteUser(chatroom, userUserName);
  //           return await this.chatRoomRepo.save(newChat);
  //         } else {
  //           const newChat = removeAdminStatus(chatroom, userUserName);
  //           return await this.chatRoomRepo.save(newChat);
  //         }
  //       } else {
  //         throw new HttpException(
  //           "you can't kick chatroom owner",
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     }
  //     throw new HttpException(
  //       'you need administrator permission to kick users',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   async deleteChat(chatID: number) {
  //     await this.chatRoomRepo
  //       .createQueryBuilder('chatroom')
  //       .delete()
  //       .from(Chat)
  //       .where('id = :id', { id: chatID })
  //       .execute();
  //   }

  //   async removeAdminFromChatroom(
  //     chatID: number,
  //     adminUserName: number,
  //     userUserName: number,
  //   ) {
  //     console.log('chat id : ', chatID);
  //     console.log('adminUserName : ', adminUserName);
  //     console.log('userUserName : ', userUserName);
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if (
  //       (await this.chatHelpers.checkForAdminRoll(chatID, adminUserName)) &&
  //       (await this.chatHelpers.isMoreThenOneAdminInChatroom(chatID)) &&
  //       (await this.chatHelpers.checkForOwnerRoll(chatID, userUserName)) == false
  //     ) {
  //       const newChatroom = removeAdminStatus(chatroom, userUserName);
  //       return this.chatRoomRepo.save(newChatroom);
  //     } else {
  //       throw new HttpException(
  //         'you need administrator permission to remove admins',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  //   async leaveChat(chatID: number, user: number) {
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if ((await this.chatHelpers.onlyOneUserInChatroom(chatID)) == true) {
  //       this.deleteChat(chatID);
  //       console.log(
  //         `Deleted chatroom with ID: ${chatroom.id}, Title: ${chatroom.chatRoomName}`,
  //       );
  //       return 'Chatroom has been deleted';
  //     }
  //     if ((await this.chatHelpers.checkForOwnerRoll(chatID, user)) == true) {
  //       if (
  //         (await this.chatHelpers.isMoreThenOneAdminInChatroom(chatID)) == true
  //       ) {
  //         chatroom.owner = chatroom.admin[1];
  //       } else if (
  //         (await this.chatHelpers.isMoreThenOneMemberInChatroom(chatID)) == true
  //       ) {
  //         for (const member of chatroom.member) {
  //           if (member.username != chatroom.owner.username) {
  //             chatroom.owner = member;
  //             chatroom.admin.push(member);
  //             break;
  //           }
  //         }
  //       } else {
  //         this.deleteChat(chatID);
  //       }
  //     }
  //     const newChat = deleteUser(chatroom, user);
  //     return await this.chatRoomRepo.save(newChat);
  //   }
  //   async updateChatroom(
  //     chatID: number,
  //     adminName: number,
  //     updateDTO: UpdateChatroomDTO,
  //   ) {
  //     console.log(adminName)
  //     const chatroom = await this.GetChatRoomByID(chatID);
  //     if (chatroom.type === 'DM') {
  //       throw new HttpException(
  //         "Chat room of type DM can't be chnged!",
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     if ((await this.checkForAdminRoll(chatID, adminName)) === true) {
  //       if (updateDTO.newChatroomName) {
  //         chatroom.chatRoomName = updateDTO.newChatroomName;
  //       }
  //       if (updateDTO.newType) {
  //         chatroom.type = updateDTO.newType;
  //         if (updateDTO.newType === 'password') {
  //           const passwordHash = await bcrypt.hash(updateDTO.newPassword, 10);
  //           chatroom.password = passwordHash;
  //         }
  //       }
  //       return await this.chatRoomRepo.save(chatroom);
  //     }
  //     throw new HttpException(
  //       "You don't have permission to update this chatroom",
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }

  //   async getChatroomsByType(type: string) {
  //     const chatrooms = await this.chatRoomRepo.find({
  //       where: {
  //         type: type,
  //       },
  //       relations: {
  //         owner: true,
  //       },
  //       select: {
  //         chatRoomName: true,
  //         id: true,
  //         type: true,
  //         owner: {
  //           username: true,
  //         },
  //       },
  //       order: {
  //         id: 'asc',
  //       },
  //       //cache: true,
  //     });
  //     return chatrooms;
  //   }
  //   async getMessagesByChatID(chatID: number) {
  //     return this.messageService.getMessagesByChatID(chatID);
  //   }
  //   async getChatroomPunishments(chatID: number) {
  //     return this.chatPunishment.getChatroomPunishments(chatID);
  //   }

  //   async deleteUserFromChatroom(
  //     chatroomId: number,
  //     user: number,
  //   ) {
  //     const chatroom = await this.GetChatRoomByID(chatroomId);
  //     if (await this.chatHelpers.checkForOwnerRoll(chatroomId, user)) {
  //       throw new HttpException(
  //         'Cannot remove owner of chatroom',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     const updatedChatroom = deleteUser(chatroom, user);
  //     return await this.chatRoomRepo.save(updatedChatroom);
  //   }

  //   async createPunishment(
  //     chatID: number,
  //     id: number,
  //     punishmentDTO: createPunishmentDTO,
  //   ) {
  //     if (
  //       (await this.chatHelpers.canBePunished(chatID, id, punishmentDTO)) ==
  //       true
  //     ) {
  //       if (
  //         punishmentDTO.type == 'ban' &&
  //         (await this.chatPunishment.isBannedInChatroom(
  //           chatID,
  //           id,
  //         )) == true
  //       ) {
  //         throw new HttpException('User already banned', HttpStatus.BAD_REQUEST);
  //       } else if (
  //         punishmentDTO.type == 'mute' &&
  //         (await this.chatPunishment.isMutedInChatroom(
  //           chatID,
  //           id,
  //         )) == true
  //       ) {
  //         throw new HttpException('User already muted', HttpStatus.BAD_REQUEST);
  //       }
  //       if (punishmentDTO.type == 'ban') {
  //         this.deleteUserFromChatroom(chatID, id);
  //       }
  //       const chat = await this.GetChatRoomByID(punishmentDTO.chatID);
  //       const user = await this.chatHelpers.getUser(id);
  //       return await this.chatPunishment.createPunishment(
  //         chat,
  //         user,
  //         punishmentDTO,
  //       );
  //     }
  //     throw new HttpException(
  //       'Unable to create Punishment',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   async getUserMessagesInChatroom(
  //     id: number,
  //     idUser: number,
  //   ) {
  //     const messages = await this.messageService.getMessagesByChatroomID(id);
  //     // TODO: get blocked users and filter there messages befor returning
  //     return messages;
  //   }

  //   async clearPunishment(id: number, admin: number, user: number, type: string) {
  //     if ((await this.checkForAdminRoll(id, admin)) == false) {
  //       throw new HttpException(
  //         "You don't have the necessary permissions",
  //         HttpStatus.FORBIDDEN,
  //       );
  //     }
  //     if (
  //       type === 'ban' &&
  //       (await this.chatPunishment.checkIfUserBanned(id, user)) == true
  //     ) {
  //       return this.chatPunishment.clearUserPunishment(id, user, type);
  //     } else if (
  //       type === 'mute' &&
  //       (await this.chatPunishment.checkIfUserMuted(id, user)) == true
  //     ) {
  //       return this.chatPunishment.clearUserPunishment(id, user, type);
  //     } else {
  //       throw new HttpException(
  //         `User is not ` + type === 'ban' ? 'banned' : 'muted',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }
// } // END OF ChatService class
