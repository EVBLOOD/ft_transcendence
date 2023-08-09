import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUserStatisticsComponent } from './card-user-statistics.component';

describe('CardUserStatisticsComponent', () => {
  let component: CardUserStatisticsComponent;
  let fixture: ComponentFixture<CardUserStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardUserStatisticsComponent]
    });
    fixture = TestBed.createComponent(CardUserStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
