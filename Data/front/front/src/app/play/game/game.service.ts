import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from './position.state';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
export type Match = {
  id: number;
  player1: { id: number, username: string };
  player2: { id: number, username: string };
  winner: { id: number, username: string };
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // public ip = '10.12.8.7';
  gameIsCreated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public ip = 'http://10.13.3.9';
  // public url_base_user = `http://${this.ip}:3000/user`;
  public url_base_match = `http://${this.ip}:3000/match`;
  public socket = new Socket({ url: `${this.ip}:3000/game`, options: { withCredentials: true } });

  constructor(private httpClient: HttpClient,) {
    this.socket.on('invite', (inviterId: string) => {
      const id = parseInt(inviterId);
      const response = confirm(`You have been invited by player id ${id}. Do you accept?`);
      this.socket.emit('inviteResponse', response);
    });
    this.socket.on('startTheGame', () => {
      console.log("startTheGame")
      this.gameIsCreated$.next(true);
    });
  }
  createGame(id2?: number) {
    this.socket.emit('createGame', id2);
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

  public getMatchHistory(id: number) {
    return this.httpClient.get<Match[]>(`${this.url_base_match}/${id}`);
  }


}