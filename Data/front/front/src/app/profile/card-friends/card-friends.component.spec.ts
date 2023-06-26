import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFriendsComponent } from './card-friends.component';

describe('CardFriendsComponent', () => {
  let component: CardFriendsComponent;
  let fixture: ComponentFixture<CardFriendsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardFriendsComponent]
    });
    fixture = TestBed.createComponent(CardFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
