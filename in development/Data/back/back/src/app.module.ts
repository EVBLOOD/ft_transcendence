import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataConf from 'database.config';
import { FriendshipModule } from './friendship/friendship.module';
import { AuthenticatorModule } from './authenticator/authenticator.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { MatchModule } from './match/match.module';
// import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
// import { PunishmentModule } from './chat/punishment/punishment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataConf),
    UserModule,
    FriendshipModule,
    AuthenticatorModule,
    GameModule,
    MatchModule,
    ChatModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      global: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
