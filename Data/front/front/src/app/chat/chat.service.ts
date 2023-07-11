import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

type createChatroom  = {
  type: string;
  chatroomName: string;
  password: string | null;
  user: string;
  otherUser: string;
};


type sendMessageDTO = {
  userName: string;
  value: string;
  charRoomId: number;
};

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
    return  this.httpClient.get(`http://localhost:3000/chat/user/${name}`)
  }
  joinChatroom() {
    const input: createChatroom = {
      type: "public",
      chatroomName: "room#1",
      password: null,
      user: "ali",
      otherUser: "saad"
    }
    return  this.httpClient.post(`http://localhost:3000/chat/create`, input);
  }

  // sendMessage(message: sendMessageDTO) {
  //   this.sock.emit("sendMessage", message);
  // }
  getChatroomMessages() {
    return this.httpClient.get('http://localhost:3000/chat/1/messages');
  }
  addUser(user: string) {
    return this.httpClient.post(`http://localhost:3000/user`, {userName: user});
  }

}
