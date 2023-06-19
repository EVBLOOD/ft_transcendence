import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent{

  @Output() parentButtonClick!: () => void;
  public data = {title: "Settings", subtitle: "profile", func: this.close, action: "Update"}
  constructor(private location: Location) {}
  public close()
  {
    this.location.back();
  }
}
