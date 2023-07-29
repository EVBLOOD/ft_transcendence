import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/chat/chat.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-invite-lines',
  templateUrl: './invite-lines.component.html',
  styleUrls: ['./invite-lines.component.scss']
})
export class InviteLinesComponent {

  invited = false;
  @Input() user: any;

  constructor(private readonly profile: ProfileService, private readonly activeOne: ActivatedRoute, private readonly chatService: ChatService) { }
  onClickInvite(id: number) {
    this.invited = !this.invited;
    if (this.invited)
      this.chatService.Sendinvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe((data) => { console.log(data) });
    else
      this.chatService.Cancelinvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe((data) => { console.log(data) });
  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
}
