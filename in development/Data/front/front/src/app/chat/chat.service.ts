import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { AuthService } from '../login/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { hostIp, tokenName } from 'src/config';
import { Router } from '@angular/router';
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
  private toctoc = '';
  private sock: Socket;
  private update: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private closeIt: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public updateChannels: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public updatePrivates: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public updateMembership: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public updateSeen: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private httpClient: HttpClient, private mySelf: AuthService,
    private cookieService: CookieService, private switchRouter: Router
  ) {
    this.toctoc = cookieService.get(tokenName);
    this.sock = io(`${hostIp}:3000/chat`, {
      withCredentials: true,
    });

    this.sock.on('ChannelMessages', (data) => {
      this.update.next(data);
      this.update.next({});
      this.updateChannels.next(data);
      this.updateChannels.next({});
      data = {}
    })

    this.sock.on(
      'privateMessage', (data) => {
        this.update.next(data)
        this.update.next({});
        this.updatePrivates.next(data);
        this.updatePrivates.next({});
      }
    );

    this.sock.on("force-leave", (data: any) => {
      if (this.mySelf.getId() == data?.UserId) {
        this.closeIt.next(data);
        this.closeIt.next({});
        this.sock.emit('force-leave', data.chatID)
      }
    });
    this.sock.on("GoPlay", (data) => {
      this.updateMembership.next(data);
      this.updateMembership.next({});
    })
    this.sock.on('updateSeen', (data) => {
      this.updateSeen.next(data);
      this.updateSeen.next({});
    })

  }

  inviteList(id: string) {
    return this.httpClient.get(hostIp + ':3000/chat/Toinvite/' + id, { withCredentials: true });
  }

  hasAccessToChannel(id: string) {
    return this.httpClient.get(hostIp + ':3000/chat/accessToChat/' + id, { withCredentials: true }); // here we are
  }

  hasAccessToDM(id: string) {
    return this.httpClient.get(hostIp + ':3000/chat/accessToDM/' + id, { withCredentials: true });
  }
  getChatroomByID(channelId: string) {
    return this.httpClient.get(hostIp + ':3000/chat/findbyId/' + channelId, { withCredentials: true });
  }
  getCloseOrNot(): Observable<any> {
    return this.closeIt.asObservable();
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
    return this.httpClient.get(`${hostIp}:3000/chat/membersFor/` + id, { withCredentials: true, })
  }

  getThisChat(id: number) {
    return this.httpClient.get(`${hostIp}:3000/chat/find/` + id, { withCredentials: true, })
  }
  // invites
  Sendinvite(channelID: string, UserId: number) {
    return this.httpClient.post(`${hostIp}:3000/chat/invites`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  Acceptinvite(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/AcceptInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    return this.httpClient.post(`${hostIp}:3000/chat/AcceptInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  Listinvites() {
    return this.httpClient.get(`${hostIp}:3000/chat/invites`, { withCredentials: true })
  }

  Cancelinvite(channelID: string, UserId: number) {
    return this.httpClient.post(`${hostIp}:3000/chat/RemoveInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  removeInvite(channelID: string, UserId: number) {
    return this.httpClient.post(`${hostIp}:3000/chat/CancelInvite`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // kick
  KickThisOne(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/kickUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    this.sock.emit('ping-leave', { chatID: channelID, UserId: UserId })
    return this.httpClient.post(`${hostIp}:3000/chat/kickUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // remove OPER
  RemoveRole(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/RemoveRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    return this.httpClient.post(`${hostIp}:3000/chat/RemoveRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  CreateRole(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/CreateRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    return this.httpClient.post(`${hostIp}:3000/chat/CreateRole`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // done
  // Ban User:
  banUser(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/banUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    this.sock.emit('ping-leave', { chatID: channelID, UserId: UserId })
    return this.httpClient.post(`${hostIp}:3000/chat/banUser`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }

  banUserRemoval(channelID: string, UserId: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(`${hostIp}:3000/chat/banUserRemoval`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
    }
    this.sock.emit("updateMembersTime", { chatID: channelID, UserId: UserId });
    return this.httpClient.post(`${hostIp}:3000/chat/banUserRemoval`, { chatID: channelID, UserId: UserId }, { withCredentials: true })
  }
  // Done
  getDmMessages(id: number) {
    return this.httpClient.get<any>(hostIp + `:3000/chat/DM/${id}`, { withCredentials: true, });
  }

  LetsSilenceHim(user: number, Chausertid: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.post(hostIp + ':3000/chat/Mute', { UserId: user, chatID: Chausertid }, { withCredentials: true });
    }
    this.sock.emit("updateMembersTime", { chatID: Chausertid, UserId: user });
    return this.httpClient.post(hostIp + ':3000/chat/Mute', { UserId: user, chatID: Chausertid }, { withCredentials: true });
  }

  leaveChatroom(id: string) {
    return this.httpClient.delete(hostIp + `:3000/chat/leave/${id}`, { withCredentials: true, })
  }
  getThisChatMsgs(id: number) {
    return this.httpClient.get(`${hostIp}:3000/message/for` + id, { withCredentials: true, })
  }

  getChatrooms() {
    return this.httpClient.get(`${hostIp}:3000/chat/user`, { withCredentials: true, })
  }

  getChatDM() {
    return this.httpClient.get(`${hostIp}:3000/chat/DM`, { withCredentials: true, })
  }

  joinChatroom(chat: createChatroom) {
    return this.httpClient.post(`${hostIp}:3000/chat/create`, chat, { withCredentials: true, });
  }

  JoiningChatRoom(chat: createChatroom) {
    return this.httpClient.post(`${hostIp}:3000/chat/JoinRoom`, chat, { withCredentials: true, });
  }
  sendMessage(message: sendMessageDTO, type: boolean) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return;
    }
    if (type)
      this.sock.emit("ChannelMessages", { type: type, message: message });
    else
      this.sock.emit("privateMessage", { type: type, message: message });
  }
  getChatroomMessages(id: number) {
    return this.httpClient.get<number>(hostIp + `:3000/chat/${id}/messages`, { withCredentials: true, });
  }
  addUser(user: addUserDTO) {
    return this.httpClient.post<addUserDTO>(`${hostIp}:3000/user`, user, { withCredentials: true, });
  }
  getUser() {
    return this.httpClient.get(`${hostIp}:3000/user`, { withCredentials: true, })
  }
  addUserToChatRoom(id: string, user: string, password: string) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.put<string>(`${hostIp}:3000/chat/${id}/add/member`, {}, { withCredentials: true, });
    }
    this.sock.emit("updateMembersTime", { chatID: id, UserId: user });
    const dto: createMemberDTO = {
      member: user,
      password: password,
    }
    return this.httpClient.put<string>(`${hostIp}:3000/chat/${id}/add/member`, dto, { withCredentials: true, });
  }
  addAdminToChatRoom(id: string, admin: string, user: string) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return this.httpClient.put<string>(`${hostIp}:3000/chat/${id}/add/admin`, {}, { withCredentials: true, });
    }
    this.sock.emit("updateMembersTime", { chatID: id, UserId: user });
    const dto: createAdminDTO = {
      roleGiver: admin,
      roleReceiver: user,
    }
    return this.httpClient.put<string>(`${hostIp}:3000/chat/${id}/add/admin`, dto, { withCredentials: true, });
  }
  getUserMessages(user: string) {
    return this.httpClient.get<string>(hostIp + `:3000/message/user/${user}`);
  }
  kickuser(chatID: number, admin: string, user: string) {
    return this.httpClient.delete(hostIp + `:3000/chat/delete/${chatID}/admin/${admin}/user/${user}`, { withCredentials: true, });
  }
  // update/:chatID/admin
  updateChatroom_(id: number, user: string, dto: UpdateChatroomDTO) {
    return this.httpClient.put<UpdateChatroomDTO>(hostIp + `:3000/chat/update/${id}/admin/${user}`, dto, { withCredentials: true, });
  }

  updateChatroom(id: number, dto: UpdateChatroomDTO) {
    return this.httpClient.put<UpdateChatroomDTO>(hostIp + `:3000/chat/update/${id}/admin`, dto, { withCredentials: true, });
  }
  checkPunishment(id: number, user: string, type: string) {
    return this.httpClient.get(hostIp + `:3000/punishment/chat/${id}/user/${user}/${type}`, { withCredentials: true, })
  }

  getChatroomMessagesnyName(chatname: string) {
    return this.httpClient.get(hostIp + `:3000/punishment/chat/all/${chatname}`, { withCredentials: true, })
  }

  getInvitesForMe() {
    return this.httpClient.get(hostIp + `:3000/chat/invites`, { withCredentials: true, })
  }
  myRole(id: number) {
    return this.httpClient.get(hostIp + `:3000/chat/myRole/${id}`, { withCredentials: true, })
  }

  getSeenCount(id: number) {
    return this.httpClient.get(hostIp + `:3000/chat/MyCount/${id}`, { withCredentials: true, })
  }
  getChatroomsByname(ChannelName: string) {
    return this.httpClient.get(hostIp + `:3000/chat/findbyName/${ChannelName}`, { withCredentials: true, })
  }

  getInvitedFriends(id: number, userid: number) {
    return this.httpClient.get(hostIp + `:3000/chat/findingInvitedonce/${id}/${userid}`, { withCredentials: true });
  }
  GoForSeen(someId: number, isChat: boolean) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return;
    }
    this.sock.emit('Seen', { chatID: someId, isRoom: isChat });
  }
  updateMsh(id: number) {
    if (this.toctoc != this.cookieService.get(tokenName)) {
      this.switchRouter.navigateByUrl('');
      return;
    }
    this.sock.emit("updateMembersTime", { chatID: id });
  }
}
