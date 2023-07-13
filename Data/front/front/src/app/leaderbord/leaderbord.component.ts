import { Component } from '@angular/core';

@Component({
  selector: 'app-leaderbord',
  templateUrl: './leaderbord.component.html',
  styleUrls: ['./leaderbord.component.scss']
})
export class LeaderbordComponent {
  players = [
    { img:'/assets/images/profile.jpg', name: 'sakllam', status: 1},
    { img:'/assets/images/profile.jpg', name: 'kid-bouh', status: 1},
    { img:'/assets/images/profile.jpg', name: 'ahmed', status: 0},
    { img:'/assets/images/profile.jpg', name: 'yamzil', status: 1},
    { img:'/assets/images/profile.jpg', name: 'karim', status: 1},
    { img:'/assets/images/profile.jpg', name: 'test', status: 0},
  ];

  leaderboard = [
    { img:'/assets/images/profile.jpg', name: 'kid-bouh', rank: '/assets/icons/rank1.svg'},
    { img:'/assets/images/profile.jpg', name: 'yamzil', rank: '/assets/icons/rank2.svg'},
    { img:'/assets/images/profile.jpg', name: 'sakllam', rank: '/assets/icons/rank3.svg'},
    { img:'/assets/images/profile.jpg', name: 'eagoumi', rank: '/assets/icons/rank4.svg'},
    { img:'/assets/images/profile.jpg', name: 'imabid', rank: '/assets/icons/rank5.svg'},
  ];

  history = [
    { img1:'/assets/images/profile.jpg', img2:'/assets/simages/profile.jpg', names: 'kid-bouh vs yamzil', state: 'Win 🏆', date: 'Today'},
    { img1:'/assets/images/profile.jpg', img2:'/assets/images/profile.jpg', names: 'kid-bouh vs agoumiiiiii', state: 'Win 🏆', date: 'Today'},
    { img1:'/assets/images/profile.jpg', img2:'/assets/images/profile.jpg', names: 'kid-bouh vs simo', state: 'Lose 😥', date: 'Yesterday'},
    { img1:'/assets/images/profile.jpg', img2:'/assets/images/profile.jpg', names: 'kid-bouh vs test', state: 'Lose 😥', date: 'Yesterday'},
    { img1:'/assets/images/profile.jpg', img2:'/assets/images/profile.jpg', names: 'kid-bouh vs sel-mars', state: 'Win 🏆', date: 'Yesterday'},
  ];
}
