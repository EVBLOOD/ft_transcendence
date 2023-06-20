import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {


    friends = [
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:true, notifs:'5'},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:true, notifs:'5'},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:true, notifs:'5'},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:true, notifs:'5'},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:true, notifs:'5'},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false, notifs:'5'},

    ]
}
