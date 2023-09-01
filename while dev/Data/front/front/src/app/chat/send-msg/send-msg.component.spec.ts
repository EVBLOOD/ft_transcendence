import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMsgComponent } from './send-msg.component';

describe('SendMsgComponent', () => {
  let component: SendMsgComponent;
  let fixture: ComponentFixture<SendMsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendMsgComponent]
    });
    fixture = TestBed.createComponent(SendMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
