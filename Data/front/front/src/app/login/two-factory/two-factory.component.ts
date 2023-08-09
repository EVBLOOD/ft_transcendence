import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-two-factory',
  templateUrl: './two-factory.component.html',
  styleUrls: ['./two-factory.component.scss']
})
export class TwoFactoryComponent {
  
  constructor(private authSer : AuthService, private router: Router) {}
  private replay : any;
  private errorState = 'none';
  token  = new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(6),  Validators.minLength(6)]);
  letsgo()
  {
    try
    {
      if (!this.token.value || this.token.errors || this.token.pristine)
        return;
      this.replay = this.authSer.gowild(this.token.value).subscribe(
        {next: (data) => {this.handleResponseLetsgo(data)},});
    }
    catch (err)
    {
      console.log("tpo is not valid");
    }
  }


  getError()
  {
    return this.errorState;
  }
  handleResponseLetsgo(data: any)
  {
    if (data.statusCode)
      this.errorState = 'block';
    else
    {
      this.replay.unsubscribe();
      this.router.navigateByUrl('');
    }
    this.replay.unsubscribe();
  }
  justCancel()
  {
    this.replay = this.authSer.logout().subscribe({next: (data) => {this.router.navigateByUrl('login');}, complete: () => {this.replay.unsubscribe()}});
  }
}

/*
to Improve this:
- clear input in error case
-  change the input design
*/
