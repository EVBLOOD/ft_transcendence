import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { FriendshipService } from 'src/app/profile/friendship.service';
import { GameService } from 'src/app/play/game/game.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent {
  @Input() isRoom!: boolean;
  @Input() chatInfos: any;
  @Input() id!: number;

  Members$ !: Observable<any>;
  user$ !: Observable<any>;
  // Members$ !: Observable<any>;
  // id !: number;

  constructor(private readonly chatService: ChatService, private readonly profileService: ProfileService,
    private readonly friendShips: FriendshipService, private readonly gameService: GameService, private readonly switchRouter: Router) {
    if (this.id && this.isRoom) {
      // this.Members$ = this.chatService.m
    }
    else if (this.id && !this.isRoom) {
      this.user$ = this.profileService.getUserData(this.id.toString());
    }
  }

  avataring(url: string) {
    return this.profileService.getUserAvatarPath(url)
  }

  blocking() {
    if (this.id)
      this.friendShips.blockUser(this.id)

  }
  playing() {
    if (this.id)
      this.gameService.createGame(this.id);
  }
  viewPro() {
    this.switchRouter.navigateByUrl('profile/' + this.id)
  }
}
