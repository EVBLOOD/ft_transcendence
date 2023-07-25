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
  status: string = 'Offline';
  // constructor(private readonly chatService : ChatService) {}

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
  // replay: any;
  // status: string = 'Offline';
  // , private readonly state: StatusService
  // statusLoading(id: any) {
  //   this.replay = this.state.current_status.subscribe((curr) => {
  //     const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
  //     if (newone)
  //       return this.status = newone.status;
  //     else
  //       this.status = 'Offline'
  //   });
  // }
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

  friends = [
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: true, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: true, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: true, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: true, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: true, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false, notifs: '5' },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false },
    { name: 'karim idbouhouch', avatar: '/assets/img/profile.jpeg', status: false, notifs: '5' },
  ]

  channels = [
    { name: 'Annoncement', notifs: '4' },
    { name: 'General', notifs: '9' },
    { name: 'Music', notifs: '8' },
    { name: 'Random', notifs: '40' },
  ]


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
  FindextraUsers() {
    if (this.newText.value?.length && this.toggle)
      this.ChatDMs$ = this.listUsers.findthem(this.newText.value);
    else if (this.toggle && !this.newText.value?.length)
      this.ChatDMs$ = this.chatService.getChatDM();
    else if (this.newText.value?.length)
      this.ChatRooms$ = this.chatService.getChatroomMessagesnyName(this.newText.value)
    else
      this.ChatRooms$ = this.chatService.getChatrooms();


  }


}
