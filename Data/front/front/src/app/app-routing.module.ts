import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './login/guards/auth.guard';
import { twoFacGuard } from './login/guards/two-fac.guard';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';
import { SettingsComponent } from './profile/settings/settings.component';

const routes: Routes = 
                      [
                        {path: '', component: AppComponent, canActivate: [authGuard]},
                        {path: 'login', component: LoginComponent, children:
                      [{path: 'twoFactor', component: TwoFactoryComponent ,canActivate: [twoFacGuard]},]},
                        {path: 'profile/:username', component: ProfileComponent, canActivate: [authGuard]},
                        {path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
