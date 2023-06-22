import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserData(corrent : string)
  {
    if (!corrent || corrent == '')
      return this.http.get('http://localhost:3000/user/_me', {withCredentials: true})
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

  setUserAvatar(file: any)
  {

    const fileform = new FormData();
    fileform.append('file', file);
    return this.http.put('http://localhost:3000/user/upload', fileform , {withCredentials: true} )
  }

  updateUserInfos(object: any)
  {
    return this.http.post('http://localhost:3000/user/updateAll', object, {withCredentials: true});
  }

  getQrCode()
  {
    return this.http.get('http://localhost:3000/2factorAnable', {withCredentials: true})
  }

  confirmQrCode(token: any)
  {
    return this.http.post('http://localhost:3000/confirm', {token: token}, {withCredentials: true})
  }

  logout()
  {
    return this.http.get('http://localhost:3000/logout', {withCredentials: true});
  }
}
