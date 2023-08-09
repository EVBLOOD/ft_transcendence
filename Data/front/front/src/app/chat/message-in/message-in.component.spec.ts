import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInComponent } from './message-in.component';

describe('MessageInComponent', () => {
  let component: MessageInComponent;
  let fixture: ComponentFixture<MessageInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageInComponent]
    });
    fixture = TestBed.createComponent(MessageInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
