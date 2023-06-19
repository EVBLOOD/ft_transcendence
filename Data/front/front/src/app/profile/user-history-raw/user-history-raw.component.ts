import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-history-raw',
  templateUrl: './user-history-raw.component.html',
  styleUrls: ['./user-history-raw.component.scss']
})
export class UserHistoryRawComponent {
  @Input() data: any;
}
