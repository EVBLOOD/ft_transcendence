import { Component, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.scss']
})
export class SendMsgComponent {
  @Input() chatId !: number;
  @Input() isRoom !: boolean;
  @Input() userId !: number;

  msgText = new FormControl('', [Validators.required,]);

  constructor(private readonly sendMsg: ChatService) {
  }
  sending() {
    if (this.msgText.value?.trim()?.length && this.isRoom)
      this.sendMsg.sendMessage({ value: this.msgText.value.trim(), charRoomId: this.chatId }, true);
    if (this.msgText.value?.trim()?.length && !this.isRoom)
      this.sendMsg.sendMessage({ value: this.msgText.value.trim(), charRoomId: this.userId }, false);
    this.msgText.setValue('');
  }
}
