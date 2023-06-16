import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './login/profile/profile.component';
import { authGuard } from './login/guards/auth.guard';
import { SaadComponent } from './saad/saad.component';
import { twoFacGuard } from './login/guards/two-fac.guard';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';

const routes: Routes = 
                      [
                        {path: '', component: AppComponent, canActivate: [authGuard]},
                        {path: 'login', component: LoginComponent, canActivate: [authGuard]},
                        {path: 'twoFactor', component: TwoFactoryComponent ,canActivate: [twoFacGuard]},
                        {path: 'saad', component: SaadComponent, },
                        {path: 'profile', component: ProfileComponent, canActivate: [authGuard]}
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
