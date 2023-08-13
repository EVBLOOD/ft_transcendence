import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../profile.service';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private replay: any;
  fullName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  userName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
  Myerror: boolean = false;
  MyerrorAvatar: boolean = false;
  twoFactor: boolean = false;
  PlayTheme: number = 1;
  PlayThemeInit: number = 1;
  file: any;
  profileSubject$  !: Observable<any>;
  twoFactorInit: boolean = false;

  public profile$ !: Observable<any>;
  private submet_this: any = { avatar: '' };

  public data = { title: "Settings", subtitle: "profile", action: "Update" }

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(public serviceUser: ProfileService, private router: Router) { }

  ngOnInit() {

    this.profileSubject$ = this.serviceUser.getMyData();
    this.removesubsc = this.profileSubject$.subscribe({
      next: (data: Observable<any>) => {
        this.profile$ = data;
      }
    });

    this.SubArray.push(this.removesubsc)
    this.removesubsc = this.profile$.subscribe({
      next: (data) => {
        if (data.statusCode)
          this.router.navigateByUrl('');
        this.fullName = new FormControl(data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
        this.userName = new FormControl(data.username, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-z]+(-[a-z]+)?$/)]);
        this.twoFactor = data.TwoFAenabled;
        this.PlayTheme = data.theme;
        this.PlayThemeInit = data.theme;
        this.submet_this.avatar = data.avatar;
        this.twoFactorInit = this.twoFactor;
      },
    });
    this.SubArray.push(this.removesubsc)

  }

  ngOnDestroy(): void {
    this.SubArray.forEach(element => {
      element?.unsubscribe()
    });
  }

  canceltwofactor() {
    this.twoFactor = false;
  }
  activetwofactor() {
    if (this.twoFactorInit == false)
      this.router.navigateByUrl('/acticatetwo');
  }

  getname(index: number) {
    if (index === this.PlayTheme)
      return 'activeRadio';
    return '';
  }

  choosePlay(index: number) {
    this.PlayTheme = index;
  }

  handleResponse(data: any) {
    if (data.statusCode)
      this.Myerror = true;
    else {
      if (this.file) {
        this.removesubsc = this.serviceUser.setUserAvatar(this.file).subscribe({ next: (data) => { this.handleResponseone(data) } })
        this.SubArray.push(this.removesubsc)
      }
      this.serviceUser.update();
      this.router.navigateByUrl('');
    }
  }

  funct(file: any) {
    this.file = file.target.files[0];
  }

  handleResponseone(data: any) {
    // console.log(data)
    if (data.statusCode && data.statusCode != 202)
      this.MyerrorAvatar = true;
    else {
      this.MyerrorAvatar = false;
      this.serviceUser.update();
      this.router.navigateByUrl('');
    }
  }

  async validateInput() {

    if (this.userName.errors || this.fullName.errors)
      return;

    if (this.file && !(!this.fullName.pristine && this.fullName.value?.trim().length) || !this.userName.pristine || this.PlayTheme != this.PlayThemeInit || this.twoFactor != this.twoFactorInit) {
      this.removesubsc = this.serviceUser.setUserAvatar(this.file).subscribe({ next: (data) => { this.handleResponseone(data) } })
      this.SubArray.push(this.removesubsc)
    }

    if ((!this.fullName.pristine && this.fullName.value?.trim().length) || !this.userName.pristine || this.PlayTheme != this.PlayThemeInit || this.twoFactor != this.twoFactorInit) {
      this.removesubsc = this.serviceUser.updateUserInfos({
        username: this.userName.value,
        name: this.fullName.value,
        avatar: this.submet_this.avatar,
        twofactor: this.twoFactor,
        theme: this.PlayTheme
      }).subscribe(
        { next: (data) => { this.handleResponse(data) }, }
      );
      this.SubArray.push(this.removesubsc)
    }
  }

  close() {
    this.router.navigateByUrl('')
  }

}