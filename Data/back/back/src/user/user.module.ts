import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.entity';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User, Chat])],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule { }
