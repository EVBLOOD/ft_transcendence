import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
  @Input() channel: any;
  constructor(private readonly switchRoute: Router) {
  }
  openChat(id: number) {
    this.switchRoute.navigateByUrl("/chat/" + id)
  }
}
