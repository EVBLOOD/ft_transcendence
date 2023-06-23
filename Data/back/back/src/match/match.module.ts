import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [TypeOrmModule.forFeature([Match]), MatchService],
})
export class MatchModule { }
