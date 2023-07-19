import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupToBeSureComponent } from './popup-to-be-sure.component';

describe('PopupToBeSureComponent', () => {
  let component: PopupToBeSureComponent;
  let fixture: ComponentFixture<PopupToBeSureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupToBeSureComponent]
    });
    fixture = TestBed.createComponent(PopupToBeSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
