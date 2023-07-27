import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';

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
export class MessagesMdlComponent implements OnChanges, OnInit {
  @Input() isRoom: boolean = false;
  @Input() id!: number; // switched to type chat
  @Input() chatInfos: any;
  @Input() messages: any = [];
  msgs$ !: Observable<any>;
  user$ !: Observable<any>;
  @ViewChild('dropDownChannelRef') dropDownChannelRef !: ElementRef;
  @ViewChild('dropDownChannelRef_') dropDownChannelRef_ !: ElementRef;
  @ViewChild('dropDownChannelRef__') dropDownChannelRef__ !: ElementRef;
  // @ViewChild('scrolling') scrolling!: ElementRef;
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
  constructor(private readonly chatService: ChatService, private readonly profileUser: ProfileService, private readonly state: StatusService) {
  }
  replay: any;
  status: string = 'Offline';

  statusLoading(id: any) {
    this.replay = this.state.current_status.subscribe((curr: any) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
  }
  avatring(url: string) {
    return this.profileUser.getUserAvatarPath(url);
  }
  ngOnInit(): void {
    // this.scroll.nativeElement.scrollTop = this.scroll?.nativeElement.scrollHeight;
    // this.scrolling.nativeElement.scroll({ bottom: this.scrolling.nativeElement.scrollHeight, left: 0, behavior: 'smooth' })
    // setTimeout(this.scrolling.nativeElement.scroll({ top: this.scrolling.nativeElement.scrollHeight, left: 0, behavior: 'smooth' }))

  }

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

    // this.scroll.nativeElement.scrollTop = this.scroll?.nativeElement.scrollHeight;
    // this.scroll.nativeElement.scrollTo(this.scroll.nativeElement.scrollHeight, 0);

    console.log(this.messages)
    // this.scrolling.nativeElement.scroll({ top: this.scrolling.nativeElement.scrollHeight, left: 0, behavior: 'smooth' })
    if (this.id && this.isRoom)
      this.msgs$ = this.chatService.getChatroomMessages(this.id)

    else if (!this.isRoom && this.id) {
      // this.messages = new Array();
      this.user$ = this.profileUser.getUserData(this.id.toString())
      this.msgs$ = this.chatService.getDmMessages(this.id);
      // this.chatService.
    }
    // setTimeout(this.scrolling.nativeElement.scroll({ bottom: this.scrolling.nativeElement.scrollHeight, left: 0, behavior: 'smooth' }))
    // this.chatService
  }

}
