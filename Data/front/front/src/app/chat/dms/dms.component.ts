import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DMsComponent {
  clickFriend = false;
  // userFriend$!: Observable<any>;
  id !: number;
  @Input() user: any = null;
  constructor(private readonly switchRouter: Router, private readonly profile: ProfileService, private readonly state: StatusService) {

  }
  replay: any;
  status: string = 'Offline';

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
