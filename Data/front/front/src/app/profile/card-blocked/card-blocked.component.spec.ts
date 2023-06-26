import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBlockedComponent } from './card-blocked.component';

describe('CardBlockedComponent', () => {
  let component: CardBlockedComponent;
  let fixture: ComponentFixture<CardBlockedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardBlockedComponent]
    });
    fixture = TestBed.createComponent(CardBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
