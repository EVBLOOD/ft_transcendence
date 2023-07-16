import { Component } from '@angular/core';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {
  constructor(private gameService: GameService) {

  }
  quickPairing() {
    this.gameService.createGame();
  }
  players = [
    { img: '/assets/img/profile.jpeg', name: 'sakllam', status: 1 },
    { img: '/assets/img/profile.jpeg', name: 'kid-bouh', status: 1 },
    { img: '/assets/img/profile.jpeg', name: 'ahmed', status: 0 },
    { img: '/assets/img/profile.jpeg', name: 'yamzil', status: 1 },
    { img: '/assets/img/profile.jpeg', name: 'karim', status: 1 },
    { img: '/assets/img/profile.jpeg', name: 'test', status: 0 },
  ];

  leaderboard = [
    { img: '/assets/img/profile.jpeg', name: 'kid-bouh', rank: '/assets/icons/firstRank.svg' },
    { img: '/assets/img/profile.jpeg', name: 'yamzil', rank: '/assets/icons/firstRank.svg' },
    { img: '/assets/img/profile.jpeg', name: 'sakllam', rank: '/assets/icons/firstRank.svg' },
    { img: '/assets/img/profile.jpeg', name: 'eagoumi', rank: '/assets/icons/firstRank.svg' },
    { img: '/assets/img/profile.jpeg', name: 'imabid', rank: '/assets/icons/firstRank.svg' },
  ];
  history = [
    { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs yamzil', state: 'Win 🏆', date: 'Today' },
    { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs xyz', state: 'Win 🏆', date: 'Today' },
    { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs level', state: 'Lose 😥', date: 'Yesterday' },
    { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs test', state: 'Lose 😥', date: 'Yesterday' },
    { img1: '/assets/img/profile.jpeg', img2: '/assets/img/profile.jpeg', names: 'kid-bouh vs sakllam', state: 'Win 🏆', date: 'Yesterday' },
  ];

}
