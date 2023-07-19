import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteComponent } from './invite.component';

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteComponent]
    });
    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
