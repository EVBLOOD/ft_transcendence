import { Component, Input, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-invited-friend',
  templateUrl: './invited-friend.component.html',
  styleUrls: ['./invited-friend.component.scss']
})
export class InvitedFriendComponent implements OnDestroy {
  @Input() invite: any;

  constructor(private readonly chatService: ChatService) { }

  invited = false;
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();
  onClickInvite() {
    this.invited = !this.invited;
    this.cancel = !this.cancel;
    this.removesubsc = this.chatService.Acceptinvite(this.invite.chat.id, this.invite.user.id).subscribe(() => { });
    this.SubArray.push(this.removesubsc)
  }

  cancel = false;
  onClickCancel() {
    this.cancel = !this.cancel;
    this.removesubsc = this.chatService.Cancelinvite(this.invite.chat.id, this.invite.user.id).subscribe(() => { });
    this.SubArray.push(this.removesubsc)
  }
  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
}
