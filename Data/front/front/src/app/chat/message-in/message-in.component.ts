import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-in',
  templateUrl: './message-in.component.html',
  styleUrls: ['./message-in.component.scss']
})
export class MessageInComponent {
  @Input() value: string = '';
  // constructor() {
  //   console.log(this.value)
  // }
}
