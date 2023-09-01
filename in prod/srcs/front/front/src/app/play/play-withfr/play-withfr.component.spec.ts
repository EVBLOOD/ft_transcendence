import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayWithfrComponent } from './play-withfr.component';

describe('PlayWithfrComponent', () => {
  let component: PlayWithfrComponent;
  let fixture: ComponentFixture<PlayWithfrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayWithfrComponent]
    });
    fixture = TestBed.createComponent(PlayWithfrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
