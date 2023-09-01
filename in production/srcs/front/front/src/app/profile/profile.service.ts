import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { hostIp } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile$ = new BehaviorSubject<any>({});
  constructor(private http: HttpClient) {
    this.profile$.next(this.http.get(`${hostIp}:3000/user/_me`, { withCredentials: true }));
  }


  getMyData() {
    return this.profile$;
  }

  getMyObservData() {
    return this.http.get(`${hostIp}:3000/user/_me`, { withCredentials: true });
  }
  getUserData(corrent: string) {
    return this.http.get(`${hostIp}:3000/user/${corrent}`, { withCredentials: true })
  }

  getUserAvatarPath(link: string): string {
    if (!link)
      return "/assets/img/profile.jpeg";
    if (link[0] != 'h')
      return `${hostIp}:3000/avatar/${link}`;
    return link;
  }

  update() {
    this.profile$.next(this.http.get(`${hostIp}:3000/user/_me`, { withCredentials: true }));
  }
  setUserAvatar(file: any) {
    const fileform = new FormData();
    fileform.append('file', file);
    return this.http.put(`${hostIp}:3000/user/upload`, fileform, { withCredentials: true })
  }

  updateUserInfos(object: any) {
    const replay = this.http.post(`${hostIp}:3000/user/updateAll`, object, { withCredentials: true });
    return replay;
  }

  getQrCode() {
    return this.http.get(`${hostIp}:3000/2factorAnable`, { withCredentials: true })
  }

  confirmQrCode(token: any) {
    return this.http.post(`${hostIp}:3000/confirm`, { token: token }, { withCredentials: true })
  }

  logout() {
    return this.http.get(`${hostIp}:3000/logout`, { withCredentials: true });
  }
}
