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
import { PopupComponent } from './profile/popup/popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderbordComponent } from './leaderbord/leaderbord.component';
import { ChatComponent } from './chat/chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatetwoComponent } from './profile/settings/activatetwo/activatetwo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpfailInterceptor } from './httpfail.interceptor';
import { CardFriendsComponent } from './profile/card-friends/card-friends.component';
import { CardBlockedComponent } from './profile/card-blocked/card-blocked.component';
import { CardRequestComponent } from './profile/card-request/card-request.component';
import { LeaderBordRowComponent } from './leaderbord/leader-bord-row/leader-bord-row.component';
import { AppBodyComponent } from './app-body/app-body.component';
import { PlayComponent } from './play/play.component';
import { GameModule } from './play/game/game.module';
import { PlayWithfrComponent } from './play/play-withfr/play-withfr.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { InviteComponent } from './invite/invite.component';
import { ConfigChannelComponent } from './config-channel/config-channel.component';
import { PopupToBeSureComponent } from './popup-to-be-sure/popup-to-be-sure.component';
import { DMsComponent } from './chat/dms/dms.component';
import { ChannelsComponent } from './chat/channels/channels.component';
import { MessageComponent } from './chat/messages/message.component';
import { SendMsgComponent } from './chat/send-msg/send-msg.component';
import { MessagesMdlComponent } from './chat/messages-mdl/messages-mdl.component';
import { ChatInfoComponent } from './chat/chat-info/chat-info.component';
import { PartChatComponent } from './chat/chat-info/part-chat/part-chat.component';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { JoiningChannelComponent } from './joining-channel/joining-channel.component';
import { InvitedFriendComponent } from './joining-channel/invited-friend/invited-friend.component';
import { InviteLinesComponent } from './invite/invite-lines/invite-lines.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    TwoFactoryComponent,
    SettingsComponent,
    CardUserStatisticsComponent,
    UserHistoryRawComponent,
    PopupComponent,
    LeaderbordComponent,
    PlayComponent,
    ChatComponent,
    ActivatetwoComponent,
    PageNotFoundComponent,
    CardFriendsComponent,
    CardBlockedComponent,
    CardRequestComponent,
    LeaderBordRowComponent,
    AppBodyComponent,
    PlayWithfrComponent,
    CreateChannelComponent,
    InviteComponent,
    ConfigChannelComponent,
    PopupToBeSureComponent,
    DMsComponent,
    ChannelsComponent,
    MessageComponent,
    SendMsgComponent,
    MessagesMdlComponent,
    ChatInfoComponent,
    PartChatComponent,
    ChatContentComponent,
    JoiningChannelComponent,
    InvitedFriendComponent,
    InviteLinesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    GameModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpfailInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
