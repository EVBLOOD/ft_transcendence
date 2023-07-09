import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const users: Array<string> = ["ali", "saad"];

type createChatroom  = {
  type: string;
  chatroomName: string;
  password: string | null;
  user: string;
  otherUser: string;
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient
  ) { }
    // const socket: Socket
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


}
