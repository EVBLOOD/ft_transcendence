import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserModule } from 'src/user/user.module';
// import { User } from 'src/user/entities/user.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Match, Statastics]), AuthenticatorModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule { }
