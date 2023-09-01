import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameInstance } from './GameInstance';
import { MatchService } from 'src/match/match.service';
import { sampleSize } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Statastics } from './statistics/entities/statistics.entity';
import { Repository } from 'typeorm';

// install flatbuffers and socket io and matter js and class-validator
// @types/matter-js --dev
// loop: NodeJS.Timer;
// clearInterval(this.loop);
// this.loop = setInterval(() => {
//   Engine.update(this.engine, 1000 / 60);
// }, 1000 / 60);
// this.queue = this.queue.filter(player => player.id !== player1Id && player.id !== player2Id);
export const GAMEWIDTH = 1428;
export const GAMEHEIGHT = 700;
export const BALLRADIUS = 10;
export const PADDLEWIDTH = 12;
export const PADDLEHEIGHT = 119;
export const PADDLE1POSITION = { x: 27, y: GAMEHEIGHT / 2 };
export const PADDLE2POSITION = { x: GAMEWIDTH - 27, y: GAMEHEIGHT / 2 };
export const MAXANGLE = Math.PI / 4;
export const INITALBALLSPEED = 10;
export const DAMPINGFACTOR = 0.99;

export enum PlayerNumber { One, Two };
export enum Color { White = 'White', Blue = 'Blue', Green = 'Green' };

@Injectable()
export class GameService {
  private queue: Array<{ id: number, socket: Socket }> = [];
  private currentPlayers = new Array<{ id: number, socket: Socket }>();
  private activeGameInstances: { [key: string]: GameInstance } = {};
  public onlineUsers = new Map<number, Set<Socket>>();

  // a service to know the connected users 
  constructor(private matchService: MatchService, @InjectRepository(Statastics) private readonly StatisticsRepo: Repository<Statastics>) {
    setInterval(() => {
      // console.log("queue :", this.queue.map(_ => _.id));
      // console.log("active game instances :", Object.keys(this.activeGameInstances));
      // console.log("current players :", this.currentPlayers.map(_ => _.id));
      // console.log("ONLINE USERS", this.onlineUsers.map(_ => _.id));
      // console.log("queue :", this.queue.length);
      // console.log("active game instances :", this.activeGameInstances);
      // console.log("current players :", this.currentPlayers.length);
      // console.log("ONLINE USERS", this.onlineUsers.size);
      Object.entries(this.activeGameInstances).forEach(([key, value]) => {
        if (value.inactive) {
          const player1Id: number = parseInt(key.split(',')[0]);
          const player2Id: number = parseInt(key.split(',')[1]);
          this.currentPlayers = this.currentPlayers.filter(player => player.id !== player1Id && player.id !== player2Id);
          this.queue = this.queue.filter(player => player.id !== player1Id && player.id !== player2Id);
          this.matchService.create(
            {
              player1Id,
              player2Id,
              winnerId: value.score.player1 > value.score.player2 ? player1Id : player2Id,
            })
          this.StatisticsRepo.createQueryBuilder().update().set({
            total: () => 'total + 1',
            score: () => `score + (${value.score.player1 > value.score.player2 ? 3 : -1})`,
            win: () => `win + (${value.score.player1 > value.score.player2 ? 1 : 0})`
          }).where("User = :user", { user: player1Id })
            .execute();

          this.StatisticsRepo.createQueryBuilder().update().set({
            total: () => 'total + 1',
            score: () => `score + (${value.score.player2 > value.score.player1 ? 3 : -1})`,
            win: () => `win + (${value.score.player2 > value.score.player1 ? 1 : 0})`
          }).where("User = :user", { user: player2Id })
            .execute();
          value.toRemove = true;
        }
      });
      // TODO: datarace ! if a game is done but you didn't add match history !!
      this.activeGameInstances = Object.entries(this.activeGameInstances)
        .filter(([_, gameInstance]) => !gameInstance.toRemove)
        .reduce((result, [key, value]) => {
          result[key] = value;
          return result;
        }, {});

      if (this.queue.length >= 2) {
        let [player1, player2]: { id: number, socket: Socket }[] = sampleSize(this.queue, 2);
        if (this.onlineUsers.get(player1.id).has(player1.socket) && this.onlineUsers.get(player2.id).has(player2.socket)) {
          player1.socket.emit('startTheGame', { Fplayer: player1.id, Splayer: player2.id })
          player2.socket.emit('startTheGame', { Fplayer: player1.id, Splayer: player2.id })
          this.queue = this.queue.filter(player => player.id !== player1.id && player.id !== player2.id);
          this.activeGameInstances[`${player1.id},${player2.id}`] = new GameInstance(player1.socket, player2.socket);
          this.currentPlayers.push(player1);
          this.currentPlayers.push(player2);
        }
        else if (!this.onlineUsers.get(player1.id).has(player1.socket))
          this.queue = this.queue.filter((elemets) => { return elemets.id != player1.id });
        else if (!this.onlineUsers.get(player1.id).has(player1.socket))
          this.queue = this.queue.filter((elemets) => { return elemets.id != player2.id });
      }
      // console.log("after", process.memoryUsage())
    }, 200);
  }

  createGame(socket: Socket, payload: any) {
    const { id1, id2 } = payload;
    // console.log({ id1, id2 });
    if (this.currentPlayers.find(player => player.id == id1)) {
      // socket.emit("in_game")
      return;
    }
    if (id2 && this.currentPlayers.find(player => player.id == id2)) {
      // socket.emit("opponent_in_game")
      return;
    }

    if (!id2) {
      if (!this.queue.find(player => player.id === id1)) {
        this.queue.push({ id: id1, socket })
        socket.emit('changeState', JSON.stringify({ gameState: 'Queue' }));
      }
      else {
        this.queue = this.queue.filter((elements) => {
          return elements.id != id1;
        })
        this.queue.push({ id: id1, socket })
        socket.emit('changeState', JSON.stringify({ gameState: 'Queue' }));
      }
    } else {
      const invitedUser = this.onlineUsers.get(id2);
      if (invitedUser) {
        invitedUser.forEach((socket_) => {
          socket_.emit('invite', id1);
          socket_.removeAllListeners("inviteResponse"); // NEW ADDED
          socket_.once('inviteResponse', (response) => {
            invitedUser.forEach((socket__) => {
              if (socket__.id == socket_.id && response == true &&
                !this.currentPlayers.find(player => player.id === id2) && !this.currentPlayers.find(player => player.id === id1) && this.onlineUsers.get(id1)?.has(socket)) {
                if (this.queue.find(player => player.id === id1))
                  this.queue = this.queue.filter((elemets) => { return elemets.id != id1 });
                if (this.queue.find(player => player.id === id2))
                  this.queue = this.queue.filter((elemets) => { return elemets.id != id2 });
                socket.emit('startTheGame', { Fplayer: id1, Splayer: id2 })
                socket__.emit('startTheGame', { Fplayer: id1, Splayer: id2 })
                this.currentPlayers.push(
                  { id: id1, socket: socket }
                )
                this.currentPlayers.push(
                  { id: id2, socket: socket__ }
                )
                this.activeGameInstances[`${id1},${id2}`] = new GameInstance(socket, socket__);
                this.currentPlayers.push({ id: id2, socket: socket__ });
                this.currentPlayers.push({ id: id1, socket: socket });
              }
            })
          })
        })
      } else {
        // console.log('user is offline', id2);
      }
    }
  }


  // handleDisconnect(socket: any) {
  //   socket.on('disconnect', () => {
  //     this.queue = this.queue.filter(player => player.socket !== socket);
  //     socket.removeAllListeners('disconnect');
  //   });
  // }

}
