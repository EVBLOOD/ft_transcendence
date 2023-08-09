import { Component, Input, OnInit } from '@angular/core';
import { FriendshipService } from '../friendship.service';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-request',
  templateUrl: './card-request.component.html',
  styleUrls: ['./card-request.component.scss']
})
export class CardRequestComponent implements OnInit {
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
  

  confirmRequest()
  {
    this.friendship.acceptRequest(this.id);
  }
  deleteRequest()
  {
    this.friendship.cancelFriendRequest(this.id);
  }
  viewProfile()
  {
    this.switchRoute.navigateByUrl('/profile/'+ this.id.toString())
  }
  Block()
  {
    this.friendship.blockUser(this.id)
  }

}
