import {  Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { EMPTY, catchError, firstValueFrom, map, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';



// const handleError : any = (error: HttpErrorResponse) =>
// {
//     // if (error.status === 0) {
//     //   // A client-side or network error occurred. Handle it accordingly.
//     //   console.lof('An error occurred:', error.error);
//     // } else {
//     //   // The backend returned an unsuccessful response code.
//     //   // The response body may contain clues as to what went wrong.
//     //   console.error(
//     //     `Backend returned code ${error.status}, body was: `, error.error);
//     // }
//     // // Return an observable with a user-facing error message.
//     // return throwError(() => new Error('Something bad happened; please try again later.'));
// }

// @Injectable({providedIn: 'root'})
export  const authGuard: CanActivateFn = async (route, state) => {
    const authService : AuthService = inject(AuthService);
    const replay = await firstValueFrom(authService.getCurrentUser());
    console.log(replay);
    if (replay.statusCode == 403)
        return false;
    return true;
};
