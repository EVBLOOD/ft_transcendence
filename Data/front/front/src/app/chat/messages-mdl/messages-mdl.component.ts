import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages-mdl',
  templateUrl: './messages-mdl.component.html',
  styleUrls: ['./messages-mdl.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms', style({ opacity: 0 }))])
    ])
  ]
})
export class MessagesMdlComponent implements OnChanges {
  @Input() id!: number; // switched to type chat
  @Input() chatInfos: any;
  msgs$ !: Observable<any>;
  @ViewChild('dropDownChannelRef') dropDownChannelRef !: ElementRef;
  @ViewChild('dropDownChannelRef_') dropDownChannelRef_ !: ElementRef;
  @ViewChild('dropDownChannelRef__') dropDownChannelRef__ !: ElementRef;
  dropDownChannel = false;

  onclickThreePointChannel() {
    this.dropDownChannel = !this.dropDownChannel
  }
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownChannelRef?.nativeElement && clickedElement !== this.dropDownChannelRef_?.nativeElement
      && clickedElement !== this.dropDownChannelRef__?.nativeElement) {// && clickedElement !== this.dropDownUserRef?.nativeElement) {
      this.dropDownChannel = false;
    }
  }
  constructor(private readonly route: ActivatedRoute, private readonly chatService: ChatService) {


  }
  ngOnChanges(): void {
    this.msgs$ = this.chatService.getChatroomMessages(this.id)
  }

}
