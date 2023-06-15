import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  }
  public getCurrentUser() : Observable<any>
  {
    return this.http.get('http://localhost:3000/redirection', {withCredentials:true})
  }
  // public callFortyTwo()
  // {
  //   this.http.get('http://localhost:3000/login');
  // }
}
