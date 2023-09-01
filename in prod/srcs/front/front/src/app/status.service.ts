import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { hostIp, tokenName } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private toctoc = '';
  public current_status = new BehaviorSubject<any>([]);
  socket: any;
  constructor(private cookieService: CookieService, private switchRouter: Router) {
    this.toctoc = cookieService.get(tokenName);
    this.socket = io(`${hostIp}:3000/current_status`, {
      withCredentials: true,
    },)
    this.socket.on("status", (data: any) => {
      if (this.toctoc != this.cookieService.get(tokenName))
        this.switchRouter.navigateByUrl('');
      else
        this.current_status.next(data);
    });
  }


  online() {
    if (this.toctoc != this.cookieService.get(tokenName))
      this.switchRouter.navigateByUrl('');
    else
      this.socket.emit('Online', (...args: any[]) => { });
  }
  inPlay() {
    if (this.toctoc != this.cookieService.get(tokenName))
      this.switchRouter.navigateByUrl('');
    else
      this.socket.emit('InGame', (...args: any[]) => { })
  }

  Offline() {
    if (this.toctoc != this.cookieService.get(tokenName))
      this.switchRouter.navigateByUrl('');
    else
      this.socket.emit('Disconnect', (...args: any[]) => { })
  }
}
