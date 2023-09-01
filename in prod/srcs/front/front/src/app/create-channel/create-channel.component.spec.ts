import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelComponent } from './create-channel.component';

describe('CreateChannelComponent', () => {
  let component: CreateChannelComponent;
  let fixture: ComponentFixture<CreateChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChannelComponent]
    });
    fixture = TestBed.createComponent(CreateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
