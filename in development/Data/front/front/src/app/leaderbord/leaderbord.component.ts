import { Component } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Observable } from 'rxjs';
import { AboutGamesService } from '../play/about-games.service';

@Component({
  selector: 'app-leaderbord',
  templateUrl: './leaderbord.component.html',
  styleUrls: ['./leaderbord.component.scss']
})
export class LeaderbordComponent {
  Leaders$!: Observable<any>;
  constructor(private readonly gameStats: AboutGamesService, public profile: ProfileService) {
    this.Leaders$ = this.gameStats.Leadring();
  }
  // rank = [{user: {username: 'first', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'second', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'last', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'},
  // {user: {username: 'sakllam', avatar: '/assets/img/profile.jpeg'}, matchPlayed: 300, win: 60, ratio: '10%'}
  // ]

}
