import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesMdlComponent } from './messages-mdl.component';

describe('MessagesMdlComponent', () => {
  let component: MessagesMdlComponent;
  let fixture: ComponentFixture<MessagesMdlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesMdlComponent]
    });
    fixture = TestBed.createComponent(MessagesMdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
