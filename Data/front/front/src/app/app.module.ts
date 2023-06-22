import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
