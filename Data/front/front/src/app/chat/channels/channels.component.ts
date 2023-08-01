import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
  @Input() channel: any;
  constructor(private readonly switchRoute: Router, private readonly chatService: ChatService) {
  }
  openChat(id: number) {
    this.chatService.GoForSeen(id, true);
    this.switchRoute.navigateByUrl("/chat/" + id)
  }
}
