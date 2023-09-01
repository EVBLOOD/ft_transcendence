import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [GameComponent, ],
})
export class GameModule { }