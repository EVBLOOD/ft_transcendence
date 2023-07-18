import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './login/guards/auth.guard';
import { twoFacGuard } from './login/guards/two-fac.guard';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';
import { PlayComponent } from './play/play.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderbordComponent } from './leaderbord/leaderbord.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { ActivatetwoComponent } from './profile/settings/activatetwo/activatetwo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppBodyComponent } from './app-body/app-body.component';
import { GameComponent } from './play/game/game.component';
import { isgamingGuard } from './play/game/isgaming.guard';

const routes: Routes =
  [
    { path: 'login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'twoFactor', component: TwoFactoryComponent, canActivate: [twoFacGuard] },
    {
      path: '', component: AppBodyComponent, canActivate: [authGuard], children: [
        { path: '', component: ProfileComponent, canActivate: [authGuard] },
        { path: 'play', component: PlayComponent, canActivate: [authGuard] },
        { path: 'game', component: GameComponent, canActivate: [authGuard, isgamingGuard] },
        { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
        { path: 'acticatetwo', component: ActivatetwoComponent, canActivate: [authGuard] },
        { path: 'activatetwof', component: ActivatetwoComponent, canActivate: [authGuard] },
        { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
        { path: 'leaderboard', component: LeaderbordComponent, canActivate: [authGuard] },
        { path: 'profile/:username', component: ProfileComponent, canActivate: [authGuard] },
      ]
    },
    { path: '**', component: PageNotFoundComponent, canActivate: [authGuard] },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
