import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { ApplicationComponent } from './application/application.component';
import { PopupComponent } from './popup/popup.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { InviteComponent } from './invite/invite.component';


const routes: Routes = 
                      [
                        {path: '', component: ChatComponent},
                        {path: 'create-channel', component: CreateChannelComponent},
                        {path: 'invite', component: InviteComponent}
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }