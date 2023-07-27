import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedIntoComponent } from './invited-into.component';

describe('InvitedIntoComponent', () => {
  let component: InvitedIntoComponent;
  let fixture: ComponentFixture<InvitedIntoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitedIntoComponent]
    });
    fixture = TestBed.createComponent(InvitedIntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
