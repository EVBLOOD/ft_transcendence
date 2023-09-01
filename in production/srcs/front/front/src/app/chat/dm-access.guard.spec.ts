import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dMACCESSGuard } from './dm-access.guard';

describe('dMACCESSGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dMACCESSGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
