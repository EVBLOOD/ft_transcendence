import { CanActivateFn, Router } from '@angular/router';
import { GameService } from './game.service';
import { inject } from '@angular/core';

export const isgamingGuard: CanActivateFn = (route, state) => {
  const gameService: GameService = inject(GameService);
  const switchRoute: Router = inject(Router);
  if (gameService.isIngame)
    return true;
  switchRoute.navigateByUrl('/play')
  return false;
};
