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

export class ChatComponent {

  ChatRooms$ !: Observable<any>;
  ChatDMs$ !: Observable<any>;
  listUser$ !: Observable<any>;
  replay: any;

  newText = new FormControl('', [Validators.required,]);

  constructor(private readonly chatService: ChatService, private route: Router, private listUsers: FriendshipService, private readonly state: StatusService) {
    this.ChatRooms$ = this.chatService.getChatrooms();
    this.chatService.getChatrooms().subscribe({
      next: (data) => {
        console.log("ChatRooms")
        console.log(data);
      }
    });
    this.ChatDMs$ = this.chatService.getChatDM();
    this.chatService.getChatDM().subscribe({
      next: (data) => {
        console.log("Chat Dms")
        console.log(data);
      }
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
    this.chatService.joinChatroom({
      type: 'DM', chatroomName: '',
      password: '', user: 'admin', otherUser: ''
    }).subscribe({ next: (data) => { console.log(data) } });
  }
  finding = 0;
  FindextraUsers() {
    if (this.newText.value?.length && this.toggle) {
      this.finding = 1;
      this.ChatDMs$ = this.listUsers.findthem(this.newText.value);
    }
    else if (this.toggle && !this.newText.value?.length) {
      this.finding = 0;
      this.ChatDMs$ = this.chatService.getChatDM();
    }
    else
      this.ChatRooms$ = this.chatService.getChatrooms();


  }


}
