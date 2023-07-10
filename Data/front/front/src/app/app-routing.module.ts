import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { ApplicationComponent } from './application/application.component';
import { PopupComponent } from './popup/popup.component';


const routes: Routes = 
                      [
                        {path: '', component: ChatComponent},
                        {path: 'create-channel', component: PopupComponent},
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }