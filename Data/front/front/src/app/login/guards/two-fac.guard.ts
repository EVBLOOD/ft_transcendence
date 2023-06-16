import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const twoFacGuard: CanActivateFn = (route, state) => {

  const authService : AuthService = inject(AuthService);
  const switchRoute : Router = inject(Router);

  if (authService.getTwoFactorSatat() == false)
    switchRoute.navigateByUrl('login');

  return authService.getTwoFactorSatat();
};
