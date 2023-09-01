import { Component } from '@angular/core';
import { GameService } from './game/game.service';
import { FriendshipService } from '../profile/friendship.service';
import { StatusService } from '../status.service';
import { Observable } from 'rxjs';
import { AboutGamesService } from './about-games.service';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {
  friendList: Observable<any>;
  History$!: Observable<any>;
  Leaders$!: Observable<any>;
  constructor(private gameService: GameService, private friendService: FriendshipService, private gameStats: AboutGamesService, private switchRoute: Router, public profile: ProfileService) {
    this.friendList = this.friendService.friendList(0, 0);
    this.History$ = this.gameStats.getHistory();
    this.Leaders$ = this.gameStats.Leadring_();
  }
  quickPairing() {
    this.gameService.createGame();
  }
  goProfile() {
    this.switchRoute.navigateByUrl('');
  }

  goLeaderBoard() {
    this.switchRoute.navigateByUrl('/leaderboard');
  }
  // players = [
  //   { img: '/assets/img/profile.jpeg', name: 'sakllam', status: 1 },
  //   { img: '/assets/img/profile.jpeg', name: 'kid-bouh', status: 1 },
  //   { img: '/assets/img/profile.jpeg', name: 'ahmed', status: 0 },
  //   { img: '/assets/img/profile.jpeg', name: 'yamzil', status: 1 },
  //   { img: '/assets/img/profile.jpeg', name: 'karim', status: 1 },
  //   { img: '/assets/img/profile.jpeg', name: 'test', status: 0 },
  // ];

  public leaderboard = [
    '/assets/icons/rank1.svg',
    '/assets/icons/rank2.svg',
    '/assets/icons/rank3.svg',
    '/assets/icons/rank4.svg',
    '/assets/icons/rank5.svg',
  ];
  // history = [
  //   { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs yamzil', state: 'Win 🏆', date: 'Today' },
  //   { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs xyz', state: 'Win 🏆', date: 'Today' },
  //   { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs level', state: 'Lose 😥', date: 'Yesterday' },
  //   { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs test', state: 'Lose 😥', date: 'Yesterday' },
  //   { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs sakllam', state: 'Win 🏆', date: 'Yesterday' },
  // ];

}
