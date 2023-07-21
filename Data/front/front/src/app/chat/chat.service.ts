import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

const URL = "http://localhost:3000";

export type createChatroom  = {
  type: string;
  chatroomName: string;
  password: string | null;
  user: string;
  otherUser: string;
};
type createAdminDTO  = {
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
  userName: string;
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
    this.sock = io('http://localhost:3000/chat', {
      withCredentials: true,
    });
    this.sock.on(
      'recMessage', (data) =>  {
        this.message = data.value;
        console.log( "user: ",data.userId.userName);
        if (this.currentUser !== data.userId.userName)
          console.log(data.userId.userName + ": " + this.message);
        // console.log(data.value)
      }
    );
    this.sock.on("kickUser", (data)=> {
      console.log("kicked user: " + data.userName);
    });
    this.PunishmentSock.on("gotBanned", (data) => {
      console.log(data);
    })
   }
  getChatrooms(name: string) {
    return  this.httpClient.get<string>(`http://localhost:3000/chat/user/${name}`)
  }
  joinChatroom(chat: createChatroom) {
    return  this.httpClient.post(`http://localhost:3000/chat/create`, chat);
  }

  sendMessage(message: sendMessageDTO) {
    console.log("message DTO", message);
    this.sock.emit("sendMessage", message);
  }
  getChatroomMessages(id: number) {
    return this.httpClient.get<number>(URL + `/chat/${id}/messages`);
  }
  addUser(user: addUserDTO) {
    return this.httpClient.post<addUserDTO>(`http://localhost:3000/user`, user);
  }
  getUser() {
    return this.httpClient.get("http://localhost:3000/user")
  }
  addUserToChatRoom(id: string, user: string, password: string) {
    const dto: createMemberDTO = {
      member: user,
      password: password,
    }
    console.log("dto", dto, "id == ", id);
    return this.httpClient.put<string>(`http://localhost:3000/chat/${id}/add/member`, dto);
  }
  addAdminToChatRoom(id: string, admin: string, user: string) {
    const dto: createAdminDTO = {
      roleGiver: admin,
      roleReceiver: user,
    }
    console.log("dto", dto, "id == ", id);
    return this.httpClient.put<string>(`http://localhost:3000/chat/${id}/add/admin`, dto);
  }
  getUserMessages (user: string ) {
    return this.httpClient.get<string>(URL + `/message/user/${user}`);
  }
  kickuser(chatID: number, admin: string, user: string) {
    return this.httpClient.delete(URL + `/chat/delete/${chatID}/admin/${admin}/user/${user}`);
  }
  leaveChatroom(id: number, name: string) {
    return this.httpClient.delete(URL + `/chat/leave/${id}/user/${name}`)
  }
  updateChatroom(id: number, user: string, dto: UpdateChatroomDTO) {
    return this.httpClient.put<UpdateChatroomDTO>(URL + `/chat/update/${id}/admin/${user}`, dto);
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
    return this.httpClient.get(URL + `/punishment/chat/${id}/user/${user}/${type}`)
  }

}
