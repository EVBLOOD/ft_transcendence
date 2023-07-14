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

type sendMessageDTO = {
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

  private sock: Socket;
  constructor(private httpClient: HttpClient
  ) {
    this.sock = io('http://localhost:3000/chat', {
      withCredentials: true,
    });
   }
  getChatrooms(name: string) {
    return  this.httpClient.get<string>(`http://localhost:3000/chat/user/${name}`)
  }
  joinChatroom(chat: createChatroom) {
    return  this.httpClient.post(`http://localhost:3000/chat/create`, chat);
  }

  sendMessage(message: sendMessageDTO) {
    this.sock.emit("sendMessage", message);
  }
  getChatroomMessages() {
    return this.httpClient.get('http://localhost:3000/chat/1/messages');
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
}
