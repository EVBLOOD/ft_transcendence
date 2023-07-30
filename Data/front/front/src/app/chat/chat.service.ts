import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

const URL = "http://10.13.4.8:3000";

export type createChatroom = {
  type: string;
  chatroomName: string;
  password: string | null;
  user: string;
  otherUser: string;
};
type createAdminDTO = {
  roleGiver: string;
  roleReceiver: string;
}
export type UpdateChatroomDTO = {
  newType: string;
  newPassword: string;
  newChatroomName: string;
}

export type CreatePunishmentDto = {
  type: string;

  user: string;

  chatID: number;
}

export type sendMessageDTO = {
  value: string;
  charRoomId: number;
};

export type addUserDTO = {
  userName: string
};

type createMemberDTO = {
  member: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private sock: Socket;
  private PunishmentSock: Socket;
  private update: BehaviorSubject<any> = new BehaviorSubject<any>({});
  // private update : BehaviorSubject<number> = new BehaviorSubject<number>(0); 
  constructor(private httpClient: HttpClient
  ) {
    this.PunishmentSock = io(URL + "/punishment", {
      withCredentials: true,
    });
    this.sock = io('http://10.13.4.8:3000/chat', {
      withCredentials: true,
    });
    // this.sock.on(
    //   'recMessage', (data) => {
    //     // this.message = data.value;
    //     // console.log("user: ", data.userId.userName);
    //     // if (this.currentUser !== data.userId.userName)
    //     //   console.log(data.userId.userName + ": " + this.message);
    //     // console.log(data)
    //   }
    // );
    this.sock.on('ChannelMessages', (data) => {
      console.log('this is channel message!')
      this.update.next(data)
    })

    this.sock.on(
      'privateMessage', (data) => {
        console.log('this is private message!')
        this.update.next(data)
      }
    );

    this.sock.on("kickUser", (data) => {
      console.log("kicked user: " + data.userName);
    });

    this.PunishmentSock.on("gotBanned", (data) => {
      console.log(data);
    })
  }

  joinSocket(channel: string) {
    this.sock.emit('join-room', channel)
  }


  leaveSocket(channel: string) {
    this.sock.emit('leave-room', channel)
  }

  getUpdate(): Observable<any> {
    return this.update;
  }
  getGroupMembers(id: number) {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/membersFor/` + id, { withCredentials: true, })
  }

  getThisChat(id: number) {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/find/` + id, { withCredentials: true, })
  }
  // invites
  Sendinvite(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/invites`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  Acceptinvite(channelID: string, UserId: number) {

    return this.httpClient.post(`http://10.13.4.8:3000/chat/AcceptInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  Listinvites() {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/invites`, { withCredentials: true })
  }

  Cancelinvite(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/RemoveInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  removeInvite(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/CancelInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // kick
  KickThisOne(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/kickUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // remove OPER
  RemoveRole(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/RemoveRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  CreateRole(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/CreateRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // Ban User:
  banUser(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/banUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  banUserRemoval(channelID: string, UserId: number) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/banUserRemoval`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // Done
  getDmMessages(id: number) {
    return this.httpClient.get<any>(URL + `/chat/DM/${id}`, { withCredentials: true, });
  }

  leaveChatroom(id: string) {
    return this.httpClient.delete(URL + `/chat/leave/${id}`, { withCredentials: true, })
  }
  getThisChatMsgs(id: number) {
    return this.httpClient.get(`http://10.13.4.8:3000/message/for` + id, { withCredentials: true, })

  }

  getChatrooms() {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/user`, { withCredentials: true, })
  }

  getChatDM() {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/DM`, { withCredentials: true, })
  }

  joinChatroom(chat: createChatroom) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/create`, chat, { withCredentials: true, });
  }

  JoiningChatRoom(chat: createChatroom) {
    return this.httpClient.post(`http://10.13.4.8:3000/chat/JoinRoom`, chat, { withCredentials: true, });
  }
  sendMessage(message: sendMessageDTO, type: boolean) {
    // console.log("message DTO", message);
    if (type)
      this.sock.emit("ChannelMessages", { type: type, message: message });
    else
      this.sock.emit("privateMessage", { type: type, message: message });
  }
  getChatroomMessages(id: number) {
    return this.httpClient.get<number>(URL + `/chat/${id}/messages`, { withCredentials: true, });
  }
  addUser(user: addUserDTO) {
    return this.httpClient.post<addUserDTO>(`http://10.13.4.8:3000/user`, user, { withCredentials: true, });
  }
  getUser() {
    return this.httpClient.get("http://10.13.4.8:3000/user", { withCredentials: true, })
  }
  addUserToChatRoom(id: string, user: string, password: string) {
    const dto: createMemberDTO = {
      member: user,
      password: password,
    }
    console.log("dto", dto, "id == ", id);
    return this.httpClient.put<string>(`http://10.13.4.8:3000/chat/${id}/add/member`, dto, { withCredentials: true, });
  }
  addAdminToChatRoom(id: string, admin: string, user: string) {
    const dto: createAdminDTO = {
      roleGiver: admin,
      roleReceiver: user,
    }
    console.log("dto", dto, "id == ", id);
    return this.httpClient.put<string>(`http://10.13.4.8:3000/chat/${id}/add/admin`, dto, { withCredentials: true, });
  }
  getUserMessages(user: string) {
    return this.httpClient.get<string>(URL + `/message/user/${user}`);
  }
  kickuser(chatID: number, admin: string, user: string) {
    return this.httpClient.delete(URL + `/chat/delete/${chatID}/admin/${admin}/user/${user}`, { withCredentials: true, });
  }
  // update/:chatID/admin
  updateChatroom_(id: number, user: string, dto: UpdateChatroomDTO) {
    return this.httpClient.put<UpdateChatroomDTO>(URL + `/chat/update/${id}/admin/${user}`, dto, { withCredentials: true, });
  }

  updateChatroom(id: number, dto: UpdateChatroomDTO) {
    return this.httpClient.put<UpdateChatroomDTO>(URL + `/chat/update/${id}/admin`, dto, { withCredentials: true, });
  }
  // PunishUser(admin: string, dto: CreatePunishmentDto) {
  //   console.log("dto: ", dto);
  //   return this.httpClient.post<CreatePunishmentDto>(
  //     URL + `/chat/${dto.chatID}/admin/${admin}/punishment`, dto
  //   )
  // }
  PunishUser(admin: string, dto: CreatePunishmentDto) {
    console.log("dto: ", dto);
    this.PunishmentSock.emit("chatBan", dto, admin);
  }
  checkPunishment(id: number, user: string, type: string) {
    return this.httpClient.get(URL + `/punishment/chat/${id}/user/${user}/${type}`, { withCredentials: true, })
  }

  getChatroomMessagesnyName(chatname: string) {
    return this.httpClient.get(URL + `/punishment/chat/all/${chatname}`, { withCredentials: true, })
  }

  getInvitesForMe() {
    return this.httpClient.get(URL + `/chat/invites`, { withCredentials: true, })
  }
  myRole(id: number) {
    return this.httpClient.get(URL + `/chat/myRole/${id}`, { withCredentials: true, })
  }

  getSeenCount(id: number) {
    return this.httpClient.get(URL + `/chat/MyCount/${id}`, { withCredentials: true, })
  }
  getChatroomsByname(ChannelName: string) {
    return this.httpClient.get(URL + `/chat/findbyName/${ChannelName}`, { withCredentials: true, })
  }

  getInvitedFriends(id: number, userid: number) {
    return this.httpClient.get(URL + `/chat/findingInvitedonce/${id}/${userid}`, { withCredentials: true });
  }
}
