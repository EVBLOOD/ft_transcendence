import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const twoFacGuard: CanActivateFn = async (route, state) => {

  const authService : AuthService = inject(AuthService);
  const switchRoute : Router = inject(Router);
  const replay = await firstValueFrom(authService.getCurrentUser());
  if (replay.statusCode && replay.statusCode == 403)
  {
    switchRoute.navigateByUrl('login');
    return false;
  }
  return replay.steps;
};
