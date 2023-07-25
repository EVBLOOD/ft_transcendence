import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-messages-mdl',
  templateUrl: './messages-mdl.component.html',
  styleUrls: ['./messages-mdl.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms', style({ opacity: 0 }))])
    ])
  ]
})
export class MessagesMdlComponent implements OnChanges {
  @Input() isRoom: boolean = false;
  @Input() id!: number; // switched to type chat
  @Input() chatInfos: any;
  @Input() messages: any = [];
  msgs$ !: Observable<any>;
  user$ !: Observable<any>;
  @ViewChild('dropDownChannelRef') dropDownChannelRef !: ElementRef;
  @ViewChild('dropDownChannelRef_') dropDownChannelRef_ !: ElementRef;
  @ViewChild('dropDownChannelRef__') dropDownChannelRef__ !: ElementRef;
  dropDownChannel = false;
  // messages !: Array<any>;

  onclickThreePointChannel() {
    this.dropDownChannel = !this.dropDownChannel
  }
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownChannelRef?.nativeElement && clickedElement !== this.dropDownChannelRef_?.nativeElement
      && clickedElement !== this.dropDownChannelRef__?.nativeElement) {
      this.dropDownChannel = false;
    }
  }
  constructor(private readonly chatService: ChatService, private readonly profileUser: ProfileService) {
  }

  avatring(url: string) {
    return this.profileUser.getUserAvatarPath(url);
  }
  // ngOnInit(): void {

  // this.chatService.getUpdate().subscribe((data) => {
  //   if (data?.mgs?.chatRoomId?.type == 'DM' && (this.id == data.sender || data?.mgs?.userId?.id == this.id)) {
  //     console.log(data)
  //     console.log("LOL")
  //     console.log(data.msg)
  //     this.messages.push(data.msg)
  //   }
  // })
  // }
  ngOnChanges(): void {
    console.log(this.messages)
    if (this.id && this.isRoom)
      this.msgs$ = this.chatService.getChatroomMessages(this.id)

    else if (!this.isRoom && this.id) {
      // this.messages = new Array();
      this.user$ = this.profileUser.getUserData(this.id.toString())
      this.msgs$ = this.chatService.getDmMessages(this.id);
      // this.chatService.
    }
    // this.chatService
  }

}
