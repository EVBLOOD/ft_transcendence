import {  Injectable, inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';

export  const authGuard: CanActivateFn = async (route, state) => {
    const authService : AuthService = inject(AuthService);
    const switchRoute : Router = inject(Router);
    const replay = await firstValueFrom(authService.getCurrentUser());
    console.log(replay);
    if (replay.statusCode && replay.statusCode == 403)
    {
        if (route.url.toString() == "login")
            return true;
        switchRoute.navigateByUrl('login');
        return false;
    }
    if (replay.steps)
    {
        switchRoute.navigateByUrl('twoFactor');
        return false;
    }
    if (route.url.toString() == 'login')
        switchRoute.navigateByUrl('');  
    return true;
};
