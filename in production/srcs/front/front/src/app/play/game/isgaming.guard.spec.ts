import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isgamingGuard } from './isgaming.guard';

describe('isgamingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isgamingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
