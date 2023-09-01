import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
// import { UservalidatingPipe } from './uservalidating/uservalidating.pipe';
import { FriendshipGateway } from './friendship/friendship.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User]), AuthenticatorModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipGateway]
}) 
export class FriendshipModule {}
