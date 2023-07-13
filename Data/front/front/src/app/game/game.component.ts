import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  players = [
    { img:'/assets/img/profile.jpeg', name: 'sakllam', status: 1},
    { img:'/assets/img/profile.jpeg', name: 'kid-bouh', status: 1},
    { img:'/assets/img/profile.jpeg', name: 'ahmed', status: 0},
    { img:'/assets/img/profile.jpeg', name: 'yamzil', status: 1},
    { img:'/assets/img/profile.jpeg', name: 'karim', status: 1},
    { img:'/assets/img/profile.jpeg', name: 'test', status: 0},
  ];

  leaderboard = [
    { img:'/assets/img/profile.jpeg', name: 'kid-bouh', rank: '/assets/icons/firstRank.svg'},
    { img:'/assets/img/profile.jpeg', name: 'yamzil', rank: '/assets/icons/firstRank.svg'},
    { img:'/assets/img/profile.jpeg', name: 'sakllam', rank: '/assets/icons/firstRank.svg'},
    { img:'/assets/img/profile.jpeg', name: 'eagoumi', rank: '/assets/icons/firstRank.svg'},
    { img:'/assets/img/profile.jpeg', name: 'imabid', rank: '/assets/icons/firstRank.svg'},
  ];
  history = [
    { img1:'/assets/img/profile.jpeg', img2:'/assets/img/profile.jpeg', names: 'kid-bouh vs yamzil', state: 'Win 🏆', date: 'Today'},
    { img1:'/assets/img/profile.jpeg', img2:'/assets/img/profile.jpeg', names: 'kid-bouh vs agoumiiiiii', state: 'Win 🏆', date: 'Today'},
    { img1:'/assets/img/profile.jpeg', img2:'/assets/img/profile.jpeg', names: 'kid-bouh vs simo', state: 'Lose 😥', date: 'Yesterday'},
    { img1:'/assets/img/profile.jpeg', img2:'/assets/img/profile.jpeg', names: 'kid-bouh vs test', state: 'Lose 😥', date: 'Yesterday'},
    { img1:'/assets/img/profile.jpeg', img2:'/assets/img/profile.jpeg', names: 'kid-bouh vs sel-mars', state: 'Win 🏆', date: 'Yesterday'},
  ];
}
