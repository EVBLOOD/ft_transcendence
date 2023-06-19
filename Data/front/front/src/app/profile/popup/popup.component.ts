import { Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { Subject } from 'rxjs';
import { SettingsComponent } from '../settings/settings.component';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit{
  @Input() data: any;
  parentButtonClick = new EventEmitter<void>();
  constructor(private location: Location) { }
  ngOnInit(): void
  {}
  public close()
  {
    this.location.back();
  }
  
  notifyChild() {
    this.parentButtonClick.emit();
  }
}
