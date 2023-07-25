import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';

@Component({
  selector: 'app-part-chat',
  templateUrl: './part-chat.component.html',
  styleUrls: ['./part-chat.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('150ms', style({ opacity: 0 }))])
    ])
  ]
})
export class PartChatComponent {
  @Input() filter!: string;
  @Input() user!: any;
  @Input() idChat !: number;

  constructor(private readonly profile: ProfileService, private readonly state: StatusService) {

  }
  avataring(url: string) {
    return this.profile.getUserAvatarPath(url)
  }
  @ViewChild('dropDownUserRef') dropDownUserRef !: ElementRef;
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement !== this.dropDownUserRef?.nativeElement) {
      this.dropDownUser = false;
    }
  }
  replay: any;
  status: string = 'Offline';

  statusLoading(id: any) {
    this.replay = this.state.current_status.subscribe((curr: any) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
  }

  dropDownUser = false;
  onclickDropDownClick() {
    this.dropDownUser = !this.dropDownUser;
  }

}
