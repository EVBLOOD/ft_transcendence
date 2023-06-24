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