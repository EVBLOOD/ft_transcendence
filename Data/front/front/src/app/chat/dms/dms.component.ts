import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DMsComponent {
  clickFriend = false;
  userFriend$!: Observable<any>;
  id !: number;
  constructor(private readonly switchRouter: Router) {

  }
  onClickFriend() {
    this.switchRouter.navigateByUrl('/chat/firstone')
    this.clickFriend = !this.clickFriend;
  }
}
