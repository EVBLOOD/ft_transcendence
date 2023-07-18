import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Match } from './entities/match.entity';

// needs User entity and UserService
//
@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    private userService: UserService
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
      .where('player1.id = :userId OR player2.id = :userId', { userId }).orderBy('match.date')
      .getMany();

    return matches.map(match => ({
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
    }))

  }

  async getMatchHistoryView(userId: number) {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .leftJoinAndSelect('match.winner', 'winner')
      .where('player1.id = :userId OR player2.id = :userId', { userId }).orderBy('match.date', 'DESC').take(5)
      .getMany();

    return matches.map(match => ({
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
    }))
  }

}
