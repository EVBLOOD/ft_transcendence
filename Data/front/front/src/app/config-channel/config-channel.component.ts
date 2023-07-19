import { Component } from '@angular/core';

@Component({
  selector: 'app-config-channel',
  templateUrl: './config-channel.component.html',
  styleUrls: ['./config-channel.component.scss']
})
export class ConfigChannelComponent {

  privateToggle = false;
  secretToggle = true;

  Channel = 'Annoncement'
  Password = '123456'

  
  clickPrivateChannel(){
    this.privateToggle = !this.privateToggle;
  }
  clickSecretChannel(){
    this.secretToggle = !this.secretToggle;
  }


}

