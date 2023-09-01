import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable, catchError, isEmpty, of, retry } from 'rxjs';

@Injectable()
export class HttpfailInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(retry(1),  catchError((err) => {return of({statusCode: 403})}) )
  }
}
