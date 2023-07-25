import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss'],

})
export class ChatContentComponent implements OnInit {
  // @Input() toggle: boolean = false;
  id !: number;
  isRoom: boolean = true;
  chatMsgs$ !: Observable<any>;
  chatMembers$ !: Observable<any>;
  chatInfos$ !: Observable<any>;
  messages: Array<any> = new Array<any>();
  constructor(private readonly switchRoute: Router, private readonly route: ActivatedRoute, private readonly chatService: ChatService, private readonly authService: AuthService) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params['id'])
        this.setupComponent(params['id']);
      else if (params['username']) {
        this.setupComponent(params['username'])
        this.isRoom = false;
      }
      else
        this.setupComponent(params['username'])
    })
    this.chatService.getUpdate().subscribe((data) => {
      if (data?.mgs?.chatRoomId?.type == 'DM' && (data?.mgs?.userId?.id == data.sender || data?.mgs?.userId?.id == this.id)) {
        this.messages.push(data.mgs)
      }
    })
  }
  setupComponent(someParam: any) {
    if (someParam && !someParam.match(/^[0-9]*$/))
      this.switchRoute.navigateByUrl('/chat')
    this.isRoom = true;
    this.id = parseInt(someParam)
    this.chatInfos$ = this.chatService.getThisChat(this.id);
    this.chatMsgs$ = this.chatService.getChatroomMessages(this.id);
    // this.chatMembers$ = getmembers
  }

}
