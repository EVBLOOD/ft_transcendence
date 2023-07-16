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
export class SettingsComponent implements OnInit, OnDestroy{
  private replay : any;
  fullName  = new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-z]+(-[a-z]+)?$/)]);
  userName  = new FormControl('', [Validators.required, Validators.minLength(5)]);
  Myerror : boolean = false;
  MyerrorAvatar : boolean = false;
  twoFactor : boolean = false;
  PlayTheme : number = 1;
  file : any;
  profileSubject$  !: Observable<any>;

  public profile$ !: Observable<any>;
  private update : any = null;
  private submet_this : any = {avatar: ''};


  public data = {title: "Settings", subtitle: "profile", action: "Update"}
  constructor(public serviceUser : ProfileService, private router: Router) {}
  private replay_ : any;
  
  ngOnInit() {
    this.profileSubject$ = this.serviceUser.getMyData();
    this.replay_ = this.profileSubject$.subscribe({next: (data : Observable<any>) => {
    this.profile$ = data;}});
    this.replay = this.profile$.subscribe({next: (data) => {
      if (data.statusCode)
        this.router.navigateByUrl('');
      this.fullName = new FormControl(data.name, [Validators.required, Validators.minLength(5)]); 
      this.userName =new FormControl(data.username, [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-z]+(-[a-z]+)?$/)]);
      this.twoFactor = data.TwoFAenabled;
      this.PlayTheme = 1; // to add
      this.submet_this.avatar = data.avatar;
    },});
  }
  ngOnDestroy(): void {
    if (this.replay)
      this.replay.unsubscribe();
    if (this.replay_)
      this.replay_.unsubscribe();
  }

  canceltwofactor()
  {
    this.twoFactor = false;
  }
  activetwofactor(){
    this.router.navigateByUrl('/acticatetwo'); 
  }

  getname(index : number)
  {
    if (index === this.PlayTheme)
      return 'activeRadio';
    return '';
  }

  choosePlay(index: number)
  {
    this.PlayTheme = index;
  }
  handleResponse(data : any)
  {
    if (data.statusCode)
      this.Myerror = true;
    else
    {
      this.serviceUser.update();
      this.router.navigateByUrl('');
    }
    this.update.unsubscribe();
  }
  funct(file : any)
  { 
    this.file = file.target.files[0];
  }
  handleResponseone(data : any)
  {
    if (data.statusCode && data.statusCode != 202)
      this.MyerrorAvatar = true;
    else
    {
      this.MyerrorAvatar = false;
      this.serviceUser.update();
    }
    this.update.unsubscribe();
  }

  async validateInput()
  {
    if (this.userName.errors || this.fullName.errors)
      return ;
    if (this.file)
      this.update = this.serviceUser.setUserAvatar(this.file).subscribe({next: (data) => {this.handleResponseone(data)}})
    if (!this.fullName.pristine || !this.userName.pristine)
      this.update = this.serviceUser.updateUserInfos({username: this.userName.value,
        name: this.fullName.value,
        avatar: this.submet_this.avatar,
        twofactor: this.twoFactor}).subscribe(
      {next: (data) => {this.handleResponse(data)},}
    );
  }

  close()
  {
    this.router.navigateByUrl('')
  }

}