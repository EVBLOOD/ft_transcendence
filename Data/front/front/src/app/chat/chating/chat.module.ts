import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class ChatModule { }
