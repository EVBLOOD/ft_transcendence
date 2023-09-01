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
  notLogged: boolean = true;
  dropDown = false;
  profilepic: string = '';

  @ViewChild('dropDownContent') dropDownContent !: ElementRef;
  @ViewChild('dropDownContent_') dropDownContent_ !: ElementRef;
  @ViewChild('dropDownContent__') dropDownContent__ !: ElementRef;
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();
  constructor(public profileService: ProfileService, private route: Router,
    private status: StatusService, private friendship: FriendshipService, private gameService: GameService) {

    this.removesubsc = this.gameService.gameIsCreated$.subscribe(
      (data: any) => {
        if (data) {
          route.navigateByUrl('/game')
        }
      }
    );
    this.SubArray.push(this.removesubsc)
  }


  getcurrentPath() {
    return this.route.url;
  }

  getStarterPath(path: string) {
    return this.route.url.startsWith(path);
  }
  onclick() {
    this.dropDown = !this.dropDown
  }
  ngOnInit(): void {
    this.profileSub$ = this.profileService.getMyData().asObservable();
    // API but can't use await:
    this.removesubsc = this.profileSub$.subscribe({
      next: (data: Observable<any>) => {
        this.removesubsc = data.subscribe({
          next: (dta: any) => {
            if (dta.statusCode)
              this.notLogged = true;
            else {
              this.notLogged = false;
              this.profilepic = this.profileService.getUserAvatarPath(dta.avatar);
            }
          }
        })
        this.SubArray.push(this.removesubsc);
        this.profile$ = data;
      },
    });
    this.SubArray.push(this.removesubsc)
    // socket:
    this.removesubsc = this.friendship.current_status_friend.asObservable().subscribe((data) => {
      if (data?.type == 4) {
        this.showPopup(data.senderId)
      }
    })
    this.SubArray.push(this.removesubsc)
    this.removesubsc = this.gameService.gameRequest.asObservable().subscribe((data) => {
      if (data)
        this.showPopupGame(data.toString());
    })
    this.SubArray.push(this.removesubsc)
  }


  async showPopupGame(id: string,) {
    const user: any = await firstValueFrom(this.profileService.getUserData(id), { defaultValue: { username: 'user', avatar: '', } });
    Swal.fire({
      title: 'Game Request',
      html: `<p class="accept_notif-text" >You have a new game request from ${user.username}!</p>`,
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Decline',
      toast: true,
      timer: 15000,
      imageUrl: this.profileService.getUserAvatarPath(user.avatar),

      customClass: {
        popup: 'accept_notif-container',
        title: 'accept_notif-title',
        confirmButton: 'accept_notif-confirm-button',
        cancelButton: 'accept_notif-cancel-button'
      },
      position: 'top-end',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameService.acceptGame(true)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.gameService.acceptGame(false)
      }
    });
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
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
    this.removesubsc = this.profileService.logout().subscribe({ next: (data: any) => { this.route.navigateByUrl('login'); this.notLogged = true; } })
    this.SubArray.push(this.removesubsc)
    this.status.Offline();
  }

  async showPopup(id: string,) {
    const user: any = await firstValueFrom(this.profileService.getUserData(id), { defaultValue: { username: 'user', avatar: '' } });
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
      toast: true,
      position: 'top-end',
      timer: 15000
    }).then((result) => {
      if (result.isConfirmed) {
        this.friendship.acceptRequest(user.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.friendship.cancelFriendRequest(user.id);
      }
    });
  }
}