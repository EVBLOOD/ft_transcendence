import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from 'src/authenticator/entities/Token.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
import { CurrentStatusGateway } from './current_status/current_status.gateway';
// import { Match } from 'src/match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), AuthenticatorModule],
  controllers: [UserController],
  providers: [UserService, CurrentStatusGateway],
  exports: [UserService]
})
export class UserModule {}
