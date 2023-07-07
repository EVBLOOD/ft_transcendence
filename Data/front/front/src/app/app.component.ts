import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, distinctUntilChanged, firstValueFrom, fromEvent } from 'rxjs';
import { ProfileService } from './profile/profile.service';
import { Router } from '@angular/router';
import { StatusService } from './status.service';
import { FriendshipService } from './profile/friendship.service';
// import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms',style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms',style({ opacity: 0 }))])
    ]) 
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  logo = "PING-PONG 1337";
  public profileSub$ !: Observable<any>;
  public profile$ !: Observable<any>;
  // public profile$ !: Subject<any>;
  private replay : any;
  notLogged : boolean = true;
  dropDown = false;
  profilepic : string = '';


  
  @ViewChild('dropDownContent') dropDownContent !:ElementRef;
  @ViewChild('dropDownContent_') dropDownContent_ !:ElementRef;
  @ViewChild('dropDownContent__') dropDownContent__ !:ElementRef;

  constructor(public profileService : ProfileService, private route: Router,
        private status: StatusService, private friendship: FriendshipService,) {}

        
  getcurrentPath()
  {
    return this.route.url;
  }
  onclick(){
    this.dropDown = !this.dropDown
  }
  ngOnInit(): void {
    console.log("WHAT");
    this.profileSub$ = this.profileService.getMyData().asObservable();
    this.replay = this.profileSub$.subscribe({next: (data : Observable<any>) => {
      data.subscribe({next: (dta : any) =>{
        console.log('hello')
        if (dta.statusCode)
        this.notLogged = true;
        else
        {
          this.notLogged = false;
          this.profilepic = this.profileService.getUserAvatarPath(dta.avatar);
          console.log(dta.avatar)
          console.log(this.profilepic)
        }
      }})
      this.profile$ = data;
      console.log("onee")
    },});
    this.friendship.current_status_friend.asObservable().subscribe((data) => {
      if (data)
      {
        console.log("this is the data: ")
        console.log(data);
        console.log("okey");
        if (data?.type == 4)
        {
          console.log(`this this invite was sent by user :  ${data.senderId}`)
          this.showPopup(data.senderId)
        }
      }
   })
  }
  
  ngOnDestroy(): void {
    this.replay.unsubscribe()
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownContent?.nativeElement && clickedElement !== this.dropDownContent_?.nativeElement  && clickedElement !== this.dropDownContent__?.nativeElement ) {
      this.dropDown = false;
    }
  }

  updateAvatar(event : any)
  {
    if (event)
      console.log(';;;')
    console.log("calling myself")
    this.ngOnInit();
  }
  logout()
  {
    this.replay = this.profileService.logout().subscribe({next: (data) => {this.route.navigateByUrl('login'); this.notLogged = true;}, complete: () => {this.replay.unsubscribe()}})
    this.status.Offline();
  }

  async showPopup(id: string,) {
    const user : any = await firstValueFrom(this.profileService.getUserData(id));
    console.log(user);
    Swal.fire({
      title: 'Friend Request',
      html: `<p class="accept_notif-text" >You have a new friend request from ${user.username}!</p>`,
      iconHtml: '<img class="accept_notif-icon" src="' + this.profileService.getUserAvatarPath(user.avatar) + '">',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Decline',
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
        // Handle accept button click
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.friendship.cancelFriendRequest(user.id);
        // Handle decline button click
      }
    });
  }
}