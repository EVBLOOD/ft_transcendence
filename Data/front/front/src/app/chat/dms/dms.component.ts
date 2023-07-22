import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DMsComponent {
  clickFriend = false;
  userFriend$!: Observable<any>;
  id !: number;
  @Input() user: any = null;
  constructor(private readonly switchRouter: Router, private readonly profile: ProfileService) {

  }
  onClickFriend() {
    this.switchRouter.navigateByUrl('/chat/firstone')
    this.clickFriend = !this.clickFriend;
  }

  avataring(url: string) {
    return this.profile.getUserAvatarPath(url);
  }
}
