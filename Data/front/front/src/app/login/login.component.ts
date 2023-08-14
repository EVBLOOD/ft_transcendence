import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { hostIp } from 'src/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public ip: string = hostIp;
  // private user$: Observable<any> = this.authService.getCurrentUser();
  constructor(private authService: AuthService) { }
}
