import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from 'src/authenticator/entities/Token.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), AuthenticatorModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
