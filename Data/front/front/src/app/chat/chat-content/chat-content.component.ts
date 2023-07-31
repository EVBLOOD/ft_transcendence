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
  private removeSub: any;
  private removeSub_: any;
  private removeSub__: any;

  constructor(private readonly switchRoute: Router, private readonly route: ActivatedRoute, private readonly chatService: ChatService, private readonly authService: AuthService) {
  }

  ngOnInit(): void {
    this.messages = []
    this.removeSub = this.route.params.subscribe(params => {
      this.messages = []
      if (params['id']) {
        this.setupComponent(params['id']);
        if (this.oldStatus.id > 0)
          this.chatService.leaveChatroom(this.oldStatus.id.toString())
        this.chatService.joinSocket(params['id']); // leave before joinig!
      }
      else if (params['username']) {
        this.setupComponent(params['username'])
        if (this.oldStatus.id > 0)
          this.chatService.leaveChatroom(this.oldStatus.id.toString())
        this.isRoom = false;
      }
      this.chatService.updateMembership.subscribe((data) => {
        if (this.id == data.chatID) {
          this.setupComponent(0);
          this.setupComponent(params['id']);
        }
      })
    })
    this.removeSub_ = this.chatService.getUpdate().subscribe((data: any) => {
      console.log(data)
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

    this.removeSub__ = this.chatService.getCloseOrNot().subscribe((data: any) => {
      if (data.chatID && data.chatID == this.id && this.isRoom)
        this.switchRoute.navigateByUrl('');
    })
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
    console.log("END")
    this.messages = []
    if (this.removeSub)
      this.removeSub.unsubscribe()
    if (this.removeSub_)
      this.removeSub_.unsubscribe()
    if (this.removeSub__)
      this.removeSub__.unsubscribe()
    this.messages = [];
  }

}
