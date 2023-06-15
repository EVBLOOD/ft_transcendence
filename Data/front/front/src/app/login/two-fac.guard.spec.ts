import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { twoFacGuard } from './two-fac.guard';

describe('twoFacGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => twoFacGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
