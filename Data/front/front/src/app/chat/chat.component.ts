import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { FormControl, Validators } from '@angular/forms';
import { FriendshipService } from '../profile/friendship.service';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms', style({ opacity: 0 }))])
    ])
  ]
})

export class ChatComponent implements OnDestroy {

  ChatRooms$ !: Observable<any>;
  ChatDMs$ !: Observable<any>;
  listUser$ !: Observable<any>;
  replay: any;
  // subsc
  private removesubsc: any;
  private removesubsc_: any;
  private removesubsc__: any;
  ngOnDestroy() {
    if (this.removesubsc)
      this.removesubsc.unsubscribe()
    if (this.removesubsc_)
      this.removesubsc_.unsubscribe()
  }
  newText = new FormControl('', [Validators.required,]);

  constructor(private readonly chatService: ChatService, private route: Router, private listUsers: FriendshipService) {
    this.ChatRooms$ = this.chatService.getChatrooms();
    this.ChatDMs$ = this.chatService.getChatDM();
    this.removesubsc = this.chatService.updatePrivates.subscribe(() => {
      if (!this.newText.value?.length) {
        this.finding = 0;
        this.ChatDMs$ = this.chatService.getChatDM();
      }
    });
    this.removesubsc_ = this.chatService.updateChannels.subscribe(() => {
      if (!this.newText.value?.length)
        this.ChatRooms$ = this.chatService.getChatrooms();
    });
  }

  getStarterPath(path: string) {
    return this.route.url.startsWith(path);
  }
  @ViewChild('dropDownChannelRef') dropDownChannelRef !: ElementRef;
  @ViewChild('dropDownChannelRef_') dropDownChannelRef_ !: ElementRef;
  @ViewChild('dropDownChannelRef__') dropDownChannelRef__ !: ElementRef;
  @ViewChild('dropDownUserRef') dropDownUserRef !: ElementRef;

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownChannelRef?.nativeElement && clickedElement !== this.dropDownChannelRef_?.nativeElement
      && clickedElement !== this.dropDownChannelRef__?.nativeElement && clickedElement !== this.dropDownUserRef?.nativeElement) {
      this.dropDownChannel = false;
      this.dropDownUser = false;
    }
  }

  toggle = true
  SwitchChat() {
    this.toggle = !this.toggle
  }

  dropDownChannel = false;
  onclickThreePointChannel() {
    this.dropDownChannel = !this.dropDownChannel
  }

  dropDownUser = false;
  onclickDropDownClick() {
    this.dropDownUser = !this.dropDownUser;
  }

  clickFriend = false;
  onClickFriend() {
    this.clickFriend = !this.clickFriend;
  }

  createDM() {
    this.removesubsc__ = this.chatService.joinChatroom({
      type: 'DM', chatroomName: '',
      password: '', user: 'admin', otherUser: ''
    }).subscribe({ next: () => { this.removesubsc__.unsubscribe() } });
  }
  finding = 0;
  FindextraUsers($event: KeyboardEvent) {
    if ($event.code != 'Enter' && $event.code != 'NumpadEnter')
      return;
    if (this.newText.value?.length && this.toggle) {
      this.finding = 1;
      this.ChatDMs$ = this.listUsers.findthem(this.newText.value);
    }
    else if (this.toggle && !this.newText.value?.length) {
      this.finding = 0;
      this.ChatDMs$ = this.chatService.getChatDM();
    }
    else if (this.newText.value?.length)
      this.ChatRooms$ = this.chatService.getChatroomsByname(this.newText.value);
    else
      this.ChatRooms$ = this.chatService.getChatrooms();
  }


}
