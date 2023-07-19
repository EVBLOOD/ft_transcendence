import { Component, Input } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-user-history-raw',
  templateUrl: './user-history-raw.component.html',
  styleUrls: ['./user-history-raw.component.scss']
})
export class UserHistoryRawComponent {
  @Input() item: any;
  constructor(public profile: ProfileService) { }
}
