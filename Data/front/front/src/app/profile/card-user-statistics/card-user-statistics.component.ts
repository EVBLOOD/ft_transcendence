import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-user-statistics',
  templateUrl: './card-user-statistics.component.html',
  styleUrls: ['./card-user-statistics.component.scss']
})
export class CardUserStatisticsComponent {
  @Input() data: any;
  @Input() helps: any;
  constructor() {
  }
}
