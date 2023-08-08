import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Observable, } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from '../status.service';
import { FriendshipService } from './friendship.service';
import { AboutGamesService } from '../play/about-games.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public profile$ !: Observable<any>;
  profile = "/assets/img/profile.jpg";
  logo = "LOGO is loading";
  // private correntUser : any;
  public myID = -1;
  public profileSubject$ !: Observable<any>;
  // public auth$ !: Observable<any>;
  public username: any;
  public status !: string;
  displayRespondingWay: boolean = false;
  type: number = 0;
  YourBodyChoosen = false;

  friendRequest$!: Observable<any>;
  friendList$!: Observable<any>;
  blockedList$!: Observable<any>;
  sameDataEveryDayHelpMe$!: Observable<any>;
  friendRequestSkip: number = 0;
  friendListSkip: number = 0;
  blockListSkip: number = 0;
  History$!: Observable<any>;

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(public profileService: ProfileService, private authService: AuthService,
    private route: ActivatedRoute, private state: StatusService,
    private friendship: FriendshipService, private gameStats: AboutGamesService, private readonly switchRoute: Router) {
    this.username = this.route.snapshot.params["username"];
  }
  ngOnInit(): void {
    this.myID = this.authService.getId();
    if (!this.username || this.username == '') {
      this.sameDataEveryDayHelpMe$ = this.gameStats.Ilead();
      this.History$ = this.gameStats.getPlayersHistory();
      this.profileSubject$ = this.profileService.getMyData();
      this.removesubsc = this.profileSubject$.subscribe({
        next: (data: Observable<any>) => {
          this.profile$ = data;
        }
      });
      this.SubArray.push(this.removesubsc)
      this.friendRequest$ = this.friendship.requestsList(this.friendRequestSkip, 10)
      this.blockedList$ = this.friendship.blocklist(this.blockListSkip, 10)
      this.friendList$ = this.friendship.friendList(this.friendListSkip, 10)
      // socket :
      this.removesubsc = this.friendship.friendRealTimeStatus().subscribe((data: any) => {
        if (data) {
          this.friendList$ = this.friendship.friendList(this.friendListSkip, 10);
          this.friendRequest$ = this.friendship.requestsList(this.friendRequestSkip, 10);
          this.blockedList$ = this.friendship.blocklist(this.blockListSkip, 10);
        }
      });
      this.SubArray.push(this.removesubsc)
    }
    else {
      this.profile$ = this.profileService.getUserData(this.username);
      this.History$ = this.gameStats.APlayersHistory(this.username);
      this.sameDataEveryDayHelpMe$ = this.gameStats.leader(this.username);
      // socket
      this.removesubsc = this.friendship.friendRealTimeStatus().subscribe((state) => {
        if (state?.senderId && state.senderId == this.username)
          this.type = state.type;
      })
      this.SubArray.push(this.removesubsc)
      // socket
      this.removesubsc = this.friendship.friendStatus(this.username).subscribe((data: any) => {
        if (data) {
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
      this.SubArray.push(this.removesubsc)
    }
    // this.auth$ = this.authService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }

  sameDataEveryDay = [
    { path: "/assets/RankIcon.svg", name: "Rank" },
    { path: "/assets/MatchsIcon.svg", name: "Played" },
    { path: "/assets/WinsIcon.svg", name: "Wins" },
    { path: "/assets/ScoresIcon.svg", name: "Score" }]

  statusLoading(id: any) {
    this.removesubsc = this.state.current_status.subscribe((curr) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        this.status = newone.status;
      else
        this.status = 'Offline'
    });
    this.SubArray.push(this.removesubsc)
  }

  hideIt = () => { this.displayRespondingWay = !this.displayRespondingWay }


  async addFriend() {
    this.friendship.addFriend(Number.parseInt(this.username));
  }

  async cancelFriend() {
    this.displayRespondingWay = false;
    this.friendship.cancelFriendRequest(Number.parseInt(this.username));
  }

  async respondAcceptFriend() {
    this.displayRespondingWay = false;
    this.friendship.acceptRequest(Number.parseInt(this.username));
  }

  async unFriend() {
    this.friendship.unfriendUser(Number.parseInt(this.username));
  }

  async blockUser() {
    this.friendship.blockUser(Number.parseInt(this.username));
  }

  async unBlock() {
    this.friendship.unblockUser(Number.parseInt(this.username));
  }

  changeMode() {
    this.YourBodyChoosen = !this.YourBodyChoosen;
  }

  // isObject(value: any): boolean {
  //   return Array.isArray(value)
  // }

  updating(type: number) {
    if (type == 1)
      this.friendList$ = this.friendship.friendList(this.friendListSkip, 10);
    else if (type == 2)
      this.friendRequest$ = this.friendship.requestsList(this.friendRequestSkip, 10);
    else
      this.blockedList$ = this.friendship.blocklist(this.blockListSkip, 10);
  }

  up(skip: number, type: number) {
    skip += 10;
    this.updating(type);
  }

  down(skip: number, type: number) {
    if (skip) {
      skip -= 10;
      this.updating(type);
    }
  }

  GoChat() {
    this.switchRoute.navigateByUrl('chat/dm/' + this.username);
  }
}
