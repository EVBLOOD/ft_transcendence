import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinToChannelComponent } from './join-to-channel.component';

describe('JoinToChannelComponent', () => {
  let component: JoinToChannelComponent;
  let fixture: ComponentFixture<JoinToChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinToChannelComponent]
    });
    fixture = TestBed.createComponent(JoinToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
