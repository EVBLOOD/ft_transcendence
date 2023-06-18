import { Component } from '@angular/core';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  logo = "PING-PONG 1337";

  dropDown = false;
  onclick(){
    this.dropDown = !this.dropDown
  }

}
