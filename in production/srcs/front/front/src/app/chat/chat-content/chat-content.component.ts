import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss'],

})
export class ChatContentComponent implements OnInit, OnChanges, OnDestroy {
  // @Input() toggle: boolean = false;
  id: number = -1;
  oldStatus = { id: -1, Channel: true };
  isRoom: boolean = true;
  chatMsgs$ !: Observable<any>;
  chatMembers$ !: Observable<any>;
  chatInfos$ !: Observable<any>;
  messages: Array<any> = [];

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(private readonly switchRoute: Router, private readonly route: ActivatedRoute,
    private readonly chatService: ChatService, private readonly authService: AuthService) {
  }

  ngOnInit(): void {
    this.messages = []
    this.removesubsc = this.route.params.subscribe(params => {
      this.messages = []
      if (params['id']) {
        this.setupComponent(params['id']);
        if (this.oldStatus.id > 0 && this.oldStatus.Channel)
          this.chatService.leaveSocket(this.oldStatus.id.toString())
        this.chatService.joinSocket(params['id']);
      }
      else if (params['username']) {
        this.setupComponent(params['username'])
        if (this.oldStatus.id > 0 && this.oldStatus.Channel)
          this.chatService.leaveSocket(this.oldStatus.id.toString())
        this.isRoom = false;
      }
      this.removesubsc = this.chatService.updateMembership.subscribe((data) => {
        if (this.id == data.chatID && this.isRoom)
          this.chatInfos$ = this.chatService.getThisChat(this.id);
      })
      this.SubArray.push(this.removesubsc)
    })
    this.SubArray.push(this.removesubsc)

    this.removesubsc = this.chatService.getUpdate().subscribe((data: any) => {
      if (this.id)
        if (data.type == 'direct' && data.sender == this.id) {
          data.mgs.sender = data?.profile;
          this.messages.push(data.mgs)
        }
        else if (this.id == data?.mgs?.chat_id) {
          data.mgs.sender = data?.profile;
          this.messages.push(data.mgs)
        }
    })
    this.SubArray.push(this.removesubsc)

    this.removesubsc = this.chatService.getCloseOrNot().subscribe((data: any) => {
      if (data.chatID && data.chatID == this.id && this.isRoom)
        this.switchRoute.navigateByUrl('');
    })
    this.SubArray.push(this.removesubsc)
  }
  setupComponent(someParam: any) {
    if (someParam && !someParam.match(/^[0-9]*$/))
      this.switchRoute.navigateByUrl('/chat')
    this.oldStatus.Channel = this.isRoom;
    this.oldStatus.id = this.id;
    this.isRoom = true;
    this.id = parseInt(someParam)
    this.chatInfos$ = this.chatService.getThisChat(this.id);
    this.chatMsgs$ = this.chatService.getChatroomMessages(this.id);
    this.messages = []
  }
  ngOnChanges(): void {
    this.messages = [];
  }
  ngOnDestroy(): void {
    this.SubArray.forEach((subsc) => {
      subsc?.unsubscribe()
    })
    this.messages = [];
  }

}
