import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-activatetwo',
  templateUrl: './activatetwo.component.html',
  styleUrls: ['./activatetwo.component.scss']
})
export class ActivatetwoComponent implements OnInit {
  replay : any;
  token  = new FormControl('');
  isDisplay: boolean = false;
  public data = {title: "2FA", subtitle: "2fa", action: "Confirm"}
  qrcode$ !: Observable<any>;
  constructor(public serviceUser : ProfileService, private router: Router) {
  }
  ngOnInit(): void {
    this.qrcode$ = this.serviceUser.getQrCode();
  }
  close()
  {
    this.router.navigateByUrl('settings');
  }
  callit (data : any)
  {
    if (data.statusCode)
      this.isDisplay = true;
    else
      this.router.navigateByUrl('settings');
  }
  validateInput()
  {
    this.replay = this.serviceUser.confirmQrCode(this.token.value).subscribe({next: (data) => { this.callit(data) },
    complete: () => {this.replay.unsubscribe();}});
  }
}
