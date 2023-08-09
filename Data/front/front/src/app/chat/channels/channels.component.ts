import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
  @Input() channel: any;
  // id !: number;
  constructor(private readonly switchRoute: Router) {
    console.log(this.channel);
    // this.id = this.channel?.id;
  }
  openChat(id: number) {
    this.switchRoute.navigateByUrl("/chat/" + id)
  }
}
