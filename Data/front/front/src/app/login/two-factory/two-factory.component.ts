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

  handleResponseLetsgo(data: any)
  {
    if (data.statusCode)
      console.error("Make sure the tpo is valid");
    else
    {
      this.replay.unsubscribe();
      this.router.navigateByUrl('');
    }
    this.replay.unsubscribe();
  }
}
