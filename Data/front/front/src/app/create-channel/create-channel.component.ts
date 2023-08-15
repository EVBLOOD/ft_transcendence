import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnDestroy {
  public errorCreating = 0;
  constructor(private readonly chatService: ChatService, private readonly switchRouter: Router) { }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
  channelName = new FormControl('', [Validators.required,]);
  password = new FormControl('', [Validators.required,]);
  privateToggle = new FormControl(false);
  secretToggle = new FormControl(false);

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  clickPrivateChannel() {
    this.privateToggle.setValue(!this.privateToggle.value);
  }
  clickSecretChannel() {
    this.secretToggle.setValue(!this.secretToggle.value);
  }

  close() {
    this.switchRouter.navigateByUrl("/chat");
  }

  handler(data: any) {
    data.statusCode ? this.errorCreating = 1 : this.errorCreating = 0;
    if (this.errorCreating == 0)
      this.close()
  }

  submiting() {
    let type = 'public';
    if (this.privateToggle.value && this.secretToggle.value)
      type = 'protected'
    else if (this.privateToggle.value)
      type = 'private'
    if (this.channelName.value?.length && (type != 'protected' || this.password.value?.length)) {
      this.removesubsc = this.chatService.joinChatroom({
        type, chatroomName: this.channelName.value,
        password: this.password.value, user: 'admin', otherUser: ''
      }).subscribe(data => this.handler(data));
      this.SubArray.push(this.removesubsc);
    }
  }

}
