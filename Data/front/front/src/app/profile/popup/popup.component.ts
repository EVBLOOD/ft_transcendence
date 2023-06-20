import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit{
  @Input() data: any;
  @Output() ChildrenEvent = new EventEmitter();
  parentButtonClick = new EventEmitter<void>();
  constructor() { }
  ngOnInit(): void
  {}
  
  notifyChild() {
    this.parentButtonClick.emit();
  }
}
