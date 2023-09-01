import Matter, { Bodies, Body, Common, Engine, Events, Runner, Vector, World } from 'matter-js';
import { Socket } from 'socket.io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from 'src/game/position-state';
import { BALLRADIUS, Color, DAMPINGFACTOR, GAMEHEIGHT, GAMEWIDTH, INITALBALLSPEED, MAXANGLE, PADDLE1POSITION, PADDLE2POSITION, PADDLEHEIGHT, PADDLEWIDTH, PlayerNumber } from './game.service';

export class GameInstance {
  private engine: Matter.Engine;
  private world: Matter.World;
  // private runner!: Matter.Runner;
  private paddle1: Matter.Body;
  private paddle2: Matter.Body;
  private ball: Matter.Body;// = new Matter.Body();
  private player1Ready: boolean = false;
  private player2Ready: boolean = false;
  public score: { player1: number; player2: number; } = { player1: 0, player2: 0 };
  private speed: number = INITALBALLSPEED;
  private checkBallPaddleColisionInterval: NodeJS.Timer;
  public inactive = false;
  public toRemove = false;
  loop: NodeJS.Timer;
  // private velocity: Vector = { x: 0, y: 0 };



  constructor(public player1: Socket, public player2: Socket) {
    // console.log("game is created (start)");
    this.engine = Engine.create();
    let engine2 = Engine.create();

    if (this.engine == engine2) {
      // console.log("[DEBUG] the same ref");
    } else {
      // console.log("[DEBUG] not the same ref");
    }
    this.world = this.engine.world;

    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;




    this.ball = Bodies.rectangle(GAMEWIDTH / 2, GAMEHEIGHT / 2, BALLRADIUS * 2, BALLRADIUS * 2,
      {
        friction: 1,
        restitution: 0.1
      }
    );

    this.paddle1 = Bodies.rectangle(PADDLE1POSITION.x, PADDLE1POSITION.y, PADDLEWIDTH, PADDLEHEIGHT,
      {
        isStatic: true,
        friction: 1,
        restitution: 0.1
      });

    this.paddle2 = Bodies.rectangle(PADDLE2POSITION.x, PADDLE2POSITION.y, PADDLEWIDTH, PADDLEHEIGHT,
      {
        isStatic: true,
        friction: 1,
        restitution: 0.1
      });

    Body.setVelocity(this.ball, this.getNewStart(GAMEWIDTH, GAMEHEIGHT).velocity);

    World.add(this.world, [this.paddle1, this.paddle2, this.ball]);


    player1.on('sendMyPaddleState', (state) => {
      const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
      const paddleState = PositionState.getRootAsPositionState(buffer);

      const x = paddleState.x();
      const y = paddleState.y();
      Body.setPosition(this.paddle1, { x, y });

      const builder = new flatbuffers.Builder();
      const offset = PositionState.createPositionState(builder, this.paddle1.position.x, this.paddle1.position.y);
      builder.finish(offset);


      player2.emit('updateOpponentPaddle', builder.asUint8Array());
    });

    player2.on('sendMyPaddleState', (state) => {
      const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
      const paddleState = PositionState.getRootAsPositionState(buffer);

      const x = paddleState.x();
      const y = paddleState.y();
      Body.setPosition(this.paddle2, { x, y });

      player1.emit('updateOpponentPaddle', state);
    });

    player1.on('disconnect', () => {
      player2.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.score.player1 = 0;
      this.score.player2 = 1;
      this.stopGame();
    });

    player2.on('disconnect', () => {
      player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.score.player1 = 1;
      this.score.player2 = 0;
      this.stopGame();
    });

    setTimeout(() => {
      player1.emit('changeState', JSON.stringify({
        gameState: 'Playing', playerNumber: 1, color: Common.choose([Color.White, Color.Blue, Color.Green])
      }));
      player2.emit('changeState', JSON.stringify({
        gameState: 'Playing', playerNumber: 2, color: Common.choose([Color.White, Color.Blue, Color.Green])
      }));

    }, 1000)


    player1.on('playerIsReady', () => {
      // console.log('player1 is ready');
      this.player1Ready = true;

      if (this.player2Ready) {
        this.startGame();
      } else {
        player1.emit('waitingForOpponent');
      }
    });

    player2.on('playerIsReady', () => {
      // console.log('player2 is ready');
      this.player2Ready = true;

      if (this.player1Ready) {
        this.startGame();
      } else {
        player2.emit('waitingForOpponent');
      }
    });

    // console.log("game is created (finish)");
  }

  private setPlayerWon(player: PlayerNumber) {
    if (player === PlayerNumber.One) {
      this.player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.player2.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: false }));
    } else {
      this.player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: false }));
      this.player2.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
    }
  }


  private updateScore() {
    this.player1.emit('UpdateScore', JSON.stringify(this.score));
    this.player2.emit('UpdateScore', JSON.stringify(this.score));
  }

  private stopGame() {
    // clearInterval(this.checkBallPaddleColisionInterval);
    World.remove(this.world, [this.paddle1, this.paddle2, this.ball]);
    World.clear(this.world, false);
    Engine.clear(this.engine);
    clearInterval(this.loop);
    // if (this.runner)
    //   Runner.stop(this.runner);

    this.player1.removeAllListeners();
    this.player2.removeAllListeners();
    // this.player1.off('sendMyPaddleState', (state) => {
    //   const position = JSON.parse(state);
    //   Body.setPosition(this.paddle1, position);
    //   this.player2.emit('updateOpponentPaddle', JSON.stringify({ x: this.paddle1.position.x, y: this.paddle1.position.y }));
    // });

    // this.player2.off('sendMyPaddleState', (state) => {
    //   const position = JSON.parse(state);
    //   Body.setPosition(this.paddle2, position);
    //   this.player1.emit('updateOpponentPaddle', JSON.stringify({ x: this.paddle2.position.x, y: this.paddle2.position.y }));
    // });
    // this.player1.off('disconnect', () => {
    //   this.player2.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
    //   this.score.player1 = 0;
    //   this.score.player2 = 1;
    //   // I mean why req
    //   this.stopGame();
    // });

    // this.player2.off('disconnect', () => {
    //   this.player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
    //   this.score.player1 = 1;
    //   this.score.player2 = 0;
    //   // I mean why req
    //   this.stopGame();
    // });

    // this.player1.off('playerIsReady', () => {
    //   console.log('player1 is ready');
    //   this.player1Ready = true;

    //   if (this.player2Ready) {
    //     this.startGame();
    //   } else {
    //     this.player1.emit('waitingForOpponent');
    //   }
    // });

    // this.player2.off('playerIsReady', () => {
    //   console.log('player2 is ready');
    //   this.player2Ready = true;

    //   if (this.player1Ready) {
    //     this.startGame();
    //   } else {
    //     this.player2.emit('waitingForOpponent');
    //   }
    // });

    this.inactive = true;

  }

  private resetBall() {
    this.ball.isSleeping = true;
    setTimeout(() => this.ball.isSleeping = false, 100);
    const newStart = this.getNewStart(GAMEWIDTH, GAMEHEIGHT);
    Body.setPosition(this.ball, newStart.position);
    Body.setVelocity(this.ball, newStart.velocity);
  }

  private startGame() {
    // console.log("Starting The Engine");
    const runner = Runner.create({
      isFixed: true,
      delta: 1000 / 60
    });
    this.engine.velocityIterations = 10;
    this.engine.positionIterations = 10;

    this.loop = setInterval(() => {
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);

    Events.on(this.engine, 'collisionStart', (event) => {
      const pair = event.pairs[0];
      if (pair.bodyA == this.ball) {
        this.handleBallPaddleCollision(pair.bodyB);
      } else {
        this.handleBallPaddleCollision(pair.bodyA);
      }
    });

    Events.on(this.engine, 'afterUpdate', () => {
      if (this.ball.position.x < -50) {
        this.score.player2 += 1;
        this.updateScore();
        if (this.score.player2 == 7) {
          this.setPlayerWon(PlayerNumber.Two);
          this.stopGame();
        } else {
          this.resetBall();
        }
      } else if (this.ball.position.x > GAMEWIDTH + 50) {
        this.score.player1 += 1;
        this.updateScore();
        if (this.score.player1 == 7) {
          this.setPlayerWon(PlayerNumber.One);
          this.stopGame();
        } else {
          this.resetBall();
        }
      }

      if ((this.ball.velocity.y > 0 && this.ball.position.y + BALLRADIUS >= GAMEHEIGHT - 5)
        || (this.ball.velocity.y < 0 && this.ball.position.y - BALLRADIUS <= 5)) {
        // const velocity = this.ball.velocity;
        const velocity = this.ball.velocity;
        velocity.y *= -1;
        Body.setVelocity(this.ball, velocity);
      }

      const magnitude = Vector.magnitude(this.ball.velocity);
      Body.setVelocity(this.ball, { x: this.ball.velocity.x / magnitude * this.speed, y: this.ball.velocity.y / magnitude * this.speed });
      this.sendBallPosition();
    });

    // Events.on(this.engine, 'afterUpdate', () => {

    // });
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  private sendBallPosition() {
    const builder = new flatbuffers.Builder();
    const ballStateOffset = PositionState.createPositionState(builder, this.ball.position.x, this.ball.position.y);
    builder.finish(ballStateOffset);
    const buffer = builder.asUint8Array();

    this.player1.emit('updateBallState', buffer);
    this.player2.emit('updateBallState', buffer);
  }

  // readonly PADDLEHEIGHTHALF = PADDLEHEIGHT / 2;
  // readonly PADDLEWIDTHHALF = PADDLEWIDTH / 2;
  private handleBallPaddleCollision(paddle: Matter.Body) {
    const angle = this.clamp((this.ball.position.y - paddle.position.y), -70, 70);
    // console.log("angle", this.ball.position.y - paddle.position.y, angle);
    const sign = (this.ball.position.x - paddle.position.x) < 0 ? -1 : 1;
    const velocity = {
      x: sign * this.speed * Math.cos(this.degreesToRadians(angle)),
      y: this.speed * Math.sin(this.degreesToRadians(angle)),
    }
    Body.setVelocity(this.ball, velocity);
    if (this.speed < 17)
      this.speed += 1;
  }

  // private checkBallPaddle2Collision() {
  //   const angle = this.clamp((this.ball.position.y - this.paddle2.position.y), -50, 50);
  //   const sign = (this.ball.position.x - this.paddle2.position.x) < 0 ? -1 : 1;
  //   const velocity = {
  //     x: sign * this.speed * Math.cos(this.degreesToRadians(angle)),
  //     y: this.speed * Math.sign(this.degreesToRadians(angle)),
  //   }
  //   Body.setVelocity(this.ball, velocity);

  //   if (this.speed < 17)
  //     this.speed += 1;

  // }

  private getNewStart(gameWidth: number, gameHeight: number) {
    this.speed = INITALBALLSPEED;
    const angle = Common.random(Common.choose([-1, 1]) * 25, Common.choose([-1, 1]) * 55);
    const angleRad = this.degreesToRadians(angle);

    const directionX = Common.choose([-1, 1]) * Math.cos(angleRad);
    const directionY = Common.choose([-1, 1]) * Math.sin(angleRad);

    const velocity = {
      x: directionX * INITALBALLSPEED,
      y: directionY * INITALBALLSPEED,
    };

    const position = {
      x: gameWidth / 2,
      y: this.getRandomNumberRange(0, gameHeight),
    };

    return { position, velocity };
  }

  private degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  private getRandomNumberRange(min: number, max: number) {
    return Common.random(min, max);
  }
}

