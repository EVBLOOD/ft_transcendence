import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private currentUser: string = "ali";
  private message: string = "";
  private sock: Socket;
  private PunishmentSock: Socket;
  constructor(private httpClient: HttpClient
  ) {
    this.PunishmentSock = io(URL + "/punishment", {
      withCredentials: true,
    });
    this.sock = io('http://10.13.4.8:3000/chat', {
      withCredentials: true,
    });
    this.sock.on(
      'recMessage', (data) => {
        // this.message = data.value;
        // console.log("user: ", data.userId.userName);
        // if (this.currentUser !== data.userId.userName)
        //   console.log(data.userId.userName + ": " + this.message);
        console.log(data)
      }
    );
    this.sock.on("kickUser", (data) => {
      console.log("kicked user: " + data.userName);
    });
    this.PunishmentSock.on("gotBanned", (data) => {
      console.log(data);
    })
  }

  getThisChat(id: number) {
    return this.httpClient.get(`http://10.13.4.8:3000/chat/find/` + id, { withCredentials: true, })

  }

  getDmMessages(id: number) {
    console.log('alo fin')
    return this.httpClient.get<any>(URL + `/chat/DM/${id}`, { withCredentials: true, });
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

  sendMessage(message: sendMessageDTO, type: boolean) {
    // console.log("message DTO", message);
    this.sock.emit("sendMessage", { type: type, message: message });
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
  leaveChatroom(id: number, name: string) {
    return this.httpClient.delete(URL + `/chat/leave/${id}/user/${name}`)
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

}
