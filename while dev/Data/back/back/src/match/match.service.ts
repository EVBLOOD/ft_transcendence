import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Match } from './entities/match.entity';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    private userService: UserService,
    @InjectRepository(Statastics) private readonly StatasticsRepo: Repository<Statastics>
  ) { };

  async create(createMatchDto: CreateMatchDto) {
    const match = new Match();
    match.player1 = await this.userService.findOne(createMatchDto.player1Id);
    match.player2 = await this.userService.findOne(createMatchDto.player2Id);
    match.winner = await this.userService.findOne(createMatchDto.winnerId);
    match.date = new Date();
    this.matchRepository.save(match);
  }

  async getMatchHistory(userId: number) {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .leftJoinAndSelect('match.winner', 'winner')
      .where('player1.id = :userId OR player2.id = :userId', { userId }).orderBy('match.date', 'DESC')
      .getMany();
    return matches.map((match) => {
      return match.player1.id == userId ? {
        id: match.id,
        player1: {
          id: match.player1.id,
          username: match.player1.username,
          avatar: match.player1.avatar,
        },
        player2: {
          id: match.player2.id,
          username: match.player2.username,
          avatar: match.player2.avatar,
        },
        winner: match.winner ? {
          id: match.winner.id,
          username: match.winner.username
        } : null,
        date: match.date.toDateString()
      } : {
        id: match.id,
        player2: {
          id: match.player1.id,
          username: match.player1.username,
          avatar: match.player1.avatar,
        },
        player1: {
          id: match.player2.id,
          username: match.player2.username,
          avatar: match.player2.avatar,
        },
        winner: match.winner ? {
          id: match.winner.id,
          username: match.winner.username
        } : null,
        date: match.date.toDateString()
      }
    })
  }

  async getMatchHistoryView(userId: number) {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .leftJoinAndSelect('match.winner', 'winner')
      .where('player1.id = :userId OR player2.id = :userId', { userId }).orderBy('match.date', 'DESC').take(5)
      .getMany();
    return matches.map((match) => {
      return match.player1.id == userId ? {
        id: match.id,
        player1: {
          id: match.player1.id,
          username: match.player1.username,
          avatar: match.player1.avatar,
        },
        player2: {
          id: match.player2.id,
          username: match.player2.username,
          avatar: match.player2.avatar,
        },
        winner: match.winner ? {
          id: match.winner.id,
          username: match.winner.username
        } : null,
        date: match.date.toDateString()
      } : {
        id: match.id,
        player2: {
          id: match.player1.id,
          username: match.player1.username,
          avatar: match.player1.avatar,
        },
        player1: {
          id: match.player2.id,
          username: match.player2.username,
          avatar: match.player2.avatar,
        },
        winner: match.winner ? {
          id: match.winner.id,
          username: match.winner.username
        } : null,
        date: match.date.toDateString()
      }
    })
  }

  async getLeadering() {
    return (await this.StatasticsRepo.createQueryBuilder('stats')
      .leftJoinAndSelect('stats.User', 'User').orderBy('stats.score', 'DESC').addOrderBy('User.id').getMany()).map((info) => {
        return {
          user: { username: info.User.username, avatar: info.User.avatar, id: info.User.id }, matchPlayed: info.total, win: info.win, ratio: info.score
        }
      })
  }


  async getLeadering_() {
    return (await this.StatasticsRepo.createQueryBuilder('stats')
      .leftJoinAndSelect('stats.User', 'User').orderBy('stats.score', 'DESC').take(5).addOrderBy('User.id').getMany()).map((info) => {
        return {
          user: { username: info.User.username, avatar: info.User.avatar }, matchPlayed: info.total, win: info.win, ratio: info.score
        }
      })
  }

  async getMyLeadering(id: number) {
    let i = 0;
    let ending = {};
    (await this.StatasticsRepo.createQueryBuilder('stats')
      .leftJoinAndSelect('stats.User', 'User').orderBy('stats.score', 'DESC').getMany()).map((info) => {
        i++;
        if (id == info.User.id) {
          ending = {
            rank: i, matchPlayed: info.total, win: info.win, score: info.score
          }
        }
      })
    return ending;
  }

  async getWinnCalc(id1: number, id2: number) {
    return {
      number: (await this.matchRepository
        .createQueryBuilder('match')
        .leftJoinAndSelect('match.player1', 'player1')
        .leftJoinAndSelect('match.player2', 'player2')
        .leftJoinAndSelect('match.winner', 'winner')
        .where('winner.id = :id1 AND (player1.id = :id2 OR player2.id = :id2)', { id1: id1, id2: id2 }).getCount())
    }
  }

}
