import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { ApplicationComponent } from './application/application.component';


const routes: Routes = 
                      [
                        {path: '', component: ChatComponent},
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }