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
  replay: any;
  onClickInvite() {
    this.invited = !this.invited;
    this.cancel = !this.cancel;
    this.replay = this.chatService.Acceptinvite(this.invite.chat.id, this.invite.user.id).subscribe(() => { this.replay.unsubscribe() });
  }

  cancel = false;
  onClickCancel() {
    this.cancel = !this.cancel;
    this.replay = this.chatService.Cancelinvite(this.invite.chat.id, this.invite.user.id).subscribe(() => { this.replay.unsubscribe() });
  }
}
