import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

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

}
