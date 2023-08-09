import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryRawComponent } from './user-history-raw.component';

describe('UserHistoryRawComponent', () => {
  let component: UserHistoryRawComponent;
  let fixture: ComponentFixture<UserHistoryRawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHistoryRawComponent]
    });
    fixture = TestBed.createComponent(UserHistoryRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
