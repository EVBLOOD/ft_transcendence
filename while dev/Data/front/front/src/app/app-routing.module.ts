import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './login/guards/auth.guard';
import { twoFacGuard } from './login/guards/two-fac.guard';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';
import { PlayComponent } from './play/play.component';
import { LeaderbordComponent } from './leaderbord/leaderbord.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { ActivatetwoComponent } from './profile/settings/activatetwo/activatetwo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppBodyComponent } from './app-body/app-body.component';
import { GameComponent } from './play/game/game.component';
import { isgamingGuard } from './play/game/isgaming.guard';
import { ConfigChannelComponent } from './config-channel/config-channel.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { ChatComponent } from './chat/chat.component';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { InviteComponent } from './invite/invite.component';
import { PopupToBeSureComponent } from './popup-to-be-sure/popup-to-be-sure.component';
import { JoiningChannelComponent } from './joining-channel/joining-channel.component';
import { noACCESSGuard } from './chat/no-access.guard';
import { dMACCESSGuard } from './chat/dm-access.guard';

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
        {
          path: 'chat', component: ChatComponent, canActivate: [authGuard],
          children: [
            { path: ':id', component: ChatContentComponent, canActivate: [authGuard, noACCESSGuard] },
            { path: 'dm/:username', component: ChatContentComponent, canActivate: [authGuard, dMACCESSGuard] }
          ]
        },
        { path: 'leaderboard', component: LeaderbordComponent, canActivate: [authGuard] },
        { path: 'profile/:username', component: ProfileComponent, canActivate: [authGuard] },
        { path: 'channelSetting/:id', component: ConfigChannelComponent, canActivate: [authGuard, noACCESSGuard] },
        { path: 'confirm/:id', component: PopupToBeSureComponent, canActivate: [authGuard] },
        { path: 'invite/:id', component: InviteComponent, canActivate: [authGuard] },
        { path: 'channelCreating', component: CreateChannelComponent, canActivate: [authGuard] },
        { path: 'joinChannel', component: JoiningChannelComponent, canActivate: [authGuard] }
      ]
    },
    { path: '**', component: PageNotFoundComponent, canActivate: [authGuard] },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
