import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-invite-lines',
  templateUrl: './invite-lines.component.html',
  styleUrls: ['./invite-lines.component.scss']
})
export class InviteLinesComponent implements OnInit {

  invited: number = 0;
  areyouHere$ !: Observable<any>;
  @Input() user: any;

  constructor(private readonly profile: ProfileService, private readonly activeOne: ActivatedRoute, private readonly chatService: ChatService) {
  }
  ngOnInit(): void {
    console.log(this.user.id)
    this.areyouHere$ = this.chatService.getInvitedFriends(this.activeOne.snapshot.params['id'], this.user.id);
  }

  onClickInvite(id: number) {
    this.invited = 1;
    this.chatService.Sendinvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe((data) => { console.log(data) });
  }
  onClickInviteCancel(id: number) {
    this.invited = 2;
    this.chatService.removeInvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe((data) => { console.log(data) });
  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
}
