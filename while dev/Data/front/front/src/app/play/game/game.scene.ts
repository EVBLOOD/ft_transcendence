import Phaser from 'phaser';
// import 'phaser3-nineslice';
// import { GameService } from '../game.service';
// import { PositionState } from 'src/app/game/position.state';
import * as flatbuffers from 'flatbuffers';
import { Color, Player } from './game.component';
import { Subscription } from 'rxjs';
import { GameService } from './game.service';
import { PositionState } from './position.state';


export class GameScene extends Phaser.Scene {
  readonly paddleSpeed: number = 950;
  readonly interpolationFactor = 0.2;

  private gameHeight = 0;
  private gameWidth = 0;

  private myPaddle!: Phaser.Physics.Arcade.Image;
  private opponentPaddle!: Phaser.Physics.Arcade.Image;
  private ball!: Phaser.GameObjects.Image;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  public scoreText1!: Phaser.GameObjects.Text;
  public scoreText2!: Phaser.GameObjects.Text;
  public latestBallPosition: { x: number; y: number; } = { x: 0, y: 0 };
  public latestOpponentPosition: { x: number; y: number; } = { x: 0, y: 0 };
  public win!: Phaser.GameObjects.Image;
  public background!: Phaser.GameObjects.Image;
  public winText!: Phaser.GameObjects.Text;
  public pingText!: Phaser.GameObjects.Text;


  private updateBallStateEventSub!: Subscription;
  private updateOpponentPaddleSub!: Subscription;
  private updatePlayerScoreEventSub!: Subscription;

  constructor(private gameService: GameService, private playerNumber: Player, private color: Color) {
    super({ key: 'GameScene' });
    // console.log("create GameScene");
  }

  preload() {
    // console.log('start')
    this.load.maxParallelDownloads = 1;
    this.sound.stopAll();
    if (this.color == Color.White) {
      this.load.image('background', '/assets/asset/white/background.png');
      this.load.image('paddle', '/assets/asset/white/paddle.png');
      this.load.image('ball', '/assets/asset/white/ball.png');
      this.load.image('line', '/assets/asset/white/line.png');
    } else {
      if (this.color == Color.Green) {
        this.load.image('background', '/assets/asset/green/background.png');
      } else if (this.color == Color.Blue) {
        this.load.image('background', '/assets/asset/blue/background.png');
      }
      this.load.image('paddle', '/assets/asset/paddle.png');
      this.load.image('ball', '/assets/asset/ball.png');
      this.load.image('line', '/assets/asset/line.png');
    }
    this.load.image('win', '/assets/asset/win.png');
    // console.log('end')
  }

  setupGameObject() {
    // console.log('start 1')
    switch (this.playerNumber) {
      case Player.One:
        {
          this.myPaddle = this.physics.add.image(27, this.gameHeight / 2, 'paddle');
          this.opponentPaddle = this.physics.add.image(this.gameWidth - 27, this.gameHeight / 2, 'paddle');
          break;
        }
      case Player.Two:
        {
          this.myPaddle = this.physics.add.image(this.gameWidth - 27, this.gameHeight / 2, 'paddle');
          this.opponentPaddle = this.physics.add.image(27, this.gameHeight / 2, 'paddle');
          break;
        }
      default:
      // console.log("default")
    }

    this.ball = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'ball');
    this.win = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'win').setVisible(false);
    // console.log('end 1')
  }

  initText() {
    this.winText = this.add.text(this.gameWidth / 2 - 220, this.gameHeight / 2 - 100, '', { fontSize: '169px', fill: '#fff', fontFamily: 'Montserrat' } as Phaser.Types.GameObjects.Text.TextStyle);
    if (this.color == Color.White) {
      this.scoreText1 = this.add.text(555, 20, '0', { fontSize: '40px', fill: '#184E77', fontFamily: 'Montserrat' } as Phaser.Types.GameObjects.Text.TextStyle);
      this.scoreText2 = this.add.text(this.gameWidth - 555, 20, '0', { fontSize: '40px', fill: '#184E77', fontFamily: 'Montserrat' } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(1, 0);
    } else {
      this.scoreText1 = this.add.text(555, 20, '0', { fontSize: '40px', fill: '#fff', fontFamily: 'Montserrat' } as Phaser.Types.GameObjects.Text.TextStyle);
      this.scoreText2 = this.add.text(this.gameWidth - 555, 20, '0', { fontSize: '40px', fill: '#fff', fontFamily: 'Montserrat' } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(1, 0);
    }
  }

  create() {
    // console.log("create GameScene start")
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.cursors = this.input?.keyboard?.createCursorKeys()!;
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background.displayWidth = this.gameWidth;
    this.background.displayHeight = this.gameHeight;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'line')
    // this.cameras.main.setBackgroundColor('#103960');
    this.setupGameObject();
    this.initText();

    this.updateBallStateEventSub = this.gameService.updateBallStateEvent()
      .subscribe((state: ArrayBuffer) => {
        const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
        const ballState = PositionState.getRootAsPositionState(buffer);

        const x = ballState.x();
        const y = ballState.y();
        this.latestBallPosition = { x, y };
        this.ball.setPosition(this.latestBallPosition.x, this.latestBallPosition.y);
      });
    this.updateOpponentPaddleSub = this.gameService.updateOpponentPaddle()
      .subscribe((state: ArrayBuffer) => {
        const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
        const paddleState = PositionState.getRootAsPositionState(buffer);

        const x = paddleState.x();
        const y = paddleState.y();
        this.latestOpponentPosition = { x, y };
        this.opponentPaddle.setPosition(this.latestOpponentPosition.x, this.latestOpponentPosition.y);
      });

    this.updatePlayerScoreEventSub = this.gameService.updatePlayerScoreEvent()
      .subscribe((payload: string) => {
        const score: {
          player1: number, player2: number
        } = JSON.parse(payload);
        // console.log("score parsed", score);
        this.scoreText1.setText(`${score.player1}`)
        this.scoreText2.setText(`${score.player2}`)
      })



    // console.log("create GameScene end")
  }

  destroy() {
    // console.log("scene destroyed");
    this.updateBallStateEventSub?.unsubscribe();
    this.updateOpponentPaddleSub?.unsubscribe();
    this.updatePlayerScoreEventSub?.unsubscribe();
  }

  private previousY = 0;
  override update() {
    // console.log('update')
    // console.log(this.myPaddle.y, this.previousY);
    if (this.myPaddle.body?.velocity) {
      if (this.cursors.up.isDown) {
        this.myPaddle.setVelocityY(-this.paddleSpeed);
      } else if (this.cursors.down.isDown) {
        this.myPaddle.setVelocityY(this.paddleSpeed);
      } else if (this.myPaddle.body.velocity.y != 0) {
        this.myPaddle.setVelocityY(0);
      }


      // this.myPaddle.body.velocity.lerp(newPaddleVelocity, this.interpolationFactor);

      this.myPaddle.setY(Phaser.Math.Clamp(this.myPaddle.y,
        this.myPaddle.height / 2 + 15,
        this.gameHeight - this.myPaddle.height / 2 - 15
      ))

      if (this.myPaddle.y != this.previousY) {
        this.gameService.sendMyPaddlePosition({ x: this.myPaddle.x, y: this.myPaddle.y });
      }
      this.previousY = this.myPaddle.y;
    }
  }

}
