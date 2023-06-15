import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaadComponent } from './saad.component';

describe('SaadComponent', () => {
  let component: SaadComponent;
  let fixture: ComponentFixture<SaadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaadComponent]
    });
    fixture = TestBed.createComponent(SaadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
