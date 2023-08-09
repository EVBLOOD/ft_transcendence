import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
// import { GameScene } from './game.scene';
import Phaser from 'phaser';
// import 'phaser3-nineslice';
import { GameService } from './game.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GameScene } from './game.scene';
import { ProfileService } from 'src/app/profile/profile.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/auth.service';
import { FriendshipService } from 'src/app/profile/friendship.service';
import { StatusService } from 'src/app/status.service';
import { AboutGamesService } from '../about-games.service';

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


const RESOLUTION = { width: 1428, height: 700 };
const TARGET_FPS = 60;
const CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
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
    [],
  audio: {
    noAudio: true,
    disableWebAudio: true,
  },
  banner: false,
  disableContextMenu: true
};

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnDestroy, OnInit {
  public Myid = -1;
  public Fplayer$ !: Observable<any>;
  public test$ !: Observable<any>;
  public test_$ !: Observable<any>;
  public WinnerNumber1$ !: Observable<any>;
  public WinnerNumber2$ !: Observable<any>;
  public LostNumber1$ !: Observable<any>;
  public LostNumber2$ !: Observable<any>;
  public Splayer$ !: Observable<any>;
  // public auth$ !: Observable<any>;
  public players: any = undefined;
  private game!: Phaser.Game;
  private gameScene!: GameScene;
  private gameStateSub!: Subscription;
  lastTime: boolean = true;
  id !: number;
  id_ !: number;
  hideInv: boolean = false;
  color = [Color.White, Color.Green, Color.Blue]
  themeIndx: number = 1;

  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();

  constructor(private gameService: GameService, public profile: ProfileService, private switchRoute: Router,
    private auth: AuthService, public friends: FriendshipService, private status: StatusService, public statistics: AboutGamesService) {

    // this.auth$ = this.auth.getCurrentUser();
    this.Myid = this.auth.getId();
    this.players = this.gameService.Players;
    this.Fplayer$ = this.profile.getUserData(this.players.Fplayer)
    this.Splayer$ = this.profile.getUserData(this.players.Splayer)
    this.WinnerNumber1$ = this.statistics.playerWinns(this.players.Splayer);
    this.LostNumber1$ = this.statistics.playerLost(this.players.Fplayer);
    this.WinnerNumber2$ = this.statistics.playerWinns(this.players.Fplayer);
    this.LostNumber2$ = this.statistics.playerLost(this.players.Splayer);

    this.removesubsc = this.profile.getUserData(this.players.Fplayer).subscribe((data: any) => {
      if (data) {
        this.test_$ = this.friends.isFriend(data.id.toString());
        this.id = data.id;
      }
    })

    this.SubArray.push(this.removesubsc)
    this.removesubsc = this.profile.getUserData(this.players.Splayer).subscribe((data: any) => {
      if (data) {
        this.test$ = this.friends.isFriend(data.id.toString());
        this.id_ = data.id;
      }
    })

    this.SubArray.push(this.removesubsc)
    this.removesubsc = this.profile.getMyObservData().subscribe((data: any) => {
      this.themeIndx = data.theme;
    })
    this.SubArray.push(this.removesubsc)
  }


  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
    this.gameService.gameEnd()
    this.game?.scene?.remove('GameScene');
    if (this.gameScene)
      this.gameScene?.destroy();
    this.gameStateSub?.unsubscribe();
    this.game?.destroy(true);
    this.status.online();
  }

  ngOnInit(): void {
    this.status.inPlay();
    this.game = new Phaser.Game(CONFIG);
    this.removesubsc = this.gameService.getState()
      .subscribe((payload: string) => {
        const state: { gameState: GameStateType, playerNumber: Player, isWin: boolean, color: Color } = JSON.parse(payload);
        if (state.gameState == GameStateType.Playing) {
          if (!this.gameScene) {
            this.gameScene = new GameScene(this.gameService, state.playerNumber, this.color[this.themeIndx - 1] ?? Color.White);
            // setTimeout(() => {
            this.game.scene.add('GameScene', this.gameScene);
            this.gameScene.scene.start();
            this.gameService.playerIsReady();
            // }, 0);
          }
        } else if (state.gameState == GameStateType.Finished) {
          if (this.gameScene) {
            this.gameScene?.win?.setVisible(true);
            this.gameScene?.winText?.setText(state.isWin ? "WON" : "LOST");
            this.gameScene?.winText?.setStyle({ fontFamily: 'Montserrat', fontWeight: 800 })
            this.gameScene?.physics?.pause();
            setTimeout(() => {
              this.switchRoute.navigateByUrl('/play')
            }, 3000)
          } else {
          }
        }
      })
    this.SubArray.push(this.removesubsc)
  }
  addfriend() {
    this.friends.addFriend(this.id);
    this.hideInv = true;
  }

  addfriend_() {
    this.friends.addFriend(this.id_);
    this.hideInv = true;
  }

}
