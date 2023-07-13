import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TwoFactoryComponent } from './login/two-factory/two-factory.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { CardUserStatisticsComponent } from './profile/card-user-statistics/card-user-statistics.component';
import { UserHistoryRawComponent } from './profile/user-history-raw/user-history-raw.component';
import { PgbuttonComponent } from './profile/pgbutton/pgbutton.component';
import { PopupComponent } from './profile/popup/popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderbordComponent } from './leaderbord/leaderbord.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatetwoComponent } from './profile/settings/activatetwo/activatetwo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpfailInterceptor } from './httpfail.interceptor';
import { CardFriendsComponent } from './profile/card-friends/card-friends.component';
import { CardBlockedComponent } from './profile/card-blocked/card-blocked.component';
import { CardRequestComponent } from './profile/card-request/card-request.component';
import { LeaderBordRowComponent } from './leaderbord/leader-bord-row/leader-bord-row.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    TwoFactoryComponent,
    SettingsComponent,
    CardUserStatisticsComponent,
    UserHistoryRawComponent,
    PgbuttonComponent,
    PopupComponent,
    LeaderbordComponent,
    GameComponent,
    ChatComponent,
    ActivatetwoComponent,
    PageNotFoundComponent,
    CardFriendsComponent,
    CardBlockedComponent,
    CardRequestComponent,
    LeaderBordRowComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: HttpfailInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
