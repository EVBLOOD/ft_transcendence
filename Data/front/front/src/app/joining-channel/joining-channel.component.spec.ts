import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningChannelComponent } from './joining-channel.component';

describe('JoiningChannelComponent', () => {
  let component: JoiningChannelComponent;
  let fixture: ComponentFixture<JoiningChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoiningChannelComponent]
    });
    fixture = TestBed.createComponent(JoiningChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
