import { Component, OnInit } from '@angular/core';
import { ChatService, addUserDTO, createChatroom } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private readonly ChatService: ChatService) {
  }
  userChatRooms = new Array<any>;
  ngOnInit(): void {
  }
  getUserChatrooms(name: string) {
    console.log("name" , name);
    return this.ChatService.getChatrooms(name).subscribe({ next: (data) => {this.userChatRooms = []; this.userChatRooms.push(data)}, error: (err) => console.log(err) });
  }
  printChatrooms() {
    console.log(this.userChatRooms);
  }
  addUser(name: string) {
    const user: addUserDTO = {
      userName: name,
    }
    return this.ChatService.addUser(user).subscribe({next: ()=> console.log(`user ${user} created`), error: (err)=>{console.log(err)}});
  }
  createChatroom(name: string, type: string, password: string, user: string, otherUser: string) {
    const chat: createChatroom = {
      type: type,
      chatroomName: name,
      password: password,
      user: user,
      otherUser: otherUser
    };
    console.log(chat)
    return this.ChatService.joinChatroom(chat).subscribe({next: (data ) => {console.log(data)}});
  }

  sendMessage() {
    this.ChatService.sendMessage({ userName: 'ali', value:"Hello", charRoomId: 1})
  }
  getChatroomMessages() {
    return this.ChatService.getChatroomMessages().subscribe({next: (data ) => {console.log(data)}});
  }
  getUser() {
    return this.ChatService.getUser().subscribe({next: (data) => console.log(data), error: (err) => console.log(err)})
  }
  addUserToChatRoom(id: string, user: string, password: string) {
    return this.ChatService.addUserToChatRoom(id, user, password).subscribe({next: (data) => console.log(data), error: (err) => console.log(err)})
  }
  addAdminToChatRoom(id: string, admin: string, user: string) {
    return this.ChatService.addAdminToChatRoom(id, admin, user).subscribe({next: (data) => console.log(data), error: (err) => console.log(err)})
  }

}
