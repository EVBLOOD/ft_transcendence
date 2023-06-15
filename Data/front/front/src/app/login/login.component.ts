import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private user$ : Observable<any> = this.authService.getCurrentUser();
  constructor (private authService : AuthService)
  {
  }
}
