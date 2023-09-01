import { Component, OnDestroy } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joining-channel',
  templateUrl: './joining-channel.component.html',
  styleUrls: ['./joining-channel.component.scss']
})
export class JoiningChannelComponent implements OnDestroy {

  ChannelName = new FormControl('', [Validators.required,]);
  ChannelPassword = new FormControl('', [Validators.required,]);

  invites$!: Observable<any>;
  constructor(private readonly ChannelService: ChatService, private readonly switchRoute: Router) {
    this.invites$ = this.ChannelService.getInvitesForMe();
  }

  secretToggle = false;
  clickSecretChannel() {
    this.secretToggle = !this.secretToggle;
  }

  close() {
    this.switchRoute.navigateByUrl('/chat');
  }

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();
  error = 0;
  JoinIt() {
    if (!this.ChannelName.value || !this.ChannelName.value?.length)
      return;
    if (!this.secretToggle) {
      this.removesubsc = this.ChannelService.JoiningChatRoom({
        type: 'public', chatroomName: this.ChannelName.value,
        password: '', user: '', otherUser: ''
      }).subscribe((data: any) => { data?.chatID ? (this.switchRoute.navigateByUrl('/chat/' + data?.chatID), this.ChannelService.updateMsh(data?.chatID)) : this.error = 1 });
      this.SubArray.push(this.removesubsc)
    }
    else {
      if (this.ChannelPassword.value?.length) {
        this.removesubsc = this.ChannelService.JoiningChatRoom({
          type: 'protected', chatroomName: this.ChannelName.value,
          password: this.ChannelPassword.value, user: '', otherUser: ''
        }).subscribe((data: any) => { data?.chatID ? (this.switchRoute.navigateByUrl('/chat/' + data?.chatID), this.ChannelService.updateMsh(data?.chatID)) : this.error = 1 });
      }
      this.SubArray.push(this.removesubsc)
    }
  }
  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
}
