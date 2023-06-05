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

@Module({
  imports: [TypeOrmModule.forRoot(DataConf), UserModule, PassportModule.register({session: true}),
            FriendshipModule, AuthenticatorModule,  JwtModule.register({
              global: true,
              secret: 'secret',
              signOptions: { expiresIn: '60s' },
            }),ConfigModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

