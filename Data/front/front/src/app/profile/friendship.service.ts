import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor( private http: HttpClient ) { }

  addFriend(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/send', {Userone: username}, {withCredentials: true});
  }
  
  acceptRequest(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/accept', {Userone: username}, {withCredentials: true});
  }
  
  blockUser(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/blocking', {Userone: username}, {withCredentials: true});
    
  }

  unfriendUser(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/unfriend', {Userone: username}, {withCredentials: true});
  }
  
  cancelFriendRequest(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/unfriend', {Userone: username}, {withCredentials: true});
  }


  unblockUser(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/unblock', {Userone: username}, {withCredentials: true});
  }

  friendStatus(username : string)
  {
    return this.http.post('http://localhost:3000/friendship/friendStatus', {Userone: username}, {withCredentials: true});
  }
}
