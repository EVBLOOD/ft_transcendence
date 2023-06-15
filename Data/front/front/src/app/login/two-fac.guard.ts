import { CanActivateFn } from '@angular/router';

export const twoFacGuard: CanActivateFn = (route, state) => {
  return true;
};
