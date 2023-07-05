import { Component, Input, OnInit } from '@angular/core';
import { FriendshipService } from '../friendship.service';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-blocked',
  templateUrl: './card-blocked.component.html',
  styleUrls: ['./card-blocked.component.scss']
})

export class CardBlockedComponent implements OnInit {
  @Input() data: any;

  id !: number;
  more : boolean = false;
  otherUser$ !: Observable<any>;


  constructor (private friendship : FriendshipService, private switchRoute: Router,
    readonly profile: ProfileService) {}
  
  ngOnInit()
  {
    this.id = this.data.sender;
    this.otherUser$ = this.profile.getUserData(this.id.toString())
  }

  showMore()
  {
    this.more = !this.more;
  }

  unBlock()
  {
    this.friendship.unblockUser(this.id)
  }
}
