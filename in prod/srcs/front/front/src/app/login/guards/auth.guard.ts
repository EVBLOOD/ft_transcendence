import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, firstValueFrom, of } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService: AuthService = inject(AuthService);
    const switchRoute: Router = inject(Router);
    let replay: any = {};
    try {
        replay = await firstValueFrom(authService.getCurrentUser().pipe(catchError(err => {
            return of({ statusCode: 403 })
        })))
    }
    catch (err) {
        replay = { statusCode: 403 }
    }
    if (replay?.statusCode && replay.statusCode == 403) {
        if (route.url.toString() == "login")
            return true;
        switchRoute.navigateByUrl('login');
        return false;
    }
    if (replay.steps) {
        switchRoute.navigateByUrl('twoFactor');
        return false;
    }
    authService.setId(replay.sub);
    if (route.url.toString() == 'login')
        switchRoute.navigateByUrl('');
    return true;
};
