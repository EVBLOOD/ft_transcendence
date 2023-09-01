import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-activatetwo',
  templateUrl: './activatetwo.component.html',
  styleUrls: ['./activatetwo.component.scss']
})
export class ActivatetwoComponent implements OnInit, OnDestroy {
  token = new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(6), Validators.minLength(6)]);
  isDisplay: boolean = false;
  public data = { title: "2FA", subtitle: "2fa", action: "Confirm" }
  qrcode$ !: Observable<any>;

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(public serviceUser: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.qrcode$ = this.serviceUser.getQrCode();
  }

  close() {
    this.router.navigateByUrl('settings');
  }

  callit(data: any) {
    if (data.statusCode)
      this.isDisplay = true;
    else
      this.router.navigateByUrl('');
  }

  validateInput() {
    if (this.token.errors || this.token.pristine)
      return;
    this.removesubsc = this.serviceUser.confirmQrCode(this.token.value).subscribe({
      next: (data) => { this.callit(data) },
      complete: () => { }
    });
    this.SubArray.push(this.removesubsc)
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => element?.unsubscribe())
  }
}
