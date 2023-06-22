import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './login/guards/auth.guard';
import { twoFacGuard } from './login/guards/two-fac.guard';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderbordComponent } from './leaderbord/leaderbord.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { ActivatetwoComponent } from './profile/settings/activatetwo/activatetwo.component';

const routes: Routes = 
                      [
                        {path: '', component: ProfileComponent, canActivate: [authGuard]},
                        {path: 'game', component: GameComponent,  canActivate: [authGuard]},
                        {path: 'settings', component: SettingsComponent,  canActivate: [authGuard]},
                       {path: 'acticatetwo', component: ActivatetwoComponent ,canActivate: [authGuard]},
                        {path: 'activatetwof', component: ActivatetwoComponent,  canActivate: [authGuard]},
                        {path: 'chat', component: ChatComponent,  canActivate: [authGuard]},
                        {path: 'leaderboard', component: LeaderbordComponent,  canActivate: [authGuard]},
                        {path: 'login', component: LoginComponent,  canActivate: [authGuard]},
                        {path: 'twoFactor', component: TwoFactoryComponent ,canActivate: [twoFacGuard]},
                        {path: 'profile/:username', component: ProfileComponent, canActivate: [authGuard]},
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
