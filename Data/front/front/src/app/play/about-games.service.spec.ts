import { TestBed } from '@angular/core/testing';

import { AboutGamesService } from './about-games.service';

describe('AboutGamesService', () => {
  let service: AboutGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutGamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
