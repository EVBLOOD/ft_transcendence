import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const twoFacGuard: CanActivateFn = async (route, state) => {

  const authService: AuthService = inject(AuthService);
  const switchRoute: Router = inject(Router);
  let replay: any = {};
  try {
    replay = await firstValueFrom(authService.getCurrentUser(), { defaultValue: { statusCode: 403 } });
  }
  catch (err) {
    replay = { statusCode: 403 }
  }
  if (replay?.statusCode && replay.statusCode == 403) {
    switchRoute.navigateByUrl('login');
    return false;
  }
  if (!replay.steps) {
    switchRoute.navigateByUrl('');
    return true;
  }
  return true;
  // return replay.steps;
};
