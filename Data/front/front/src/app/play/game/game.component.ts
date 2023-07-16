import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
// import { GameScene } from './game.scene';
import Phaser from 'phaser';
// import 'phaser3-nineslice';
import { GameService } from './game.service';
import { Subscription } from 'rxjs';
import { GameScene } from './game.scene';

export enum GameStateType {
  Created = "Created",
  Queue = "Queue",
  Playing = "Playing",
  Finished = "Finished"
};

export enum Player { NotSetYet = 0, One = 1, Two = 2 };
export type Position = { x: number, y: number };
export enum Color { White = 'White', Blue = 'Blue', Green = 'Green' };
export type Score = { player1: number, player2: number };


const RESOLUTION = { width: 1232, height: 685 };
const TARGET_FPS = 60;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, OnDestroy {
  private game!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;
  private gameScene!: GameScene;
  private gameStateSub!: Subscription;

  constructor(private gameService: GameService) {
    this.config = {
      type: Phaser.AUTO,
      width: RESOLUTION.width,
      height: RESOLUTION.height,
      backgroundColor: '#103960',
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
        }
      },
      fps: {
        min: TARGET_FPS,
        target: TARGET_FPS,
        deltaHistory: 10,
        smoothStep: true,
      },
      scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
      },
      scene:
      {
        // preload: this.preloading, 
        // update: this.updating
      },
      audio: {
        noAudio: true,
        disableWebAudio: true,
      },
    };
  }

  ngOnDestroy(): void {
    if (this.gameScene) {
      this.gameScene.destroy();
    }
    this.gameStateSub.unsubscribe();
  }

  // async preloading()
  // {
  //   this.gameService.getState()
  //   .subscribe((payload: string) => {
  //   const state: { gameState: GameStateType, playerNumber: Player, isWin: boolean, color: Color } = JSON.parse(payload);
  //   this.gameScene = new GameScene(this.gameService, state.playerNumber, state.color ?? Color.White);
  //   this.game.scene.add('GameScene', this.gameScene);});
  // }
  ngOnInit() {
    this.game = new Phaser.Game(this.config);
    this.gameStateSub = this.gameService.getState()
      .subscribe((payload: string) => {
        const state: { gameState: GameStateType, playerNumber: Player, isWin: boolean, color: Color } = JSON.parse(payload);
        switch (state.gameState) {
          case GameStateType.Playing: {
            console.log("HERE WE GOO")
            if (!this.gameScene) {
              this.gameScene = new GameScene(this.gameService, state.playerNumber, state.color ?? Color.White);
              this.game.scene.add('GameScene', this.gameScene);

              setTimeout(() => {
                this.gameScene.scene.start();
                this.gameService.playerIsReady()
              }, 0);
              // setTimeout(() => {
              // }, 0);
            }
            break;
          }
          case GameStateType.Finished: {
            if (this.gameScene) {
              console.log("game Finished")
              this.gameScene.win.setVisible(true);
              this.gameScene.winText.setText(state.isWin ? "WON" : "LOST");
              this.gameScene.physics.pause();
            } else {
              console.log("ABORT")
            }
            break;
          }
          default: {
            break;
          }
        }
      })
  }
}
