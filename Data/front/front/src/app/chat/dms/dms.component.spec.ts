import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMsComponent } from './dms.component';

describe('DMsComponent', () => {
  let component: DMsComponent;
  let fixture: ComponentFixture<DMsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DMsComponent]
    });
    fixture = TestBed.createComponent(DMsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
