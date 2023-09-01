import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteLinesComponent } from './invite-lines.component';

describe('InviteLinesComponent', () => {
  let component: InviteLinesComponent;
  let fixture: ComponentFixture<InviteLinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteLinesComponent]
    });
    fixture = TestBed.createComponent(InviteLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
