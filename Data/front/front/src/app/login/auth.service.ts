import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private twofactor : boolean = false;

  constructor(private http: HttpClient) { 
  }
  public getCurrentUser() : Observable<any>
  {
    return this.http.get('http://localhost:3000/isItLogged', {withCredentials: true})
  }
  public getTwoFactorSatat() : boolean
  {
    return this.twofactor;
  }

  public setTwoFactorSatat(param : boolean)
  {
    this.twofactor = param;
  }
  // public callFortyTwo()
  public gowild(token : string)  : Observable<any>
  {
    return this.http.post('http://localhost:3000/validate', {token: token}, {withCredentials: true});
  }
  logout()
  {
    return this.http.get('http://localhost:3000/logout', {withCredentials: true});
  }
}
