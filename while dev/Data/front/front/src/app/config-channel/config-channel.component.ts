import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-config-channel',
  templateUrl: './config-channel.component.html',
  styleUrls: ['./config-channel.component.scss']
})
export class ConfigChannelComponent implements OnDestroy {

  channelName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  privateToggle = new FormControl(false);
  secretToggle = new FormControl(false);
  channelId !: string;
  channelInfos: any;
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(private readonly chatService: ChatService, private readonly switchRouter: Router, private route: ActivatedRoute,) {
    this.channelId = this.route.snapshot.params['id'];
    if (this.channelId && !this.channelId?.match(/^[0-9]*$/))
      this.switchRouter.navigateByUrl('/chat')
  }


  clickPrivateChannel() {
    this.privateToggle.setValue(!this.privateToggle.value);
  }
  clickSecretChannel() {
    this.secretToggle.setValue(!this.secretToggle.value);
  }

  close() {
    this.switchRouter.navigateByUrl("/chat");
  }

  submiting() {
    let type = 'public';
    if (this.privateToggle.value && this.secretToggle.value)
      type = 'protected'
    else if (this.privateToggle.value)
      type = 'private'
    if (this.channelName.value?.length && (type != 'protected' || this.password.value?.length)) {
      this.removesubsc = this.chatService.updateChatroom(parseInt(this.channelId),
        {
          newType: type,
          newPassword: this.password.value || '', newChatroomName: this.channelName.value
        }).subscribe({ next: () => { } });
      this.SubArray.push(this.removesubsc)
      this.close()
    }
  }
  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
}

