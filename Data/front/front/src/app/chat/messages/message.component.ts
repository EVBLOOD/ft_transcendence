import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() value !: any;
  today: number = Date.now();
  whoIs$ !: Observable<any>;
  constructor(private readonly serviceProfile: ProfileService, private readonly serviceAuth: AuthService) {
  }

  imageLink(url: string) {
    return this.serviceProfile.getUserAvatarPath(url);
  }
  myId() {
    return this.serviceAuth.getId();
  }
}
