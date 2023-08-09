import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-leader-bord-row',
  templateUrl: './leader-bord-row.component.html',
  styleUrls: ['./leader-bord-row.component.scss']
})
export class LeaderBordRowComponent {
  @Input()  data: any;
  @Input()  index !: number;
}
