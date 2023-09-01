import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statastics } from './statistics/entities/statistics.entity';

@Module({
  imports: [MatchModule, AuthenticatorModule, TypeOrmModule.forFeature([User, Statastics])],
  providers: [GameGateway, GameService]
})
export class GameModule { }
