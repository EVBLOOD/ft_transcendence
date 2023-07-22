import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EMPTY, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private twofactor: boolean = false;
  private id !: number;

  constructor(private http: HttpClient) {
  }
  public getCurrentUser(): Observable<any> {
    return this.http.get('http://10.13.4.8:3000/isItLogged', { withCredentials: true }).pipe(catchError((err, caught) => EMPTY))
  }
  public getTwoFactorSatat(): boolean {
    return this.twofactor;
  }
  public setId(id: number) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public setTwoFactorSatat(param: boolean) {
    this.twofactor = param;
  }
  // public callFortyTwo()
  public gowild(token: string): Observable<any> {
    return this.http.post('http://10.13.4.8:3000/validate', { token: token }, { withCredentials: true }).pipe(catchError((err, caught) => EMPTY));
  }
  logout() {
    return this.http.get('http://10.13.4.8:3000/logout', { withCredentials: true }).pipe(catchError((err, caught) => EMPTY));
  }
}
