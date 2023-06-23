import Matter, { Bodies, Body, Common, Engine, Events, Runner, Vector, World } from 'matter-js';
import { Socket } from 'socket.io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from 'src/game/position-state';
import { BALLRADIUS, Color, DAMPINGFACTOR, GAMEHEIGHT, GAMEWIDTH, INITALBALLSPEED, MAXANGLE, PADDLE1POSITION, PADDLE2POSITION, PADDLEHEIGHT, PADDLEWIDTH, PlayerNumber } from './game.service';

export class GameInstance {
  private engine: Matter.Engine;
  private world: Matter.World;
  private runner!: Matter.Runner;
  private paddle1: Matter.Body;
  private paddle2: Matter.Body;
  private ball: Matter.Body;
  private player1Ready: boolean = false;
  private player2Ready: boolean = false;
  private velocity: Matter.Vector;
  public score: { player1: number; player2: number; } = { player1: 0, player2: 0 };
  private speed: number = INITALBALLSPEED;
  private checkBallPaddleColisionInterval: NodeJS.Timer;
  public inactive = false;



  constructor(private player1: Socket, private player2: Socket) {
    console.log("game is created (start)");
    this.engine = Engine.create();
    this.world = this.engine.world;

    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;


    this.velocity = this.getNewStart(GAMEWIDTH, GAMEHEIGHT).velocity;

    this.ball = Bodies.rectangle(GAMEWIDTH / 2, GAMEHEIGHT / 2, BALLRADIUS * 2, BALLRADIUS * 2,
      {
        friction: 0,
        restitution: 0
      }
    );

    // Body.setVelocity(this.ball, this.velocity);
    // Body.setVelocity(this.ball, { x: 0, y: 0 });

    this.paddle1 = Bodies.rectangle(PADDLE1POSITION.x, PADDLE1POSITION.y, PADDLEWIDTH, PADDLEHEIGHT,
      {
        isStatic: true,
        friction: 0,
        restitution: 0
      });

    this.paddle2 = Bodies.rectangle(PADDLE2POSITION.x, PADDLE2POSITION.y, PADDLEWIDTH, PADDLEHEIGHT,
      {
        isStatic: true,
        friction: 0,
        restitution: 0

      });

    World.add(this.world, [this.paddle1, this.paddle2, this.ball]);

    player1.on('ping', () => {
      player1.emit('pong');
    });
    player2.on('ping', () => {
      player2.emit('pong');
    });

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
      this.stopGame();
    });

    player2.on('disconnect', () => {
      player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.stopGame();
    });

    player1.emit('changeState', JSON.stringify({
      gameState: 'Playing', playerNumber: 1, color: Common.choose([Color.White, Color.Blue, Color.Green])
    }));
    player2.emit('changeState', JSON.stringify({
      gameState: 'Playing', playerNumber: 2, color: Common.choose([Color.White, Color.Blue, Color.Green])
    }));


    player1.on('playerIsReady', () => {
      console.log('player1 is ready');
      this.player1Ready = true;

      if (this.player2Ready) {
        this.startGame();
      } else {
        player1.emit('waitingForOpponent');
      }
    });

    player2.on('playerIsReady', () => {
      console.log('player2 is ready');
      this.player2Ready = true;

      if (this.player1Ready) {
        this.startGame();
      } else {
        player2.emit('waitingForOpponent');
      }
    });

    console.log("game is created (finish)");
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
    if (this.runner)
      Runner.stop(this.runner);

    this.player1.off('sendMyPaddleState', (state) => {
      const position = JSON.parse(state);
      Body.setPosition(this.paddle1, position);
      this.player2.emit('updateOpponentPaddle', JSON.stringify({ x: this.paddle1.position.x, y: this.paddle1.position.y }));
    });

    this.player2.off('sendMyPaddleState', (state) => {
      const position = JSON.parse(state);
      Body.setPosition(this.paddle2, position);
      this.player1.emit('updateOpponentPaddle', JSON.stringify({ x: this.paddle2.position.x, y: this.paddle2.position.y }));
    });

    this.player1.off('disconnect', () => {
      this.player2.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.stopGame();
    });

    this.player2.off('disconnect', () => {
      this.player1.emit('changeState', JSON.stringify({ gameState: 'Finished', isWin: true }));
      this.stopGame();
    });

    this.player1.off('playerIsReady', () => {
      console.log('player1 is ready');
      this.player1Ready = true;

      if (this.player2Ready) {
        this.startGame();
      } else {
        this.player1.emit('waitingForOpponent');
      }
    });

    this.player2.off('playerIsReady', () => {
      console.log('player2 is ready');
      this.player2Ready = true;

      if (this.player1Ready) {
        this.startGame();
      } else {
        this.player2.emit('waitingForOpponent');
      }
    });

    this.inactive = true;

  }

  private resetBall() {
    // console.log(this.ball.position);
    this.ball.isSleeping = true;
    setTimeout(() => this.ball.isSleeping = false, 100);
    const newStart = this.getNewStart(GAMEWIDTH, GAMEHEIGHT);
    Body.setPosition(this.ball, newStart.position);
    this.velocity = newStart.velocity;
  }

  private startGame() {
    console.log("Starting The Engine");
    const runner = Runner.create({
      isFixed: true,
      delta: 1000 / 60 // Change the time step value here
    });
    // this.engine.constraintIterations = 20;
    this.engine.velocityIterations = 10;
    this.engine.positionIterations = 10;

    this.runner = Runner.run(runner, this.engine);

    Events.on(this.engine, 'collisionEnd', () => {
      if (Vector.magnitude(this.velocity) > 15) {
        this.velocity.x /= Vector.magnitude(this.velocity);
        this.velocity.y /= Vector.magnitude(this.velocity);
        this.velocity.x *= 15;
        this.velocity.y *= 15;
      }
    });


    Events.on(this.engine, 'collisionActive', (event) => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        if ((bodyA === this.ball && bodyB === this.paddle1) || (bodyB === this.ball && bodyA === this.paddle1)) {
          console.log("ball paddle1 collision", Date.now())
          this.checkBallPaddle1Collision();
        } else if ((bodyA === this.ball && bodyB === this.paddle2) || (bodyB === this.ball && bodyA === this.paddle2)) {
          this.checkBallPaddle2Collision();
        }
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
        this.velocity.y *= -1;
      }

      // console.log("starting")
      Body.setVelocity(this.ball, this.velocity);
      this.sendBallPosition();
    });

    // Events.on(this.engine, 'afterUpdate', () => {

    // });

    setInterval(() => {
      if (this.speed > INITALBALLSPEED) {
        this.velocity.x *= DAMPINGFACTOR;
        this.velocity.y *= DAMPINGFACTOR;
      }
    }, 100);

  }

  private sendBallPosition() {
    const builder = new flatbuffers.Builder();
    const ballStateOffset = PositionState.createPositionState(builder, this.ball.position.x, this.ball.position.y);
    builder.finish(ballStateOffset);
    const buffer = builder.asUint8Array();

    this.player1.emit('updateBallState', buffer);
    this.player2.emit('updateBallState', buffer);
  }

  readonly PADDLEHEIGHTHALF = PADDLEHEIGHT / 2;
  readonly PADDLEWIDTHHALF = PADDLEWIDTH / 2;
  private checkBallPaddle1Collision() {
    if (Math.abs(this.ball.position.x - this.paddle1.position.x) + 0.5 >= (BALLRADIUS + this.PADDLEWIDTHHALF)) {
      if (this.ball.position.y - this.paddle1.position.y < 0) {
        console.log("touch right up", Date.now(), this.ball.position.y - this.paddle1.position.y)
        this.velocity.x = Math.cos(this.degreesToRadians(this.ball.position.y - this.paddle1.position.y)) * this.speed;
        this.velocity.y = Math.sin(this.degreesToRadians(this.ball.position.y - this.paddle1.position.y)) * this.speed;
      }
      else {
        console.log("touch right down", Date.now(), this.ball.position.y / this.paddle1.position.y)
        this.velocity.x = Math.cos(this.degreesToRadians(this.ball.position.y - this.paddle1.position.y)) * this.speed;
        this.velocity.y = Math.sin(this.degreesToRadians(this.ball.position.y - this.paddle1.position.y)) * this.speed;
      }
    } else if (this.paddle1.position.y - this.ball.position.y + 0.5 >= +(BALLRADIUS + this.PADDLEHEIGHTHALF)) {
      console.log("touch up", Date.now())
      this.velocity.x = Math.cos(this.degreesToRadians(-75)) * (this.speed * 1.5);
      this.velocity.y = Math.sin(this.degreesToRadians(-75)) * (this.speed * 1.5);
    } else if (this.ball.position.y - this.paddle1.position.y - 0.5 <= +(BALLRADIUS + this.PADDLEHEIGHTHALF)) {
      console.log("touch down", Date.now())
      this.velocity.x = Math.cos(this.degreesToRadians(+75)) * (this.speed * 1.5);
      this.velocity.y = Math.sin(this.degreesToRadians(+75)) * (this.speed * 1.5);
    }
    if (this.speed < 15)
      this.speed += 1;
  }

  private checkBallPaddle2Collision() {
    if (Math.abs(this.ball.position.x - this.paddle1.position.x) + 0.5 >= (BALLRADIUS + this.PADDLEWIDTHHALF)) {
      if (this.ball.position.y - this.paddle2.position.y < 0) {
        console.log("touch right up", Date.now(), this.ball.position.y / this.paddle2.position.y)
        this.velocity.x = -Math.cos(this.degreesToRadians(this.ball.position.y - this.paddle2.position.y)) * this.speed;
        this.velocity.y = Math.sin(this.degreesToRadians(this.ball.position.y - this.paddle2.position.y)) * this.speed;
      }
      else {
        console.log("touch right down", Date.now(), this.paddle2.position.y / this.ball.position.y)
        this.velocity.x = -Math.cos(this.degreesToRadians(this.ball.position.y - this.paddle2.position.y)) * this.speed;
        this.velocity.y = Math.sin(this.degreesToRadians(this.ball.position.y - this.paddle2.position.y)) * this.speed;
      }
    } else if (this.paddle2.position.y - this.ball.position.y + 0.5 >= +(BALLRADIUS + this.PADDLEHEIGHTHALF)) {
      console.log("touch up", Date.now())
      this.velocity.x = -Math.cos(this.degreesToRadians(-75)) * (this.speed * 1.5);
      this.velocity.y = Math.sin(this.degreesToRadians(-75)) * (this.speed * 1.5);
    } else if (this.ball.position.y - this.paddle2.position.y - 0.5 <= +(BALLRADIUS + this.PADDLEHEIGHTHALF)) {
      console.log("touch down", Date.now())
      this.velocity.x = -Math.cos(this.degreesToRadians(+75)) * (this.speed * 1.5);
      this.velocity.y = Math.sin(this.degreesToRadians(+75)) * (this.speed * 1.5);
    }
    if (this.speed < 15)
      this.speed += 1;
  }

  private getNewStart(gameWidth, gameHeight) {
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

