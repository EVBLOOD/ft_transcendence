import { Component } from '@angular/core';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {


  // close()
  // {
  //   this.router.navigateByUrl('')
  // }

  privateToggle = false;
  secretToggle = false;
  
  clickPrivateChannel(){
    this.privateToggle = !this.privateToggle;
  }
  clickSecretChannel(){
    this.secretToggle = !this.secretToggle;
  }


}
