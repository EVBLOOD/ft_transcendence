import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private readonly playerService: ChatService) {
  }

  ngOnInit(): void {
    // this.playerService.getChatrooms("ali").subscribe({ next: (data) => { console.log(data) } });
  }
  getUserChatrooms() {
    this.playerService.getChatrooms("ali").subscribe({ next: (data) => { console.log(data) } });
  }
  createChatroom() {
    return this.playerService.joinChatroom().subscribe({next: (data ) => {console.log(data)}});
  }

}
