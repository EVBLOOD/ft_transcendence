import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from './position.state';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StatusService } from 'src/app/status.service';
import { hostIp } from 'src/config';

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
  public gameRequest = new BehaviorSubject<number>(0);

  // public ip = '10.12.8.7';
  gameIsCreated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Players$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public Players: any = undefined;
  public ip = hostIp;
  // public url_base_user = `http://${this.ip}:3000/user`;
  public url_base_match = `http://${this.ip}:3000/match`;
  public socket = new Socket({ url: `${this.ip}:3000/game`, options: { withCredentials: true } });
  public isIngame: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.socket.on('startTheGame', (players: any) => {
      this.Players = players;
      this.isIngame = true;
      this.gameIsCreated$.next(true);
    });
    this.socket.on('invite', (inviterId: string) => {
      // console.log("HELLO")
      const id = parseInt(inviterId);
      // const response = confirm(`You have been invited by player id ${id}. Do you accept?`);
      // this.socket.emit('inviteResponse', response);
      this.gameRequest.next(id);
    });
  }


  acceptGame(feed: boolean) {
    // console.log("LOLO", feed)
    this.socket.emit('inviteResponse', feed);
  }
  createGame(id2?: number) {
    this.socket.emit('createGame', id2);
  }
  // { Fplayer: id1, Splayer: id2 }
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

  gameInv() {
    return this.socket.fromEvent<any>('invitation')
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

  gameEnd() {
    // this.socket.emit('disconnect');
    this.socket.disconnect()
    this.socket.connect()

  }

}
