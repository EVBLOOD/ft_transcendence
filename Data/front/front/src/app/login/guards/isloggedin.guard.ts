import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const isloggedinGuard: CanActivateFn = async (route, state) => {

  const authService : AuthService = inject(AuthService);
  const switchRoute : Router = inject(Router);
  const replay = await firstValueFrom(authService.getCurrentUser());
  if (!replay.statusCode)
    return false;
  switchRoute.navigateByUrl('');
  return true;
};
