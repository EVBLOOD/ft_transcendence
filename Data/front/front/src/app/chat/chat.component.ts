import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private readonly ChatService: ChatService) {
  }

  ngOnInit(): void {
  }
  getUserChatrooms() {
    this.ChatService.getChatrooms("ali").subscribe({ next: (data) => { console.log(data) } });
  }
  addUser(user: string) {
    this.ChatService.addUser(user).subscribe({next: ()=> console.log(`user ${user} created`), error: (err)=>{console.log(err)}});
  }
  createChatroom() {
    return this.ChatService.joinChatroom().subscribe({next: (data ) => {console.log(data)}});
  }

  // sendMessage() {
  //   this.ChatService.sendMessage({ userName: 'ali', value:"Hello", charRoomId: 1})
  // }
  getChatroomMessages() {
    return this.ChatService.getChatroomMessages().subscribe({next: (data ) => {console.log(data)}});
  }
}
