import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StatusService } from '../status.service';
import { FriendshipService } from './friendship.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  public profile$ !: Observable<any>;
  profile = "/assets/img/profile.jpg";
  logo = "LOGO is loading";
  public profileSubject$ !: Observable<any>;
  public auth$ !: Observable<any>;
  public username : string;
  public status !: string;
  displayRespondingWay : boolean = false;
  type : number = 0;

  // to unsubscribe subscribed Observables
  replay !: any;
  replay_ !: any;

  constructor(public profileService : ProfileService, private authService: AuthService,
              private route: ActivatedRoute, private state : StatusService,
              private friendship : FriendshipService) {
    this.username = this.route.snapshot.params["username"];
    console.log(this.username);
  }
  ngOnInit(): void {
    if (!this.username || this.username == '')
    {
      this.profileSubject$ = this.profileService.getMyData();
      this.replay_ = this.profileSubject$.subscribe({next: (data : Observable<any>) => {
      this.profile$ = data;}});
    }
    else
    {
      this.profile$ = this.profileService.getUserData(this.username);
      this.friendship.friendStatus(this.username).subscribe((data : any) => {
        console.log('lololo')
        console.log(data);
        if (data)
        {
          if (!data.status)
            this.type = 0; // not friends
          else if (data.status == 'you blocked')
            this.type = 1; // unblock
          else if (data.status == 'you are blocked')
            this.type = 2; // nothing to show
          else if (data.status == 'you are accepted')
            this.type = 3; // friends
          else if (data.status == 'accept?')
            this.type = 4; // accept or cancel
          else if (data.status == 'you are on pending')
            this.type = 5; // cancel request
        }
        else
          this.type = 0;
      });
    }
    this.auth$ = this.authService.getCurrentUser();
  }
  ngOnDestroy(): void {
    if (this.replay)
      this.replay.unsubscribe();
    if (this.replay_)
      this.replay_.unsubscribe();
  }
  sameDataEveryDay = [
    {path: "/assets/RankIcon.svg", name: "Rank",score: "20"},
    {path: "/assets/RankIcon.svg", name: "Rank",score: "01"},
    {path: "/assets/RankIcon.svg", name: "Rank",score: "01"},
    {path: "/assets/RankIcon.svg", name: "Rank",score: "01"}]

  historyRaw = [
    {pathU: "/assets/profilePic.svg", pathOp: "/assets/theplayer.svg", name: "Kid-bouh VS Sakllam", state: "Win 🏆", date: "Date" }, 
    {pathU: "/assets/profilePic.svg", pathOp: "/assets/theplayer.svg", name: "Kid-bouh VS Sakllam", state: "Win 🏆", date: "Date" }, 
    {pathU: "/assets/profilePic.svg", pathOp: "/assets/theplayer.svg", name: "Kid-bouh VS Sakllam", state: "Win 🏆", date: "Date" }, 
  ]

  statusLoading(id: any)
  {
      this.replay = this.state.current_status.subscribe((curr) => {
        const newone = curr.find((obj: any) => {if (obj.id == id) return obj;});
        if (newone)
          this.status = newone.status;
        else
          this.status = 'Offline'
      });
  }
  hideIt = () => {this.displayRespondingWay = !this.displayRespondingWay}
  // logic of friendships

  addFriend()
  {
    this.friendship.addFriend(this.username).subscribe({next: (data) => {console.log(data)}});
  }
  
  cancelFriend()
  {
    this.displayRespondingWay = false;
    this.friendship.cancelFriendRequest(this.username).subscribe({next: (data) => {console.log(data)}});
  }
  respondAcceptFriend()
  {
    this.displayRespondingWay = false;
    this.friendship.acceptRequest(this.username).subscribe({next: (data) => {console.log(data)}});
  }
  unFriend()
  {
    this.friendship.unfriendUser(this.username).subscribe({next: (data) => {console.log(data)}});
  }
  blockUser()
  {
    this.friendship.blockUser(this.username).subscribe({next: (data) => {console.log(data)}});
  }
  unBlock()
  {
    this.friendship.unblockUser(this.username).subscribe({next: (data) => {console.log(data)}});
  }
}
