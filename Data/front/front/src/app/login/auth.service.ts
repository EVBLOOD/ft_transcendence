import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EMPTY, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private twofactor: boolean = false;

  constructor(private http: HttpClient) {
  }
  public getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:3000/isItLogged', { withCredentials: true }).pipe(catchError((err, caught) => EMPTY))
  }
  public getTwoFactorSatat(): boolean {
    return this.twofactor;
  }

  public setTwoFactorSatat(param: boolean) {
    this.twofactor = param;
  }
  // public callFortyTwo()
  public gowild(token: string): Observable<any> {
    return this.http.post('http://localhost:3000/validate', { token: token }, { withCredentials: true }).pipe(catchError((err, caught) => EMPTY));
  }
  logout() {
    return this.http.get('http://localhost:3000/logout', { withCredentials: true }).pipe(catchError((err, caught) => EMPTY));
  }
}
