import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  Chatrooms$: Observable<any | undefined> ;
  constructor ( private readonly playerService: ChatService) {
    // this.Chatrooms$ = this.playerService.getChatrooms();
  }

  ngOnInit(): void {
    this.Chatrooms$ = this.playerService.getChatrooms("ali");
  }
}
