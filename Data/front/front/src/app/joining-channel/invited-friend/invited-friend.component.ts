import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-invited-friend',
  templateUrl: './invited-friend.component.html',
  styleUrls: ['./invited-friend.component.scss']
})
export class InvitedFriendComponent {
  @Input() invite: any;

  constructor(private readonly chatService: ChatService) { }

  invited = false;
  onClickInvite() {
    this.invited = !this.invited;
    this.cancel = !this.cancel;
    this.chatService.Acceptinvite(this.invite.chat.id, this.invite.user.id).subscribe((data) => { console.log(data) });
  }

  cancel = false;
  onClickCancel() {
    this.cancel = !this.cancel;
    this.chatService.Cancelinvite(this.invite.chat.id, this.invite.user.id).subscribe((data) => { console.log(data) });

  }
}
