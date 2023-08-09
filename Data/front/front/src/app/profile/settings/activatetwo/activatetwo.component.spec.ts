import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatetwoComponent } from './activatetwo.component';

describe('ActivatetwoComponent', () => {
  let component: ActivatetwoComponent;
  let fixture: ComponentFixture<ActivatetwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivatetwoComponent]
    });
    fixture = TestBed.createComponent(ActivatetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
