import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private socket: Socket;

  constructor(private http: HttpClient ) { 
    this.socket = io('http://localhost:3000/friendshipSock',   {
      withCredentials: true, 
    },  );
  
  
    this.socket.on('friendRequestReceived' ,(data : any) => {
      console.log("friendRequestReceived")
      console.log(data);
      // send notif
    });

    // this.socket.on('friendRequestSent' ,(data : any) => {
    //   // send notif
    // });

    this.socket.on('friendRequestAccepted' ,(data : any) => {
      console.log("friendRequestAccepted")
      console.log(data);

      // send notif
    });

    // this.socket.on('youveAccepted' ,(data : any) => {
    //   // send notif
    // });

    // this.socket.on('UserNotFound' ,(data : any) => {
    //   // send notif
    // });

    this.socket.on('UserBlockedby' ,(data : any) => {
      console.log("UserBlockedby")
      console.log(data);

      // send notif
    });


    this.socket.on('youWereUnblocked' ,(data : any) => {
      console.log("youWereUnblocked")
      console.log(data);
      // send notif
    });

    this.socket.on('notAnyMore' ,(data : any) => {
      console.log("notAnyMore")
      console.log(data);
      // send notif
    });

  }
    
  addFriend(id : number)  {
    this.socket.emit('friendRequest', id);
  }
  
  acceptRequest(id : number)  {
    this.socket.emit('acceptFriendRequest', id);
  }
  
  blockUser(id : number)  {
    this.socket.emit('blockUser', id);    
  }

  unfriendUser(id : number) {
    this.socket.emit('deleteFriendship', id);
  }
  
  cancelFriendRequest(id : number)  {
    this.socket.emit('deleteFriendship', id);
  }


  unblockUser(id : number)  {
    this.socket.emit('unblockUser', id);
  }

  friendStatus(id : string) {
    return this.http.post('http://localhost:3000/friendship/friendStatus', {id: Number.parseInt(id)}, {
      withCredentials: true, 
    },);
  }
}
// if (!data.status)
// this.type = 0; // not friends
// else if (data.status == 'you blocked')
// this.type = 1; // unblock
// else if (data.status == 'you are blocked')
// this.type = 2; // nothing to show
// else if (data.status == 'you are accepted')
// this.type = 3; // friends
// else if (data.status == 'accept?')
// this.type = 4; // accept or cancel
// else if (data.status == 'you are on pending')
// this.type = 5; // cancel request