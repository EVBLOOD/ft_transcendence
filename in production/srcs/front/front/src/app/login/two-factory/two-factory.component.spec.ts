import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactoryComponent } from './two-factory.component';

describe('TwoFactoryComponent', () => {
  let component: TwoFactoryComponent;
  let fixture: ComponentFixture<TwoFactoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactoryComponent]
    });
    fixture = TestBed.createComponent(TwoFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
