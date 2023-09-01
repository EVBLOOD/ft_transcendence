import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
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
export class PartChatComponent implements OnDestroy {
  @Input() filter!: string;
  @Input() user!: any;
  @Input() idChat !: number;
  @Input() myrole !: string;
  id !: number;
  status: string = 'Offline';
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();
  constructor(private readonly profile: ProfileService, private readonly state: StatusService,
    private readonly authSer: AuthService, private readonly ChatService: ChatService) {
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

  statusLoading(id: any) {
    this.removesubsc = this.state.current_status.subscribe((curr: any) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
    this.SubArray.push(this.removesubsc)
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((subsc) => {
      subsc?.unsubscribe()
    })
  }

  dropDownUser = false;
  onclickDropDownClick() {
    this.dropDownUser = !this.dropDownUser;
  }


  kickUser() {
    if (this.user?.user?.id) {
      this.removesubsc = this.ChatService.KickThisOne(this.idChat.toString(), this.user?.user?.id).subscribe((data: any) => { })
      this.SubArray.push(this.removesubsc)
    }
  }

  RemoveRole() {
    if (this.user?.user?.id) {
      this.removesubsc = this.ChatService.RemoveRole(this.idChat.toString(), this.user?.user?.id).subscribe((data: any) => { })
      this.SubArray.push(this.removesubsc)

    }
  }

  AddRole() {
    if (this.user?.user?.id) {
      this.removesubsc = this.ChatService.CreateRole(this.idChat.toString(), this.user?.user?.id).subscribe((data: any) => { })
      this.SubArray.push(this.removesubsc)
    }
  }

  BanUser() {
    if (this.user?.user?.id) {
      this.removesubsc = this.ChatService.banUser(this.idChat.toString(), this.user?.user?.id).subscribe((data: any) => { })
      this.SubArray.push(this.removesubsc);
    }
  }
  unBanUser() {
    if (this.user?.user?.id) {
      this.removesubsc = this.ChatService.banUserRemoval(this.idChat.toString(), this.user?.user?.id).subscribe((data: any) => { })
      this.SubArray.push(this.removesubsc);
    }
  }
  mute() {
    if (this?.user?.Userid) {
      this.removesubsc = this.ChatService.LetsSilenceHim(this?.user?.Userid, this.idChat).subscribe((data) => { });
      this.SubArray.push(this.removesubsc);
    }
  }

}
