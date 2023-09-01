import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderBordRowComponent } from './leader-bord-row.component';

describe('LeaderBordRowComponent', () => {
  let component: LeaderBordRowComponent;
  let fixture: ComponentFixture<LeaderBordRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderBordRowComponent]
    });
    fixture = TestBed.createComponent(LeaderBordRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
