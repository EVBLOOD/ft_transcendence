import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Observable } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { FriendshipService } from '../profile/friendship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  profiles$ !: Observable<any>;
  invited = false;
  We_are_inviting_you: Array<number> = [];

  constructor(private readonly profile: ProfileService, private readonly friendship: FriendshipService,
    private readonly routeSwitcher: Router, private readonly activeOne: ActivatedRoute, private readonly invites: ChatService) { }
  onClickInvite(id: number) {
    this.invited = !this.invited;
  }
  ngOnInit(): void {
    this.profiles$ = this.friendship.friendList(0, 0);
  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
  close() {
    // setTimeout((UserId) => {
    // this.We_are_inviting_you.map(this.invites.sendIntv(this.activeOne.snapshot.params['id'], UserId));
    // })
    this.routeSwitcher.navigateByUrl('/chat/' + this.activeOne.snapshot.params['id'])
  }
}
