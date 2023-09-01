import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-two-factory',
  templateUrl: './two-factory.component.html',
  styleUrls: ['./two-factory.component.scss']
})
export class TwoFactoryComponent implements OnDestroy {

  constructor(private authSer: AuthService, private router: Router) { }
  private errorState = 'none';
  token = new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(6), Validators.minLength(6)]);
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  letsgo() {
    try {
      if (!this.token.value || this.token.errors || this.token.pristine)
        return;
      this.removesubsc = this.authSer.gowild(this.token.value).subscribe(
        { next: (data) => { this.handleResponseLetsgo(data) }, });
      this.SubArray.push(this.removesubsc);
    }
    catch (err) {
      console.log("tpo is not valid");
    }
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }

  getError() {
    return this.errorState;
  }

  handleResponseLetsgo(data: any) {
    if (data.statusCode)
      this.errorState = 'block';
    else
      this.router.navigateByUrl('');
  }

  justCancel() {
    this.removesubsc = this.authSer.logout().subscribe({ next: (data) => { this.router.navigateByUrl('login'); }, complete: () => { } });
    this.SubArray.push(this.removesubsc)
  }
}

