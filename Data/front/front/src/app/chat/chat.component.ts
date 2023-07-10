import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent {

    toggle = true
    SwitchChat(){
      this.toggle = !this.toggle
    }

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
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false},
      {name: 'karim idbouhouch', avatar: '/assets/images/profile.jpg', status:false, notifs:'5'},
    ]

    channels = [
      {name: 'Annoncement', notifs:'4'},
      {name: 'General', notifs:'9'},
      {name: 'Music', notifs:'8'},
      {name: 'Random', notifs:'40'},
    ]
}
