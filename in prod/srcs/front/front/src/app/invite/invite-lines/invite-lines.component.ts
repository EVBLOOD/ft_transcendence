import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-invite-lines',
  templateUrl: './invite-lines.component.html',
  styleUrls: ['./invite-lines.component.scss']
})
export class InviteLinesComponent implements OnInit, OnDestroy {

  invited: number = 0;
  areyouHere$ !: Observable<any>;
  @Input() user: any;
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(private readonly profile: ProfileService, private readonly activeOne: ActivatedRoute, private readonly chatService: ChatService) {
  }
  ngOnInit(): void {
    this.areyouHere$ = this.chatService.getInvitedFriends(this.activeOne.snapshot.params['id'], this.user.id);
  }

  onClickInvite(id: number) {
    this.invited = 1;
    this.removesubsc = this.chatService.Sendinvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe(() => { });
    this.SubArray.push(this.removesubsc)
  }
  onClickInviteCancel(id: number) {
    this.invited = 2;
    this.removesubsc = this.chatService.removeInvite(this.activeOne.snapshot.params['id'], this.user.id).subscribe(() => { });
    this.SubArray.push(this.removesubsc)
  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
}
