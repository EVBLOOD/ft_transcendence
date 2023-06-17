import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factory',
  templateUrl: './two-factory.component.html',
  styleUrls: ['./two-factory.component.scss']
})
export class TwoFactoryComponent {
  
  constructor(private authSer : AuthService, private router: Router) {}
  private token : string = '';
  private replay : any;
  private errorState = 'none';
  
  letsgo()
  {
    try
    {
      this.replay = this.authSer.gowild(this.token).subscribe(
        {next: (data) => {this.handleResponseLetsgo(data)},});
    }
    catch (err)
    {
      console.error("Make sure the tpo is valid");
    }
  }

  setData(event : any)
  {
    this.token = event.target.value;
    console.log(this.token);
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
    this.router.navigateByUrl('login');
  }
}

/*
to Improve this:
- clear input in error case
-  change the input design
*/
