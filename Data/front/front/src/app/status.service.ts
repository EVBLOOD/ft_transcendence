import { Injectable } from '@angular/core';
// import { io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() { }

  // socket = io('http://localhost:3000/current_status',  {
  //   withCredentials: true
  // })

  online()
  {
    // this.socket.emit('Online')
  }
  inGame()
  {
    // this.socket.emit('inGame') 
  }

  Offline()
  {
    // this.socket.emit('Offline') 
  }
  // getSta
  // socket = io('ws://localhost:3000/current_status')

}
