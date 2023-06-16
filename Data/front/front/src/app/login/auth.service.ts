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
    return this.http.get('http://localhost:3000/redirection', {withCredentials:true})
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
  // {
  //   this.http.get('http://localhost:3000/login');
  // }
}
