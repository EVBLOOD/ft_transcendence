import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ɵafterNextNavigation } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { hostIp } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private socket: Socket;
  public current_status_friend = new BehaviorSubject<any>(0);


  constructor(private http: HttpClient) {
    this.socket = io(`${hostIp}:3000/friendshipSock`, {
      withCredentials: true,
    },);


    this.socket.on('friendRequestReceived', (data: any) => {
      this.current_status_friend.next({ senderId: data.senderId, type: 4 })
    });


    this.socket.on('friendRequestAccepted', (data: any) => {
      this.current_status_friend.next({ senderId: data.senderId, type: 3 })

    });


    this.socket.on('UserBlockedby', (data: any) => {
      this.current_status_friend.next({ senderId: data.senderId, type: 2 })

    });


    this.socket.on('youWereUnblocked', (data: any) => {
      this.current_status_friend.next({ senderId: data.senderId, type: 0 })
    });

    this.socket.on('notAnyMore', (data: any) => {
      this.current_status_friend.next({ senderId: data.senderId, type: 0 })
    });

  }
  addFriend(id: number) {
    this.socket.emit('friendRequest', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 5 })

    });
  }

  acceptRequest(id: number) {
    this.socket.emit('acceptFriendRequest', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 3 })
    });
  }

  blockUser(id: number) {
    this.socket.emit('blockUser', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 1 })
    });
  }

  unfriendUser(id: number) {
    this.socket.emit('deleteFriendship', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 0 })
    });
  }

  cancelFriendRequest(id: number) {
    this.socket.emit('deleteFriendship', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 0 })
    });
  }


  unblockUser(id: number) {
    this.socket.emit('unblockUser', id, (data: any) => {
      if (data === "UserNotFound")
        return;
      this.current_status_friend.next({ senderId: id, type: 0 })
    });
  }

  friendStatus(id: string) {
    return this.http.post(`${hostIp}:3000/friendship/friendStatus`, { id: Number.parseInt(id) }, {
      withCredentials: true,
    });
  }

  friendRealTimeStatus() {
    return this.current_status_friend;
  }

  requestsList(skip: number, take: number) {
    let params = new HttpParams();
    params = params.append('skip', skip);
    params = params.append('take', take);

    return this.http.get(`${hostIp}:3000/friendship/requestsList`, {
      withCredentials: true,
      params: params
    });
  }

  blocklist(skip: number, take: number) {
    let params = new HttpParams();
    params = params.append('skip', skip);
    params = params.append('take', take);

    return this.http.get(`${hostIp}:3000/friendship/blocklist`, {
      withCredentials: true,
      params: params
    });
  }

  friendList(skip: number, take: number) {
    let params = new HttpParams();
    params = params.append('skip', skip);
    params = params.append('take', take);

    return this.http.get(`${hostIp}:3000/friendship/friendList`, {
      withCredentials: true,
      params: params
    });
  }
  isFriend(id: string) {
    return this.http.get(`${hostIp}:3000/friendship/find/${id}`, { withCredentials: true, })
  }

  findthem(userName: string) {
    return this.http.get(`${hostIp}:3000/user/getUsers/${userName}`, { withCredentials: true, })
  }
}
