import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/login/auth.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';
import { ChatService } from '../../chat.service';

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
  @Input() myrole !: string;
  id !: number;
  constructor(private readonly profile: ProfileService, private readonly state: StatusService, private readonly authSer: AuthService, private readonly ChatService: ChatService) {
    this.id = this.authSer.getId();
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


  kickUser() {
    if (this.user?.user?.id)
      this.ChatService.KickThisOne(this.idChat.toString(), this.user?.user?.id).subscribe((data) => { console.log(data) })
  }

  RemoveRole() {
    if (this.user?.user?.id)
      this.ChatService.RemoveRole(this.idChat.toString(), this.user?.user?.id).subscribe((data) => { console.log(data) })
  }

  AddRole() {
    if (this.user?.user?.id)
      this.ChatService.CreateRole(this.idChat.toString(), this.user?.user?.id).subscribe((data) => { console.log(data) })
  }

  BanUser() {
    if (this.user?.user?.id)
      this.ChatService.banUser(this.idChat.toString(), this.user?.user?.id).subscribe((data) => { console.log(data) })
  }
  unBanUser() {
    if (this.user?.user?.id)
      this.ChatService.banUserRemoval(this.idChat.toString(), this.user?.user?.id).subscribe((data) => { console.log(data) })
  }


}
