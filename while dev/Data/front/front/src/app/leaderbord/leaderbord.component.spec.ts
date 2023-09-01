import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderbordComponent } from './leaderbord.component';

describe('LeaderbordComponent', () => {
  let component: LeaderbordComponent;
  let fixture: ComponentFixture<LeaderbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderbordComponent]
    });
    fixture = TestBed.createComponent(LeaderbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
