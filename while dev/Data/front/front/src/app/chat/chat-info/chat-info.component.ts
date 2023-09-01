import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { FriendshipService } from 'src/app/profile/friendship.service';
import { GameService } from 'src/app/play/game/game.service';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnChanges {
  @Input() isRoom!: boolean;
  @Input() chatInfos: any;
  @Input() id!: number;

  Members$ !: Observable<any>;
  user$ !: Observable<any>;
  role$  !: Observable<any>;
  // Members$ !: Observable<any>;
  // id !: number;
  thisUSer!: number;

  constructor(private readonly chatService: ChatService, private readonly profileService: ProfileService,
    private readonly friendShips: FriendshipService, private readonly gameService: GameService,
    private readonly switchRouter: Router, private readonly auth: AuthService) {
    this.thisUSer = auth.getId();
  }

  ngOnChanges(): void {
    if (this.id && this.isRoom) {
      this.Members$ = this.chatService.getGroupMembers(this.id);
      this.role$ = this.chatService.myRole(this.id);
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
    this.switchRouter.navigateByUrl('/chat')
  }
  playing() {
    if (this.id)
      this.gameService.createGame(this.id);
  }
  viewPro() {
    this.switchRouter.navigateByUrl('profile/' + this.id)
  }

  countMembers(array: any[], filter: string): boolean {
    return array.find((value: any) => {
      return value.role == filter && (value.state == 1 || value.state == 3)
    })
  }

  banedMembers(array: any[]): boolean {
    return array.find((value: any) => {
      return value.state == 0
    })
  }
}
