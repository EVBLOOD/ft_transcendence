import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms',style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms',style({ opacity: 0 }))])
    ]) 
  ]
})
export class ApplicationComponent implements OnInit {

  logo = "PING-PONG 1337";

  dropDown = false;
  private clickSubscription: Subscription | undefined;
  eRef: any;

  onclick(){
    this.dropDown = !this.dropDown
  }

  onBlur() {
    this.dropDown = false;
  }

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
    { img:'/assets/images/profile.jpg', name: 'yamzil', rank: '/assets/icons/rank1.svg'},
    { img:'/assets/images/profile.jpg', name: 'sakllam', rank: '/assets/icons/rank1.svg'},
    { img:'/assets/images/profile.jpg', name: 'eagoumi', rank: '/assets/icons/rank1.svg'},
    { img:'/assets/images/profile.jpg', name: 'imabid', rank: '/assets/icons/rank1.svg'},
  ];

  @ViewChild('dropdownContent') dropdownContent!: ElementRef;

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.clickSubscription = fromEvent(document, "click").subscribe(event => {
      console.log("event: ", event.target);
      if (!this.eRef.nativeElement.contains(event.target)) {
        console.log("hello 1 ");
      } else {
        console.log("hello 2 ");
      }});
    }

  ngAfterViewInit() {
    // if (this.dropDown === true) {
      // this.renderer.listen('document', 'click', (event: Event) => {
      //   console.log("Hello world1", this.dropdownContent, "is", this.dropDown)
      //   // if (this.dropdownContent) {
      //     if (this.dropdownContent === undefined && this.dropDown) {
      //     //   if (this.dropdownContent !== undefined) {
      //     //     console.log("Hello", this.dropdownContent)
      //         this.dropDown = !this.dropDown;
      //     //   }
      //     } 
      // });
  }

}
