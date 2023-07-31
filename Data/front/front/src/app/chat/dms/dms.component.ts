import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DMsComponent implements OnInit, OnDestroy {
  clickFriend = false;
  // userFriend$!: Observable<any>;
  id !: number;
  count !: number;
  @Input() user: any = null;
  constructor(private readonly switchRouter: Router, private readonly profile: ProfileService, private readonly state: StatusService, private readonly chatService: ChatService) {
  }
  status: string = 'Offline';
  // unsubscribe
  replay: any;
  replay_: any;
  ngOnDestroy(): void {
    if (this.replay)
      this.replay.unsubscribe()
    if (this.replay_)
      this.replay_.unsubscribe()
  }

  ngOnInit(): void {
    this.replay_ = this.chatService.getSeenCount(this.user?.id).subscribe((data: any) => { this.count = data?.notSeen });
  }
  statusLoading(id: any) {
    this.replay = this.state.current_status.subscribe((curr: any) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
  }
  onClickFriend() {
    // if () // no chats ->
    this.switchRouter.navigateByUrl('/chat/dm/' + this.user.id)
    this.clickFriend = !this.clickFriend;
  }

  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
}
