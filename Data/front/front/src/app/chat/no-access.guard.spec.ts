import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noACCESSGuard } from './no-access.guard';

describe('noACCESSGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noACCESSGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
