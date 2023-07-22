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
  msgText = new FormControl('', [Validators.required,]);

  constructor(private readonly sendMsg: ChatService) {
    // value: string;
    // charRoomId: number;

  }
  sending() {
    if (this.msgText.value?.trim()?.length)
      this.sendMsg.sendMessage({ value: this.msgText.value.trim(), charRoomId: this.chatId });
    this.msgText.setValue('');
  }
}
