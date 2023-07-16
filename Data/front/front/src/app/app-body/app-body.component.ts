// import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, distinctUntilChanged, firstValueFrom, fromEvent } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { Router } from '@angular/router';
import { StatusService } from '../status.service';
import { FriendshipService } from '../profile/friendship.service';
import Swal from 'sweetalert2';
import { GameService } from '../play/game/game.service';

@Component({
  selector: 'app-app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms', style({ opacity: 0 }))])
    ])]
})
export class AppBodyComponent implements OnInit, OnDestroy {
  logo = "PING-PONG 1337";
  public profileSub$ !: Observable<any>;
  public profile$ !: Observable<any>;
  // public profile$ !: Subject<any>;
  private replay: any;
  private replay_: any;
  private replay__: any;
  private replay___: any;
  notLogged: boolean = true;
  dropDown = false;
  profilepic: string = '';



  @ViewChild('dropDownContent') dropDownContent !: ElementRef;
  @ViewChild('dropDownContent_') dropDownContent_ !: ElementRef;
  @ViewChild('dropDownContent__') dropDownContent__ !: ElementRef;

  constructor(public profileService: ProfileService, private route: Router,
    private status: StatusService, private friendship: FriendshipService, private gameService: GameService) {

    this.gameService.gameIsCreated$.subscribe(
      (data) => {
        if (data) {
          route.navigateByUrl('/game')
        }
      }
    );
  }


  getcurrentPath() {
    return this.route.url;
  }
  onclick() {
    this.dropDown = !this.dropDown
  }
  ngOnInit(): void {
    this.profileSub$ = this.profileService.getMyData().asObservable();
    // API but can't use await:
    this.replay = this.profileSub$.subscribe({
      next: (data: Observable<any>) => {
        this.replay_ = data.subscribe({
          next: (dta: any) => {
            if (dta.statusCode)
              this.notLogged = true;
            else {
              this.notLogged = false;
              this.profilepic = this.profileService.getUserAvatarPath(dta.avatar);
            }
          }
        })
        this.profile$ = data;
      },
    });
    // socket:
    this.replay__ = this.friendship.current_status_friend.asObservable().subscribe((data) => {
      if (data?.type == 4) {
        this.showPopup(data.senderId)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.replay)
      this.replay.unsubscribe()
    if (this.replay_)
      this.replay_.unsubscribe()
    if (this.replay__)
      this.replay__.unsubscribe()
    if (this.replay___)
      this.replay___.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownContent?.nativeElement && clickedElement !== this.dropDownContent_?.nativeElement && clickedElement !== this.dropDownContent__?.nativeElement) {
      this.dropDown = false;
    }
  }

  updateAvatar(event: any) {
    this.ngOnInit();
  }
  logout() {
    this.replay___ = this.profileService.logout().subscribe({ next: (data) => { this.route.navigateByUrl('login'); this.notLogged = true; } })
    this.status.Offline();
  }

  async showPopup(id: string,) {
    const user: any = await firstValueFrom(this.profileService.getUserData(id));
    Swal.fire({
      title: 'Friend Request',
      html: `<p class="accept_notif-text" >You have a new friend request from ${user.username}!</p>`,
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Decline',
      imageUrl: this.profileService.getUserAvatarPath(user.avatar),
      customClass: {
        popup: 'accept_notif-container',
        title: 'accept_notif-title',
        confirmButton: 'accept_notif-confirm-button',
        cancelButton: 'accept_notif-cancel-button'
      },
      position: 'top-end',
      timer: 5000
    }).then((result) => {
      if (result.isConfirmed) {
        this.friendship.acceptRequest(user.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.friendship.cancelFriendRequest(user.id);
      }
    });
  }
}