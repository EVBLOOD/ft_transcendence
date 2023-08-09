import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent {
  @Input() toggle!: boolean;
  @Input() chatInfos: any;


  Members$ !: Observable<any>;
  id !: number;

  constructor(private readonly route: ActivatedRoute, private readonly chatService: ChatService, private readonly SwitchRoute: Router) {
    if (this.route.snapshot.params[':id'] && this.route.snapshot.params['id'].match(/^[0-9]*$/))
      this.SwitchRoute.navigateByUrl('/chat');
    this.id = parseInt(this.route.snapshot.params['id']);
    // Members$ = chatService.??
  }
}
