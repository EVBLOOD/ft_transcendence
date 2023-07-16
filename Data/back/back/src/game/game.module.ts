import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';

@Module({
  imports: [MatchModule, AuthenticatorModule],
  providers: [GameGateway, GameService]
})
export class GameModule { }
