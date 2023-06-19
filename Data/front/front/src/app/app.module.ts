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
    PopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
