import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public profile$ !: Observable<any>;
  public profileSubject$ !: Observable<any>;
  public auth$ !: Observable<any>;
  public username : string;
  public status !: string;
  replay !: any;
  replay_ !: any;

  constructor(public profileService : ProfileService, private authService: AuthService, private route: ActivatedRoute, private state : StatusService) {
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
    this.profile$ = this.profileService.getUserData(this.username);
    this.auth$ = this.authService.getCurrentUser();
  }
  ngOnDestroy(): void {
    this.replay.unsubscribe();
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
  logo = "LOGO is loading";
  profile = "/assets/img/profile.jpg";
}
