import { Component } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-joining-channel',
  templateUrl: './joining-channel.component.html',
  styleUrls: ['./joining-channel.component.scss']
})
export class JoiningChannelComponent {

  ChannelName = new FormControl('', [Validators.required,]);
  ChannelPassword = new FormControl('', [Validators.required,]);

  invites$!: Observable<any>;
  constructor(private readonly ChannelService: ChatService) {
    this.invites$ = this.ChannelService.getInvitesForMe();
  }

  secretToggle = false;
  clickSecretChannel() {
    this.secretToggle = !this.secretToggle;
  }

  invited = false;
  onClickInvite() {
    this.invited = !this.invited;
  }

  cancel = false;
  onClickCancel() {
    this.cancel = !this.cancel;
  }

  JoinIt() {
    if (!this.ChannelName.value || !this.ChannelName.value?.length)
      return;
    if (!this.secretToggle) {
      this.ChannelService.JoiningChatRoom({
        type: 'public', chatroomName: this.ChannelName.value,
        password: '', user: '', otherUser: ''
      }).subscribe({ next: (data: any) => { console.log(data) } });
      console.log('this is a public channel')
    }
    else {
      if (this.ChannelPassword.value?.length) {
        this.ChannelService.JoiningChatRoom({
          type: 'protected', chatroomName: this.ChannelName.value,
          password: this.ChannelPassword.value, user: '', otherUser: ''
        }).subscribe({ next: (data: any) => { console.log(data) } });
      }
      console.log('this is a secret channel')
    }
  }

}
