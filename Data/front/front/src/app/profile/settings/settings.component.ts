import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../profile.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy{
  @Output() ChildEvent = new EventEmitter();
  private replay : any;
  fullName  = new FormControl('');
  userName  = new FormControl('');
  twoFactor : boolean = false;
  GameTheme : number = 1;

  public profile$ !: Observable<any>;
  private update : any = null;
  private submet_this : any = {avatar: '', email: ''};


  public data = {title: "Settings", subtitle: "profile", action: "Update"}
  constructor(public serviceUser : ProfileService,private router: Router) {
  
  }
  ngOnInit() {
    this.profile$ = this.serviceUser.getUserData('');
    this.replay = this.profile$.subscribe({next: (data) => {
      if (data.statusCode)
        this.router.navigateByUrl('');
      this.fullName = new FormControl(data.name);
      this.userName = new FormControl(data.username);
      this.twoFactor = data.TwoFAenabled;
      this.GameTheme = 1; // to add
      this.submet_this.avatar = data.avatar;
      this.submet_this.email = data.email;
    },});
  }
  ngOnDestroy(): void {
    this.replay.unsubscribe();
    if (this.update)
      this.update.unsubscribe()
  }

  canceltwofactor()
  {
    console.log('remove two factor');
    this.twoFactor = false;
  }
  
  activetwofactor(){
    this.ChildEvent.emit();
    console.log("open new popUp or here");
  }

  getname(index : number)
  {
    if (index === this.GameTheme)
      return 'activeRadio';
    return '';
  }

  chooseGame(index: number)
  {
    this.GameTheme = index;
  }
  handleResponse(data : any)
  {
    console.log(data);
    if (data.statusCode)
      console.log('error msg')
      else
      {
        this.ChildEvent.emit();
        console.log('success')
    this.ChildEvent.emit();

    }
    this.replay.unsubscribe();
  }
  async validateInput()
  {
      this.update = this.serviceUser.updateUserInfos({username: this.userName,
        name: this.fullName, TwoFAenabled: this.twoFactor, email: this.submet_this.email,
        avatar: this.submet_this.avatar}).subscribe(
      {next: (data) => {this.handleResponse(data)},}
    );
  }
}