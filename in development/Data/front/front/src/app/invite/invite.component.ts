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
  channelInfos$ !: Observable<any>;

  constructor(private readonly profile: ProfileService, private readonly chatRoom: ChatService,
    private readonly routeSwitcher: Router, private readonly activeOne: ActivatedRoute, private readonly invites: ChatService) {
    if (this.activeOne.snapshot.params['id'] && !this.activeOne.snapshot.params['id']?.match(/^[0-9]*$/))
      this.routeSwitcher.navigateByUrl('/chat')
    this.channelInfos$ = this.invites.getChatroomByID(this.activeOne.snapshot.params['id']);
  }
  onClickInvite(id: number) {
    this.invited = !this.invited;
  }
  ngOnInit(): void {
    this.profiles$ = this.chatRoom.inviteList(this.activeOne.snapshot.params['id']);
  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
  close() {
    this.routeSwitcher.navigateByUrl('/chat/' + this.activeOne.snapshot.params['id'])
  }

}
