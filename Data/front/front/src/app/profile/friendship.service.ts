import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ɵafterNextNavigation } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private socket: Socket;
  public current_status_friend = new BehaviorSubject<any>(0);


  constructor(private http: HttpClient ) { 
    this.socket = io('http://localhost:3000/friendshipSock',   {
      withCredentials: true, 
    },  );


    this.socket.on('friendRequestReceived' ,(data : any) => {
      console.log("friendRequestReceived")
      console.log(data);
      this.current_status_friend.next({senderId: data.senderId, type: 4 })
      // send notif
    });

    // this.socket.on('friendRequestSent' ,(data : any) => {
    //   // send notif
    // });

    this.socket.on('friendRequestAccepted' ,(data : any) => {
      this.current_status_friend.next({senderId: data.senderId, type: 3 })

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
      this.current_status_friend.next({senderId: data.senderId, type: 2 })

      console.log("UserBlockedby")
      console.log(data);

      // send notif
    });


    this.socket.on('youWereUnblocked' ,(data : any) => {
      this.current_status_friend.next({senderId: data.senderId, type: 0 })

      console.log("youWereUnblocked")
      console.log(data);
      // send notif
    });

    this.socket.on('notAnyMore' ,(data : any) => {
      this.current_status_friend.next({senderId: data.senderId, type: 0})

      console.log("notAnyMore")
      console.log(data);
      // send notif
    });

  }
  addFriend(id : number)  {
    this.socket.emit('friendRequest', id, (data : any) => {
      // console.log(data)
      this.current_status_friend.next({senderId: id, type: 5})
      
    });
  }
  
    //   if (!data.status)
//   this.type = 0; // not friends
// else if (data.status == 'you blocked')
//   this.type = 1; // unblock
// else if (data.status == 'you are blocked')
//   this.type = 2; // nothing to show
// else if (data.status == 'you are accepted')
//   this.type = 3; // friends
// else if (data.status == 'accept?')
//   this.type = 4; // accept or cancel
// else if (data.status == 'you are on pending')
//   this.type = 5; // cancel request
  acceptRequest(id : number)  {
    this.socket.emit('acceptFriendRequest', id, (data : any) => 
    {
      console.log(data)
      this.current_status_friend.next({senderId: id, type: 3})
    });
  }
  
  blockUser(id : number)  {
    this.socket.emit('blockUser', id , (data : any) => 
    {
      console.log(data)
      this.current_status_friend.next({senderId: id, type: 1})
    });    
  }

  unfriendUser(id : number) {
    this.socket.emit('deleteFriendship', id, (data : any) => 
    {
      console.log(data)
      this.current_status_friend.next({senderId: id, type: 0})
    });    
  }
  
  cancelFriendRequest(id : number)  {
    this.socket.emit('deleteFriendship', id, (data : any) => 
    {
      console.log(data)
      this.current_status_friend.next({senderId: id, type: 0})
    });
  }


  unblockUser(id : number)  {
    this.socket.emit('unblockUser', id, (data : any) => 
    {
      console.log(data)
      this.current_status_friend.next({senderId: id, type: 0})
    });
  }
  
  friendStatus(id : string) {
    return this.http.post('http://localhost:3000/friendship/friendStatus', { id: Number.parseInt(id) }, {
          withCredentials: true,
        });
      }

  friendRealTimeStatus() {
    return this.current_status_friend
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