import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from 'src/app/game/position-state';

// needs 3 packages
// socket io : npm i --save ngx-socket-io
// flatbuffers :npm i --save flatbuffers
// Phaser: npm i --save phaser
// and
//
// "compilerOptions": {
//   "allowSyntheticDefaultImports": true,
// }
//
//


@Injectable({
  providedIn: 'root'
})
export class GameService {
  // public ip = '10.12.8.7';
  public ip = 'localhost';
  public url_base_user = `http://${this.ip}:3000/user`;
  public url_base_match = `http://${this.ip}:3000/match`;
  public socket = new Socket({ url: `${this.ip}:3001` });

  createGame(id1: number, id2?: number) {
    this.socket.emit('createGame', JSON.stringify({ id1, id2 }));
  }

  getState() {
    return this.socket.fromEvent<string>('changeState')
  }

  sendMyPaddlePosition(position: { x: number, y: number }) {
    const builder = new flatbuffers.Builder();
    const offset = PositionState.createPositionState(builder, position.x, position.y);
    builder.finish(offset);
    const buffer = builder.asUint8Array();

    this.socket.emit('sendMyPaddleState', buffer);
  }

  updateOpponentPaddle() {
    return this.socket.fromEvent<ArrayBuffer>('updateOpponentPaddle');
  }

  updateBallStateEvent() {
    return this.socket.fromEvent<ArrayBuffer>('updateBallState');
  }

  updatePlayerScoreEvent() {
    return this.socket.fromEvent<string>('UpdateScore');
  }

  playerIsReady() {
    this.socket.emit('playerIsReady');
  }

}
