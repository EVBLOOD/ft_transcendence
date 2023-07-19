import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigChannelComponent } from './config-channel.component';

describe('ConfigChannelComponent', () => {
  let component: ConfigChannelComponent;
  let fixture: ComponentFixture<ConfigChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigChannelComponent]
    });
    fixture = TestBed.createComponent(ConfigChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
