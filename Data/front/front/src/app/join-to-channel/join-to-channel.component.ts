import { Component } from '@angular/core';

@Component({
  selector: 'app-join-to-channel',
  templateUrl: './join-to-channel.component.html',
  styleUrls: ['./join-to-channel.component.scss']
})
export class JoinToChannelComponent {
  secretToggle = false;
  clickSecretChannel(){
    this.secretToggle = !this.secretToggle;
  }

  invited = false;
  onClickInvite(){
    this.invited = !this.invited;
  }

  cancel = false;
  onClickCancel(){
    this.cancel = !this.cancel;
  }

}
