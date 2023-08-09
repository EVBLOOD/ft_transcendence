import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartChatComponent } from './part-chat.component';

describe('PartChatComponent', () => {
  let component: PartChatComponent;
  let fixture: ComponentFixture<PartChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartChatComponent]
    });
    fixture = TestBed.createComponent(PartChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
