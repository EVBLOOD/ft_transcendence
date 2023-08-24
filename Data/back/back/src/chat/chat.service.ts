import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
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
import { Friendship } from 'src/friendship/entities/friendship.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private readonly ChatRepo: Repository<Chat>,
    @InjectRepository(Members) private readonly MembersRepo: Repository<Members>,
    @InjectRepository(Messages) private readonly MessagesRepo: Repository<Messages>,
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    @InjectRepository(Friendship) private readonly FriendshipRepo: Repository<Friendship>,
    private readonly Friendship: FriendshipService,
    private readonly users: UserService) { }

  async getChatRoomOfUsers(userId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type != :type AND Members.state IN (1, 3)", { userId, type: 'direct' }).orderBy('chatID.id').getMany();
    return rooms;
  }

  async findDMChatrooms(userId: number) {
    const roomsIds = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type = :type", { userId, type: 'direct' }).getRawMany()
    if (!roomsIds || roomsIds.length == 0)
      return [];
    const ret = roomsIds.map((item) => { return item.chatID_id })
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: userId }).getMany()
    const users = await this.Friendship.blockOneEach(userId);
    if (!users.length)
      return rooms;
    const z = rooms.map((room) => {
      if (users.map((user) => { return user.sender != room.user.id && user.receiver != room.user.id }))
        return room;
    })
    return z;
    // return rooms;
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
    if (rooms)
      return rooms.chat.id;
    return -1;
  }

  async getChatRoomsbyName(id: number, name: string) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where('Userid.id = :id AND chatID.name LIKE :name AND Members.state IN (1, 3)', { id: id, name: `${name}%` }).getMany();
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
      .where("chatID.type != :type AND chatID.name = :channelId AND Members.state IN (:...active) AND Userid.id = :userId", { type: 'direct', channelId: channelName, active: [1, 0, 3], userId })
      .getMany();
    return rooms;
  }

  async setAsAdmin(userId: number, channelId: number, userTarget: number) {
    if (!(await this.checkforRole(channelId, userId, ['admin', 'owner'])) || await this.checkforRole(channelId, userTarget, ['owner']))
      return {};
    let Membership = await this.isMember(userTarget, channelId);
    if (!Membership || !Membership.length)
      return {}
    Membership[0].role = 'admin';
    return await this.MembersRepo.save(Membership[0]);
  }

  async removeAdminRole(userId: number, channelId: number, userTarget: number) {
    if (!(await this.checkforRole(channelId, userId, ['admin', 'owner'])) || await this.checkforRole(channelId, userTarget, ['owner']))
      return {};
    let Membership = await this.isMember(userTarget, channelId);
    if (!Membership || !Membership.length)
      return {}
    Membership[0].role = 'none';
    return await this.MembersRepo.save(Membership[0]);
  }

  async banFromChannel(userId: number, channelId: number, userTarget: number) {
    if (!(await this.checkforRole(channelId, userId, ['admin', 'owner'])) || await this.checkforRole(channelId, userTarget, ['owner']))
      return {};
    let Membership = await this.isMember(userTarget, channelId);
    if (!Membership || !Membership.length)
      return {}
    Membership[0].state = 0;
    Membership[0].role = 'none';
    return await this.MembersRepo.save(Membership[0]);
  }

  async isBanned(userId: number, channelId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.id = :channelId AND Members.state = :active AND Userid.id = :userId", { type: 'direct', channelId: channelId, active: 0, userId })
      .getMany();
    return rooms;
  }

  async removeBanFromChannel(userId: number, channelId: number, userTarget: number) {
    if (!(await this.checkforRole(channelId, userId, ['admin', 'owner'])) || await this.checkforRole(channelId, userTarget, ['owner']))
      return {};
    let Membership = await this.isBanned(userTarget, channelId);
    if (!Membership || !Membership.length)
      return {}
    Membership[0].state = 1;
    return await this.MembersRepo.save(Membership[0]);
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
        return {};
      return await this.MembersRepo.save({ chatID: room.id, role: 'none', state: 1, Userid: userId, notSeen: 0 });
    }
    return await this.MembersRepo.save({ chatID: room.id, role: 'none', state: 1, Userid: userId, notSeen: 0 });
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
      const passwordHash = await bcrypt.hash(chatroomDTO.password, 10);
      chatroomDTO.password = passwordHash;
    }
    let room: any;
    if (chatroomDTO.type == 'direct')
      room = await this.ChatRepo.save({ type: chatroomDTO.type, password: chatroomDTO.password, });
    else
      room = await this.ChatRepo.save({ name: chatroomDTO.chatroomName, type: chatroomDTO.type, password: chatroomDTO.password, });
    if (chatroomDTO.type == 'direct')
      await this.MembersRepo.save({ chatID: room.id, Userid: userId, role: 'none', state: 1, notSeen: 0 })
    else
      await this.MembersRepo.save({ chatID: room.id, Userid: userId, role: 'owner', state: 1, notSeen: 0 })

    if (chatroomDTO.type == 'direct' && userId != parseInt(chatroomDTO.chatroomName))
      await this.MembersRepo.save({ chatID: room.id, Userid: parseInt(chatroomDTO.chatroomName), role: 'none', state: 1, notSeen: 0 })
    return room;
  }

  async GetChatRoomByID_(id: number) {
    const counter = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id = :id AND Members.state IN (1, 3)", { id }).getCount();
    return { rooms: await this.GetChatRoomByID(id), count: counter }
  }

  async accessToDM(UserID: number, currentID: number) {
    const rep = await this.Friendship.WeBlockedEachOther(UserID, currentID);
    if (rep)
      return false;
    const exists = await this.users.findOne(UserID);
    if (!exists)
      return false;
    return true;
  }


  async accessToChat(UserID: number, ChatID: number) {
    const ret = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.type != 'direct' AND chatID.id = :id AND Members.state IN (1, 3) AND Userid.id = :UserId", { id: ChatID, UserId: UserID }).getCount();
    if (ret)
      return true;
    return false;
  }

  async GetChatRoomByID(id: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id = :id", { id }).getOne();
    return rooms;
  }

  // posting sould be conditionel
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
      .where("chat.id = :chatID", { chatID: roomDM.chat.id }).orderBy('messages.time', 'DESC').getMany();
    return messages;
  }

  async MuteHim(current: number, id: number, chatID: number) {
    if (!(await this.checkforRole(chatID, current, ['admin', 'owner'])) || await this.checkforRole(chatID, id, ['owner']))
      return {};
    const x = await this.MembersRepo.findOne({ where: { chatID: chatID, Userid: id, state: 1 } });
    if (x && x.role == 'none') {
      const now = new Date();
      x.state = 3;
      x.mute = new Date(now.getTime() + now.getMinutes() * 60000);
      return await this.MembersRepo.save(x);
    }
    return {};
  }

  async isMute(id: number, chatID: number) {
    const x = await this.MembersRepo.findOne({ where: { chatID: chatID, Userid: id, state: 3 } });
    if (!x)
      return false;
    if (x.mute > (new Date()))
      return true;
    x.state = 1;
    this.MembersRepo.save(x);
    return false;
  }


  async findDMChatNotSeen(user2: number, user1: number) {
    const roomsIds = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type = :type", { userId: user1, type: 'direct' }).getRawMany()
    if (!roomsIds || roomsIds.length == 0)
      return {}
    const ret: any[] = roomsIds.map((item) => { return item.chatID_id })
    if (user1 == user2) {
      const roomDM = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid")
        .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: user2 }).getRawMany();
      const newf = ret.filter((item) => { return !roomDM.find((itm) => item.chatID_id == itm.chatID_id) })
      if (newf.length == 0)
        return [];
      return newf[0];
    }
    const roomDM = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id IN (:...ids) AND Userid.id = :Userid", { ids: ret, Userid: user2 }).getOne()
    return roomDM;
  }
  async isMember(userId: number, channelId: number) {
    const rooms = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid").select(["Userid", "Members"])
      .where("chatID.type != :type AND chatID.id = :channelId AND Members.state IN (1, 3) AND Userid.id = :userId", { type: 'direct', channelId: channelId, userId })
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
    return rooms;
  }
  async getMessagesByChatID(userId: number, channelId: number) {
    if (await this.isMember(userId, channelId)) {
      const listblocked = await this.Friendship.blockOneEach(userId);
      // console.log(listblocked);
      const idsBlockedMembers = listblocked.map((it) => {
        if (it.sender != userId)
          return it.sender
        return it.receiver
      });
      if (idsBlockedMembers.length)
        return await this.MessagesRepo.createQueryBuilder("messages").leftJoinAndSelect('messages.chat_id', 'chat')
          .leftJoinAndSelect('messages.sender', 'user').where("chat.id = :channelId AND user.id NOT IN (:...ids)", { channelId, ids: idsBlockedMembers }).orderBy('messages.time', 'DESC').getMany();
      return await this.MessagesRepo.createQueryBuilder("messages").leftJoinAndSelect('messages.chat_id', 'chat')
        .leftJoinAndSelect('messages.sender', 'user').where("chat.id = :channelId", { channelId }).orderBy('messages.time', 'DESC').getMany();
    }
    return [];
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
    return await this.MessagesRepo.save({ content: messageDTO.value, sender: id, time: (new Date()).toISOString(), chat_id: messageDTO.charRoomId })
  }

  async sendAnInvite(channelId: number, currentUser: number, theInvitedOne: number) {
    if (!(await this.isMember(currentUser, channelId))?.length || (await this.isMember(theInvitedOne, channelId))?.length)
      return {}
    return await this.MembersRepo.save({ chatID: channelId, role: 'none', Userid: theInvitedOne, state: 2, notSeen: 0 });
  }

  async checkInviteExists(channelId: number, currentUser: number) {
    const x = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.id = :channelId AND chatID.type != :type AND Members.state = :active",
        { userId: currentUser, type: 'direct', channelId, active: 2 }).getOne();
    return x;
  }

  async AcceptAnInvite(channelId: number, currentUser: number) {
    const x = await this.checkInviteExists(channelId, currentUser);
    if (x) {
      x.state = 1;
      return await this.MembersRepo.save(x);
    }
    return {};
  }

  async DeleteAnInvite(channelId: number, currentUser: number) {
    const x = await this.checkInviteExists(channelId, currentUser);
    if (x) {
      return await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
    }
    return {};
  }

  async ListOfFriendsToInvite(channelId: number, currentUser: number) {

    if (!(await this.isMember(currentUser, channelId))?.length)
      return {}

    const memberFOR = await this.getChatRoomMembers(currentUser, channelId);

    const idsMembers = memberFOR.map((it) => { return it.Userid });

    let findList: any;

    findList = await this.FriendshipRepo.createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user1', 'user1')
      .leftJoinAndSelect('friendship.user2', 'user2')
      .where('friendship.receiver = :id', { id: currentUser })
      .andWhere('friendship.sender NOT IN (:...ids)', { ids: idsMembers })
      .andWhere('friendship.blocked = :blocked', { blocked: false })
      .andWhere('friendship.status = :status', { status: 'accepted' })
      .orWhere('friendship.sender = :id', { id: currentUser })
      .andWhere('friendship.receiver NOT IN (:...ids)', { ids: idsMembers })
      .andWhere('friendship.blocked = :blocked', { blocked: false })
      .andWhere('friendship.status = :status', { status: 'accepted' })
      .getMany();

    if (!findList?.length) return [];
    let friends: Array<User> = [];
    findList.forEach((element) => {
      if (element.user1.id == currentUser) friends.push(element.user2);
      else friends.push(element.user1);
    });
    return friends;
  }

  async getInvites(id: number) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type != :type AND Members.state = :active",
        { userId: id, type: 'direct', active: 2, }).getMany();
  }

  async invitedOnce(idUser: number, idChannel: number) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where('chatID.id = :idChannel AND Userid.id = :idUser AND Members.state = 2', { idUser, idChannel }).getMany()
  }

  async checkforRole(channelId: number, currentUser: number, role: any[]) {
    return await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.id = :channelId AND chatID.type != :type AND Members.state IN (1, 3) AND Members.role IN (:...roles)",
        { userId: currentUser, type: 'direct', channelId, roles: role }).getOne();
  }

  async kickUser(channelId: number, currentUser: number, theOneToKick: number) {
    if (!(await this.checkforRole(channelId, currentUser, ['owner', 'admin'])) || !(await this.checkforRole(channelId, theOneToKick, ['admin', 'none'])))
      return {}
    return await this.MembersRepo.delete({ chatID: channelId, Userid: theOneToKick, });
  }
  async LeaveChannel(channelId: number, currentUser: number) {
    if (await this.checkforRole(channelId, currentUser, ['admin', 'none']))
      return await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
    if (await this.checkforRole(channelId, currentUser, ['owner'])) {
      let nextOwner = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid").where("chatID.id = :channelId AND Members.role = :admin AND Members.state IN (1, 3)", { channelId: channelId, admin: 'admin' }).getOne();
      if (!nextOwner)
        nextOwner = await this.MembersRepo.createQueryBuilder('Members')
          .leftJoinAndSelect("Members.chat", "chatID")
          .leftJoinAndSelect("Members.user", "Userid").where("chatID.id = :channelId AND Members.role = :admin AND Members.state IN (1, 3)", { channelId: channelId, admin: 'none' }).getOne();
      if (nextOwner) {
        await this.MembersRepo.save({ chatID: channelId, Userid: nextOwner.Userid, role: 'owner', state: 1 })
        return await this.MembersRepo.delete({ chatID: channelId, Userid: currentUser, });
      }
      await this.MembersRepo.delete({ chatID: channelId });
      await this.MessagesRepo.delete({ chat_id: channelId, });
      return await this.ChatRepo.delete({ id: channelId });
    }
  }

  async SeenForDM(user1: number, user2: number, number: number) {
    const roomsIds = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("Userid.id = :userId AND chatID.type = :type", { userId: user1, type: 'direct' }).getRawMany()
    if (!roomsIds || roomsIds.length == 0)
      return {}
    const ret: any[] = roomsIds.map((item) => { return item.chatID_id })
    if (user1 == user2) {
      const roomDM = await this.MembersRepo.createQueryBuilder('Members')
        .leftJoinAndSelect("Members.chat", "chatID")
        .leftJoinAndSelect("Members.user", "Userid")
        .where("chatID.id IN (:...ids) AND Userid.id != :Userid", { ids: ret, Userid: user2 }).getRawMany();
      const ret_: any[] = roomDM.map((item) => { return item.chatID_id })
      const newf = ret.filter((item) => { return !ret_.find((itm) => item == itm) })
      if (newf.length == 0)
        return {};
      if (number)
        return this.MembersRepo.createQueryBuilder().update().set({
          notSeen: () => `notSeen + ${number}`,
        }).where("Userid = :UserID AND chatID = :chatID", { UserID: user2, chatID: newf[0] })
          .execute();
      else
        return this.MembersRepo.createQueryBuilder().update().set({
          notSeen: 0,
        }).where("Userid != :UserID AND chatID = :chatID", { UserID: user2, chatID: newf[0] })
          .execute();
    }
    const roomDM = await this.MembersRepo.createQueryBuilder('Members')
      .leftJoinAndSelect("Members.chat", "chatID")
      .leftJoinAndSelect("Members.user", "Userid")
      .where("chatID.id IN (:...ids) AND Userid.id = :Userid", { ids: ret, Userid: user2 }).getOne()
    if (!roomDM)
      return {}
    if (number)
      return this.MembersRepo.createQueryBuilder().update().set({
        notSeen: () => `notSeen + ${number}`,
      }).where("Userid = :UserID AND chatID = :chatID", { UserID: user2, chatID: roomDM.chat.id })
        .execute();
    else
      return this.MembersRepo.createQueryBuilder().update().set({
        notSeen: 0,
      }).where("Userid != :UserID AND chatID = :chatID", { UserID: user2, chatID: roomDM.chat.id })
        .execute();
  }
  async findChannelbyId(userID: number, ChannelID: number) {
    if (!(await this.isMember(userID, ChannelID)).length)
      return {};
    return await this.ChatRepo.findOne({ where: { id: ChannelID } });
  }
  async seenForChannel(userID: number, ChannelID: number, number: number) {
    if (((await this.isMember(userID, ChannelID))?.length)) {
      if (number) {
        const rep = await this.MembersRepo.createQueryBuilder().update().set({
          notSeen: () => `notSeen + ${number}`,
        }).where("Userid != :UserID AND chatID = :chatID", { UserID: userID, chatID: ChannelID })
          .execute();
        return rep;
      }
      else {
        const rep = await this.MembersRepo.createQueryBuilder().update().set({
          notSeen: 0,
        }).where("Userid = :UserID AND chatID = :chatID", { UserID: userID, chatID: ChannelID })
          .execute();
        return rep;
      }
    }
  }
} // END OF ChatService class
