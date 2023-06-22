import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile$ !: Observable<any>;
  public auth$ !: Observable<any>;
  public username : string;
  constructor(public profileService : ProfileService, private authService: AuthService, private route: ActivatedRoute) {
    this.username = this.route.snapshot.params["username"];
    console.log(this.username);
  }
  ngOnInit(): void {
    this.profile$ = this.profileService.getUserData(this.username);
    this.auth$ = this.authService.getCurrentUser();
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
  logo = "LOGO is loading";
  profile = "/assets/img/profile.jpg";
}
