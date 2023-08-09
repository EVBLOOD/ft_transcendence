import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedFriendComponent } from './invited-friend.component';

describe('InvitedFriendComponent', () => {
  let component: InvitedFriendComponent;
  let fixture: ComponentFixture<InvitedFriendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitedFriendComponent]
    });
    fixture = TestBed.createComponent(InvitedFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
