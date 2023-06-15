import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './login/profile/profile.component';
import { authGuard } from './login/auth.guard';
import { SaadComponent } from './saad/saad.component';

const routes: Routes = 
                      [
                        {path: '', component: AppComponent, canActivate: [authGuard]},
                        {path: 'saad', component: SaadComponent, },
                        {path: 'login', component: LoginComponent},
                        {path: 'profile', component: ProfileComponent, canActivate: [authGuard]}
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
