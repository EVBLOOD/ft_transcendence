import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserData(corrent : string)
  {
    // console.log(this.http.get('http://localhost:3000/redirection', {withCredentials: true}).subscribe());
    // return this.http.get('http://localhost:3000/redirection', {withCredentials: true})
    if (!corrent || corrent == '')
      return this.http.get('http://localhost:3000/user/me', {withCredentials: true})
    return this.http.get('http://localhost:3000/user/' + corrent, {withCredentials: true})
    
  }

  getUserAvatarPath(link: string) : string
  {
    if (!link)
      return "/assets/img/profile.jpeg";
    if (link[0] != 'h')
      return 'http://localhost:3000/avatar/' + link;
    return link;
  }

  setUserAvatar(path: string)
  {

  }

  updateUserInfos(object: any)
  {
    console.log(object)
    return this.http.post('http://localhost:3000/user/updateAll', object, {withCredentials: true});
  }
}
