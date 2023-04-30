import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy }  from './fortytwo.strategy';
// import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { SessionSerializer } from './session.serializer';
// import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthStrategy, AuthService, SessionSerializer],
  // exports: [PassportModule],
})
export class AuthModule {}
