import { Component, Input } from '@angular/core';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-leader-bord-row',
  templateUrl: './leader-bord-row.component.html',
  styleUrls: ['./leader-bord-row.component.scss']
})
export class LeaderBordRowComponent {
  @Input() data: any;
  @Input() index !: number;

  constructor(private profile: ProfileService) {
  }

  avataring(url: string) {
    return this.profile.getUserAvatarPath(url)
  }
}
