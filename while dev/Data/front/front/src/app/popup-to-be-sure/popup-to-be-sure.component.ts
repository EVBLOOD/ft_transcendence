import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-popup-to-be-sure',
  templateUrl: './popup-to-be-sure.component.html',
  styleUrls: ['./popup-to-be-sure.component.scss']
})
export class PopupToBeSureComponent implements OnDestroy {
  // subsc
  private removesubsc: any;

  constructor(private readonly switchRouter: Router, private readonly chatServ: ChatService, private readonly now: ActivatedRoute) {
  }

  close() {
    this.switchRouter.navigateByUrl('chat/' + this.now.snapshot.params['id']);
  }

  submit() {
    this.removesubsc = this.chatServ.leaveChatroom(this.now.snapshot.params['id']).subscribe((data: any) => {
      if (!data?.statusCode) {
        this.chatServ.updateMsh(this.now.snapshot.params['id']);
        this.switchRouter.navigateByUrl('chat')
      }
    });
  }
  ngOnDestroy(): void {
    this.removesubsc?.unsubscribe()
  }
}
