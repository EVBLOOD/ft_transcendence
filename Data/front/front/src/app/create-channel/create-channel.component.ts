import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {

  constructor(private readonly chatService: ChatService, private readonly switchRouter: Router) { }


  channelName = new FormControl('', [Validators.required,]);
  password = new FormControl('', [Validators.required,]);
  privateToggle = new FormControl(false);
  secretToggle = new FormControl(false);

  // subscribe
  replay: any;

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
      this.replay = this.chatService.joinChatroom({
        type, chatroomName: this.channelName.value,
        password: this.password.value, user: 'admin', otherUser: ''
      }).subscribe({ next: () => { this.replay.unsubscribe() } });
      this.close()
    }
  }

}
