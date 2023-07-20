import { Module } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorController } from './authenticator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthStrategy } from './fortytwo.strategy';
import { Token } from './entities/Token.entity';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Statastics])],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService, JwtStrategy, AuthStrategy],
  exports: [AuthenticatorService]
})
export class AuthenticatorModule { }
