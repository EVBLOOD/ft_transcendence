import { Component } from '@angular/core';

@Component({
  selector: 'app-joining-channel',
  templateUrl: './joining-channel.component.html',
  styleUrls: ['./joining-channel.component.scss']
})
export class JoiningChannelComponent {
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

}
