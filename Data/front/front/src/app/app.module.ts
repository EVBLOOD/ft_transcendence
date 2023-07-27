import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationComponent } from './application/application.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { PopupComponent } from './popup/popup.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { InviteComponent } from './invite/invite.component';
import { ConfigChannelComponent } from './config-channel/config-channel.component';
import { PopupToBeSureComponent } from './popup-to-be-sure/popup-to-be-sure.component';
import { JoinToChannelComponent } from './join-to-channel/join-to-channel.component';

@NgModule({
  declarations: [
    AppComponent,
    ApplicationComponent,
    ChatComponent,
    PopupComponent,
    CreateChannelComponent,
    InviteComponent,
    ConfigChannelComponent,
    PopupToBeSureComponent,
    JoinToChannelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
