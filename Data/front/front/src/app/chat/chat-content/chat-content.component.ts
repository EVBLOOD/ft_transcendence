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
  id !: number;
  isRoom: boolean = true;
  chatMsgs$ !: Observable<any>;
  chatMembers$ !: Observable<any>;
  chatInfos$ !: Observable<any>;
  messages: Array<any> = [];
  constructor(private readonly switchRoute: Router, private readonly route: ActivatedRoute, private readonly chatService: ChatService, private readonly authService: AuthService) {
  }

  ngOnInit(): void {
    this.messages = []
    this.route.params.subscribe(params => {
      this.messages = []
      if (params['id']) {
        this.setupComponent(params['id']);
        this.chatService.joinSocket(params['id']);
      }
      else if (params['username']) {
        this.setupComponent(params['username'])
        this.isRoom = false;
      }
      else
        this.setupComponent(params['username'])
    })
    this.chatService.getUpdate().subscribe((data) => {
      console.log(data)
      console.log(data.sender)
      if (data?.mgs?.chatRoomId?.type == 'DM' && data.sender == this.id) {
        if (data?.mgs?.userId?.id == data.sender)
          console.log("One")
        else
          console.log("Two")
        this.messages.push(data.mgs)
      }
      else if (this.id == data?.mgs?.chatRoomId?.id) {
        this.messages.push(data.mgs)

      }
    })
  }
  setupComponent(someParam: any) { // TODO : messages deleting once the work is done 
    if (someParam && !someParam.match(/^[0-9]*$/))
      this.switchRoute.navigateByUrl('/chat')
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
  }

}
