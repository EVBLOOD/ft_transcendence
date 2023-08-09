import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgbuttonComponent } from './pgbutton.component';

describe('PgbuttonComponent', () => {
  let component: PgbuttonComponent;
  let fixture: ComponentFixture<PgbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PgbuttonComponent]
    });
    fixture = TestBed.createComponent(PgbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
