import { Component } from '@angular/core';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent {

  invited = false;
  onClickInvite(){
    this.invited = !this.invited;
  }

}
