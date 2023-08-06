import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import hostIp from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  public current_status = new BehaviorSubject<any>([]);
  socket: any;
  constructor() {
    this.socket = io(`${hostIp}:3000/current_status`, {
      withCredentials: true,
    },)
    this.socket.on("status", (data: any) => {
      this.current_status.next(data);
    });
  }


  online() {
    this.socket.emit('Online', (...args: any[]) => { });
  }
  inPlay() {
    this.socket.emit('InGame', (...args: any[]) => { })
  }

  Offline() {
    this.socket.emit('Disconnect', (...args: any[]) => { })
  }
}
