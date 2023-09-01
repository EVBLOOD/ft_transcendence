import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInfoComponent } from './chat-info.component';

describe('ChatInfoComponent', () => {
  let component: ChatInfoComponent;
  let fixture: ComponentFixture<ChatInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatInfoComponent]
    });
    fixture = TestBed.createComponent(ChatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
