import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Observable } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { FriendshipService } from '../profile/friendship.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  profiles$ !: Observable<any>;
  invited = false;

  constructor(private readonly profile: ProfileService, private readonly friendship: FriendshipService,
    private readonly routeSwitcher: Router, private readonly activeOne: ActivatedRoute) { }
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
    this.routeSwitcher.navigateByUrl('/chat/' + this.activeOne.snapshot.params['id'])
  }
}
