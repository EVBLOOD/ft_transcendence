import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [MatchModule],
  providers: [GameGateway, GameService]
})
export class GameModule { }
