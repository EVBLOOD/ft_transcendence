import { Component, Input, OnInit } from '@angular/core';
import { FriendshipService } from '../friendship.service';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-friends',
  templateUrl: './card-friends.component.html',
  styleUrls: ['./card-friends.component.scss']
})
export class CardFriendsComponent implements OnInit  {
  @Input() data: any;

  id !: number;
  more : boolean = false;
  otherUser$ !: Observable<any>;

  constructor (private friendship : FriendshipService, private switchRoute: Router,
    readonly profile: ProfileService) {}

    ngOnInit()
    {
      this.id = this.data.id;
    }

    showMore()
    {
      this.more = !this.more;
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
